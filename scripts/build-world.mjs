// Builds the globe data in src/features/travel/data/ from Natural Earth 1:50m map units.
// Run with `npm run build:world` (needs network). The output is committed, so builds never run this.
//
// Map units, not countries, so that parts of a country can be highlighted on their own:
// the UK is four units (GB-ENG, GB-SCT, GB-WLS, GB-NIR) and overseas territories with their own
// ISO code (French Guiana, Svalbard, …) stay separate. Everything else is merged by ISO code,
// which is why Portugal includes the Azores and Madeira.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_map_units.geojson';
const MAPSHAPER = 'mapshaper@0.7.101';
const OUT = fileURLToPath(new URL('../src/features/travel/data/', import.meta.url));

// Coordinates are stored as integers, this many per degree (0.05° is about half a pixel at full zoom).
const SCALE = 20;
// Share of the 1:50m vertices kept. Shared borders are simplified once, so neighbours still meet.
const KEEP = '16%';
// Islands smaller than this are dropped unless they are all a place has.
const MIN_ISLAND_KM2 = 120;

const dir = mkdtempSync(join(tmpdir(), 'world-'));
try {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`${SOURCE}: ${response.status}`);
  writeFileSync(join(dir, 'source.json'), await response.text());

  execFileSync(
    'npx',
    [
      '--yes',
      MAPSHAPER,
      '-i',
      join(dir, 'source.json'),
      'name=units',
      '-each',
      "id = ADM0_A3 == 'GBR' ? 'GB-' + GU_A3 : ISO_A2_EH != '-99' ? ISO_A2_EH : ADM0_A3",
      '-dissolve',
      'id',
      'calc=name = first(GEOUNIT), country = first(ADMIN), units = count()',
      // keep-shapes protects one ring per feature, so islands are simplified as features of their
      // own and put back together afterwards. Without this the Azores collapse to nothing.
      '-explode',
      '-simplify',
      'weighted',
      KEEP,
      'keep-shapes',
      '-dissolve',
      'id',
      'copy-fields=name,country,units',
      '-innerlines',
      '+',
      'name=borders',
      '-o',
      'target=*',
      'format=geojson',
      dir,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  const read = (name) => JSON.parse(readFileSync(join(dir, name), 'utf8'));

  // One line or ring as [lon, lat, dlon, dlat, …] in 1/SCALE degrees, without repeated points.
  const encode = (points, closed) => {
    const out = [];
    let px = 0;
    let py = 0;
    const last = closed ? points.length - 1 : points.length;
    for (let i = 0; i < last; i++) {
      const [lon, lat] = points[i];
      // Natural Earth closes Antarctica with a run along the bottom edge of the flat map.
      // On a sphere that is a spike to the pole, so those points go.
      if (lat < -89) continue;
      const x = Math.round(lon * SCALE);
      const y = Math.round(lat * SCALE);
      if (out.length && x === px && y === py) continue;
      out.push(x - px, y - py);
      px = x;
      py = y;
    }
    return out;
  };
  const minLength = (min) => (line) => line.length >= min * 2;
  // Shoelace area of a ring, close enough for a size threshold.
  const areaKm2 = (ring) => {
    let sum = 0;
    let lat = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
      lat += ring[i][1];
    }
    return (
      (Math.abs(sum) / 2) * 111.32 ** 2 * Math.cos((lat / (ring.length - 1)) * (Math.PI / 180))
    );
  };

  const names = {};
  const countries = {};
  for (const { properties: p, geometry } of read('units.json').features.sort((a, b) =>
    a.properties.id.localeCompare(b.properties.id),
  )) {
    if (!geometry) continue;
    // Largest first, so a place made only of small islands keeps its biggest one.
    const polygons = (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates)
      .map((polygon) => ({ polygon, area: areaKm2(polygon[0]) }))
      .sort((a, b) => b.area - a.area);
    const rings = polygons
      .filter(({ area }, i) => i === 0 || area >= MIN_ISLAND_KM2)
      .flatMap(({ polygon }) => polygon)
      .map((ring) => encode(ring, true))
      .filter(minLength(3));
    // A place smaller than the coordinate grid cannot be drawn, so it gets no code either.
    if (!rings.length) continue;
    names[p.id] = p.units > 1 ? p.country : p.name;
    countries[p.id] = rings;
  }

  // Lines carry no attributes, so mapshaper writes them as a bare GeometryCollection.
  const borders = read('borders.json')
    .geometries.flatMap((g) => (g.type === 'LineString' ? [g.coordinates] : g.coordinates))
    .map((line) => encode(line, false))
    .filter(minLength(2));

  writeFileSync(join(OUT, 'world.json'), JSON.stringify({ scale: SCALE, countries, borders }));

  const file = join(OUT, 'countries.ts');
  const source = `// Generated by scripts/build-world.mjs. Do not edit: run \`npm run build:world\`.
export const countryNames = ${JSON.stringify(names)} as const;

export type CountryCode = keyof typeof countryNames;
`;
  writeFileSync(file, await format(source, { ...(await resolveConfig(file)), filepath: file }));

  const count = (lines) => lines.reduce((n, line) => n + line.length / 2, 0);
  process.stdout.write(
    `${Object.keys(countries).length} places, ${count(Object.values(countries).flat())} ring points, ${count(borders)} border points\n`,
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}

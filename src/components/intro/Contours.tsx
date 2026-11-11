'use client';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';
import { CONTOUR_DRAW_STAGGER, CONTOUR_POINTER_DRIFT_PX } from '@/design-system/motion';

// Copied from design/reference/home-dark-1440.html (svg.topo).
const CONTOUR_PATHS = [
  'M370 260C373 267 373 278 367 284C360 289 342 292 331 293C320 294 310 290 300 290C290 291 280 295 268 294C257 293 238 290 232 284C225 279 227 267 230 260C233 253 245 248 251 243C258 237 261 232 269 227C277 223 290 217 300 217C310 217 323 222 332 226C340 230 344 236 350 242C357 248 367 253 370 260Z',
  'M441 260C446 273 442 295 428 306C414 316 378 318 357 320C335 323 320 318 300 319C280 320 258 330 237 327C215 325 181 317 170 306C159 295 165 273 171 260C177 247 194 237 205 226C216 215 222 202 238 193C253 185 280 177 300 178C320 178 341 191 357 199C373 207 383 215 397 226C410 236 435 247 441 260Z',
  'M516 260C523 280 511 312 488 327C465 341 412 342 381 346C349 350 330 347 300 350C270 352 235 367 203 363C172 359 128 344 113 326C99 309 111 280 117 260C124 240 140 226 154 208C168 191 178 168 203 156C227 145 270 137 300 140C330 144 356 163 380 175C404 186 422 194 445 209C467 223 509 240 516 260Z',
  'M594 260C602 286 576 328 544 347C512 365 444 364 404 371C363 377 339 379 300 384C261 388 209 406 169 400C129 393 79 368 62 345C45 321 61 286 67 260C73 234 82 212 98 188C115 164 132 130 166 117C199 103 261 100 300 106C339 112 368 139 400 153C433 167 464 173 496 190C528 208 586 234 594 260Z',
  'M672 260C680 292 636 342 595 365C554 387 477 386 427 396C378 405 349 416 300 422C251 429 182 447 135 436C88 426 37 390 18 360C-2 331 15 292 18 260C21 228 17 197 36 166C54 135 83 91 127 76C171 61 251 67 300 76C349 85 378 116 420 132C462 148 510 149 552 171C594 192 665 228 672 260Z',
  'M748 260C752 299 690 354 640 381C591 408 509 409 453 423C396 437 359 458 300 466C241 474 155 487 101 472C48 456 3 409 -19 373C-41 338 -29 299 -31 260C-34 221 -53 179 -33 142C-13 104 34 51 89 35C145 20 241 37 300 49C359 62 388 94 440 110C493 127 561 124 612 149C663 174 743 221 748 260Z',
  'M817 260C817 305 737 363 681 395C625 427 545 433 481 453C418 473 368 505 300 514C232 522 129 526 71 504C12 483 -24 425 -50 384C-76 344 -75 305 -85 260C-94 215 -130 159 -108 115C-85 71 -15 12 53 -3C121 -18 232 10 300 25C368 40 400 69 463 86C526 103 618 97 677 126C735 155 816 215 817 260Z',
  'M877 260C873 311 778 370 717 408C657 446 583 462 514 488C444 514 378 558 300 565C222 573 106 562 44 533C-19 505 -44 439 -76 393C-107 348 -125 311 -144 260C-162 209 -212 137 -185 88C-158 38 -61 -25 19 -39C100 -53 222 -13 300 3C378 19 416 41 490 58C564 74 679 69 743 102C808 136 882 209 877 260Z',
] as const;

// Reduced motion: no animation at all (the tokens.css reset keeps delays, so the rings would
// sit mid-delay). Paths then render fully drawn.
// Match --animate-contour-draw (2.8s) and the reference's -1.5s breathe stagger.
const DRAW_S = 2.8;
const BREATHE_STAGGER_S = 1.5;

const clamp = (v: number) =>
  Math.max(-CONTOUR_POINTER_DRIFT_PX, Math.min(CONTOUR_POINTER_DRIFT_PX, v));

const Contours = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const driftX = useSpring(x, { stiffness: 40, damping: 20 });
  const driftY = useSpring(y, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (
      !matchMedia('(pointer: fine)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const onMove = (e: PointerEvent) => {
      x.set(clamp((e.clientX / window.innerWidth - 0.5) * 2 * CONTOUR_POINTER_DRIFT_PX));
      y.set(clamp((e.clientY / window.innerHeight - 0.5) * 2 * CONTOUR_POINTER_DRIFT_PX));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-y-0 -right-65 z-0 flex w-275 items-center'>
      <motion.div style={{ x: driftX, y: driftY }}>
        <svg
          data-contours
          viewBox='-200 -60 1100 640'
          fill='none'
          stroke='currentColor'
          strokeWidth={1.2}
          className='h-160 w-275 flex-none origin-[60%_45%] animate-contour-sway text-border motion-reduce:animate-none'>
          {CONTOUR_PATHS.map((d, i) => (
            <g
              key={d}
              className='origin-center animate-contour-breathe [animation-fill-mode:backwards] transform-fill motion-reduce:animate-none'
              style={{ animationDelay: `${DRAW_S - i * BREATHE_STAGGER_S}s` }}>
              <path
                d={d}
                pathLength={1}
                strokeDasharray={1}
                className='animate-contour-draw motion-reduce:animate-none'
                style={{ animationDelay: `${i * CONTOUR_DRAW_STAGGER}s` }}
              />
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
};

export default Contours;

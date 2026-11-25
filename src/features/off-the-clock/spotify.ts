// JSON contract returned by the Go /api/listening route.
export type Listening = {
  title: string;
  artist: string;
  url: string;
  /** True while the track is playing right now; false for the last played one. */
  playing: boolean;
};

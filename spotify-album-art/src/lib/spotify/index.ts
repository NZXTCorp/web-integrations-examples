import { CurrentlyPlaying, Device } from "spotify-types";

export type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>;

export type CamelCaseObjectKeys<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};
export interface CurrentPlayback extends CurrentlyPlaying {
  shuffleState: boolean;
  repeatState: "track" | "off" | "context";
  device: CamelCaseObjectKeys<Device>;
}

interface JSONResponse<T> extends Response {
  data?: T;
  errors?: Array<{ message: string }>;
}

export const getCurrentlyPlaying = async (
  accessToken: string
): Promise<JSONResponse<CurrentPlayback | null>> => {
  return fetch(
    "https://api.spotify.com/v1/me/player?additional_types=track,episode",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export function createCurrentlyPlaying(
  data: CurrentPlayback
): CurrentlyPlaying {
  return {
    timestamp: data.timestamp,
    progress_ms: data.progress_ms,
    is_playing: data.is_playing,
    currently_playing_type: data.currently_playing_type,
    item: data.item ?? null,
    context: data?.context
      ? {
          external_urls: data.context.external_urls,
          href: data.context.href,
          type: data.context.type,
          uri: data.context.uri,
        }
      : null,
  };
}

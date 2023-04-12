import { createCurrentlyPlaying, getCurrentlyPlaying } from "../../lib/spotify";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { isPodcast, isTrack } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  // @ts-ignore
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const response = await getCurrentlyPlaying(accessToken);

  if (response.status === 204) {
    return res
      .status(200)
      .json({ message: "Playback not available or active" });
  }

  if (response.status === 200) {
    const data = await response.json();
    const nowPlaying = createCurrentlyPlaying(data);
    if (
      nowPlaying.item &&
      (isPodcast(nowPlaying.item) || isTrack(nowPlaying.item))
    ) {
      return res.status(200).json(nowPlaying);
    } else {
      return res
        .status(200)
        .json({ message: "Playback not available or active" });
    }
  }

  return res.status(500).json({ error: "Unable to retrieve album art" });
};

export default handler;

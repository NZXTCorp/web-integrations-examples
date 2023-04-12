import { Session } from "next-auth";
import { useRef, useState, useEffect } from "react";
import { CurrentlyPlaying, Episode, Track as TrackType } from "spotify-types";
import Track from "@/components/Track";
import Podcast from "@/components/Podcast";
import { averageColor, isPodcast, isTrack } from "@/lib/utils";
import { css } from "@emotion/css";

const stylesFn = (backgroundColor: string) => {
  return {
    background: css`
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: inherit;
      background-color: ${backgroundColor};
      background-size: cover;
      background-position: center center;
      filter: blur(20px);
      transform: scale(1.2);
      // transition: background ease 2s; disabled for now
    `,

    message: css`
      color: white;
      font-size: 2rem;
      text-align: center;
      padding: 0 10vw;
    `,
  };
};

const getNowPlaying: () => Promise<CurrentlyPlaying> = async () => {
  try {
    const res = await fetch("/api/playing");
    const json = await res.json();
    return { ...json, status: res.status };
  } catch (e) {
    throw new Error("Unable to retrieve album art");
  }
};

const KrakenNowPlaying: React.FC<{
  nowPlayingInitial: CurrentlyPlaying | null;
  session: Session | null;
  viewstate: number;
}> = ({ nowPlayingInitial, session, viewstate }) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [showMessage, setShowMessage] = useState<string>("");
  const [nowPlaying, setNowPlaying] = useState<TrackType | Episode | null>(
    null
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("black");
  const styles = stylesFn(backgroundColor);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!imageRef.current) {
        return;
      }
      averageColor(imageRef.current, 1)
        .then((color) => {
          setBackgroundColor(color);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  useEffect(() => {
    if (!nowPlayingInitial?.item) {
      setShowMessage("Please play a track to start the visualization.");
    }
    setNowPlaying(nowPlayingInitial?.item || null);
  }, [nowPlayingInitial]);

  useEffect(() => {
    const updateNowPlaying = async () => {
      try {
        if (session) {
          const nowPlaying = await getNowPlaying();
          if (nowPlaying.item) {
            setNowPlaying(nowPlaying.item);
            setShowMessage("");
          } else {
            setNowPlaying(null);
            setShowMessage("Please play a track to start the visualization.");
            return;
          }
        } else {
          setNowPlaying(null);
          setShowMessage('Please click "Configure" in NZXT CAM to continue');
        }
      } catch (e) {
        setShowMessage("Unable to retrieve album art.");
      }
    };

    if (!intervalId) {
      const interval = setInterval(() => {
        updateNowPlaying();
      }, 5000);

      setIntervalId(interval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [session, intervalId]);

  return (
    <>
      {nowPlaying && isTrack(nowPlaying) && (
        <Track
          nowPlaying={nowPlaying}
          imageRef={imageRef}
          viewstate={viewstate}
        />
      )}
      {nowPlaying && isPodcast(nowPlaying) && (
        <Podcast
          nowPlaying={nowPlaying}
          imageRef={imageRef}
          viewstate={viewstate}
        />
      )}
      {nowPlaying && <div className={styles.background} />}
      {showMessage && !nowPlaying && (
        <p className={styles.message}>{showMessage}</p>
      )}
    </>
  );
};

export default KrakenNowPlaying;

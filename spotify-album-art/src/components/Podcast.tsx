/* eslint-disable @next/next/no-img-element */
import { css } from "@emotion/css";
import { Episode } from "spotify-types";

const stylesFn = (viewstate: number) => {
  return {
    container: css`
      position: absolute;
      display: flex;
      width: 80%;
      z-index: 2;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      text-align: center;
      text-overflow: ellipsis;
      transform: translate(0, 3%);
      color: white;
      font-size: ${viewstate / 320}rem;
    `,

    spotifyLogo: css`
      width: 4em;
      margin-bottom: 0.5em;
    `,

    nowPlayingImage: css`
      width: 70%;
      boxshadow: 0 1.25em 2.5em rgb(0 0 0 / 30%), 0 1em 0.75em rgb(0 0 0 / 22%);
    `,

    songTitle: css`
      width: 90%;
      font-size: 1em;
      margin-top: 0.375em;
      margin-bottom: 0.375em;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
    `,

    artists: css`
      width: 75%;
      font-size: 0.875em;
      overflow: hidden;
      text-overflow: ellipsis;
    `,

    album: css`
      width: 50%;
      font-size: 0.75em;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
  };
};

const Podcast = ({
  nowPlaying,
  imageRef,
  viewstate,
}: {
  nowPlaying: Episode;
  imageRef: React.RefObject<HTMLImageElement>;
  viewstate: number;
}) => {
  const styles = stylesFn(viewstate);
  return (
    <div className={styles.container}>
      <img
        className={styles.spotifyLogo}
        src="/Spotify_Logo_RGB_White.png"
        alt="Spotify Logo"
      />
      <img
        className={styles.nowPlayingImage}
        alt=""
        src={nowPlaying.images[0].url}
        ref={imageRef}
      />
      <p className={styles.songTitle}>
        <a
          href={nowPlaying.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
        >
          {nowPlaying.show.name}
        </a>
      </p>
      <p className={styles.album}>
        <a
          href={nowPlaying.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
        >
          {nowPlaying.name}
        </a>
      </p>
    </div>
  );
};

export default Podcast;

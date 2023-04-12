/* eslint-disable @next/next/no-img-element */
import { css } from "@emotion/css";
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

const styles = {
  button: css`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1ed760;
    width: 400px;
    height: 48px;
    color: white;
    font-size: 1rem;
    padding-left: 0.5rem;
    padding-right: 1rem;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    pointer-events: all;
    user-select: none;
    gap: 10px;
    transition: background-color 0.2s ease-in-out;

    &:active {
      background-color: #1db954;
    }
  `,
  spotifyLogo: css`
    height: 26px;
    width: 26px;
  `,
};

export default function SpotifyAuth({ signin }: { signin: boolean }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const authMethod = () => {
    signin ? signIn("spotify") : signOut();
  };

  if (loading) return <></>;

  return (
    <button className={styles.button} onClick={authMethod}>
      <Image
        width={200}
        height={200}
        alt="Spotify logo"
        priority
        quality={100}
        className={styles.spotifyLogo}
        src="/spotify-small.png"
      />
      {signin ? "Continue with Spotify" : "Sign out"}
    </button>
  );
}

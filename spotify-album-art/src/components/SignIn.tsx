import { css, cx } from "@emotion/css";
import { CSSProperties, useEffect, useState } from "react";
import kraken1 from "../../public/kraken1.png";
import kraken2 from "../../public/kraken2.png";
import Image from "next/image";
import { Session } from "next-auth";
import SpotifyAuth from "@/components/SpotifyAuth";

const styles = {
  container: css`
    display: flex;
    position: relative;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
    user-select: none;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,

  subContainer: css`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    margin: 0;

    @media (max-width: 768px) {
      flex-direction: column;
      margin: 0;
    }
  `,

  imageContainer: css`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    @media (max-width: 768px) {
      justify-content: center;
      height: 50%;
      width: 100%;
      margin-top: 100px;
    }
  `,

  image: css`
    height: auto;
    width: 300px;
    opacity: 1;
  `,

  content: css`
    display: flex;
    justify-content: center;
    padding: 40px;
    height: 100%;
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    text-align: left;
    gap: 10px;

    @media (max-width: 768px) {
      justify-content: flex-start;
      align-items: center;
    }
  `,

  description: css`
    line-height: 1.5;
    font-weight: 400;
    min-width: 400px;
    max-width: 400px;
    font-size: 0.9rem;
    opacity: 0.8;
  `,

  header: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 700;
    align-self: center;
    font-size: 2.5rem;
  `,

  logos: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
  `,

  blockedState: css`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    width: 100vw;
    padding: 2vw;
    font-size: 6vw;
  `,

  spotifyLogo: css`
    display: flex;
    height: auto;
    width: 140px;
    align-self: center;
  `,

  authButton: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  `,
};

type SignInProps = {
  session: Session | null;
};

const SignIn = ({ session }: SignInProps) => {
  const [images, _setImages] = useState([kraken1, kraken2]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const setCurrentImage = () => {
    const newIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  useEffect(() => {
    const intervalId = setInterval(setCurrentImage, 5000);
    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  if (loading) return <></>;

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.imageContainer}>
          <Image
            quality={100}
            width={300}
            height={300}
            priority
            className={cx(styles.image)}
            src={images[currentImageIndex].src}
            alt="Kraken"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.logos}>
            <Image
              priority
              width={140}
              height={42}
              className={styles.spotifyLogo}
              src="/spotify-logo.png"
              alt="Spotify Logo"
            />
          </div>
          <h1 className={styles.header}>{"Now Playing"}</h1>
          <p className={styles.description}>
            {
              "This integration displays currently playing tracks from Spotify along with artists and album art on your NZXT Kraken Screen."
            }
          </p>

          <div className={styles.authButton}>
            <SpotifyAuth signin={!session} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

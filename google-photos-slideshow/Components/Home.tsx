import { css, cx } from '@emotion/css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { StateKey } from '../lib/constants'
import Image from 'next/image'
import kraken1 from '../public/kraken1.png'
import kraken2 from '../public/kraken2.png'
import { PRIVACY_DISCLAIMER } from '../lib/privacy'
import Link from 'next/link'
import { MarkdownRenderer } from './MarkdownRenderer'
import Button from './Button'
import useReload from '../lib/useReload'

const styles = {
  container: css`
    display: flex;
    position: relative;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    height: calc(100% - 50px);

    padding-top: 50px;
    > :first-child {
      margin: auto;
    }

    @media (max-width: 768px) {
      padding-top: 0;
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
    align-items: center;
    @media (max-width: 768px) {
      justify-content: center;
      height: 50%;
      margin-top: 50px;
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
    margin-left: 40px;
    align-items: flex-start;
    flex-direction: column;
    text-align: left;
    font-weight: 600;
    gap: 1.5rem;

    @media (max-width: 768px) {
      justify-content: flex-start;
      align-items: center;
      margin: 40px 0;
    }
  `,

  description: css`
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1.5;
    max-width: 450px;
    opacity: 0.8;

    @media (max-width: 768px) {
      text-align: center;
    }
  `,

  headers: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 10px;
    line-height: 1.2;
  `,

  header: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.8rem;

    @media (max-width: 768px) {
      text-align: center;
    }
  `,

  subHeader: css`
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    font-weight: 300;
    text-align: right;
    opacity: 0.8;

    @media (max-width: 768px) {
      text-align: center;
    }
  `,

  blockedState: css`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    width: 100vw;
    font-weight: 500;
  `,

  blockedText: css`
    padding: 0 10vw;
    font-size: 2rem;
  `,

  getStarted: css`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    width: 250px;
    font-weight: 500;

    @media (min-width: 768px) {
      .button {
        min-width: 35rem;
      }
    }

    @media (max-width: 768px) {
      align-items: center;
    }
  `,

  privacyDisclaimer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 570px;
    line-height: 1.5;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 50px;
    font-style: italic;
    opacity: 0.8;

    p {
      width: 100%;
    }

    a {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      position: relative;
      max-width: 100%;
      width: 450px;
      margin: 0;
      padding-bottom: 50px;
      text-align: center;
    }
  `,

  privacyPolicy: css`
    padding-left: 5px;
    @media (max-width: 768px) {
      padding-left: 0px;
    }
  `,
}

const Home: React.FC<{
  kraken?: string
}> = ({ kraken }) => {
  const [loading, setLoading] = useState(true)
  const [images, _setImages] = useState([kraken1, kraken2])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    window.localStorage.setItem(StateKey.albumId, '')
    setLoading(false)
  }, [])

  useReload(kraken)

  const setCurrentImage = () => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    setCurrentImageIndex(newIndex)
  }

  useEffect(() => {
    const intervalId = setInterval(setCurrentImage, 5000)
    return () => clearInterval(intervalId)
  }, [currentImageIndex])

  if (loading) return <></>

  if (!kraken) {
    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <div className={styles.imageContainer}>
            <Image
              priority
              quality={100}
              width={300}
              height={300}
              className={cx(styles.image)}
              src={images[currentImageIndex].src}
              alt="Kraken"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.headers}>
              <h1 className={styles.header}>NZXT Kraken Photo Slideshow</h1>
              <h3 className={styles.subHeader}>using Google Photos</h3>
            </div>
            <p className={styles.description}>
              This integration displays a photo slideshow on your NZXT Kraken using photos from your Google Photos
              account. Personalize your PC with your favorite memories from your Google Photos albums!
            </p>
            <Button onClick={() => router.push('signin')} className={styles.getStarted}>
              Get Started
            </Button>
          </div>
        </div>
        <div className={styles.privacyDisclaimer}>
          <MarkdownRenderer content={PRIVACY_DISCLAIMER} />
          <Link href={'/privacy'} className={styles.privacyPolicy}>
            Privacy Policy
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.blockedState}>
        <p className={styles.blockedText}>Please click "Configure" in NZXT CAM to continue</p>
      </div>
    )
  }
}

export default Home

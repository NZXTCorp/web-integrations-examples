import { css } from '@emotion/css'
import { ClientSafeProvider, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Button from '../Button'

const stylesFn = (scale: number) => {
  return {
    button: css`
      position: relative;
      display: flex;
      flex-direction: row;
      width: calc(225px * ${scale});
      height: calc(40px * ${scale});
      border-radius: calc(5px * ${scale});
      background-color: #ffffff;
      user-select: none;
      padding: 0;
      transition: none;

      &:hover {
        background-color: #ffffff;
      }

      &:active {
        background-color: #eeeeee;
      }
    `,

    image: css`
      position: relative;
      margin-left: calc(8px * ${scale});
      width: calc(28px * ${scale});
      height: calc(28px * ${scale});
      user-select: none;
    `,

    text: css`
      width: 100%;
      position: relative;
      font-family: 'Product Sans Bold', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: calc(13px * ${scale});
      line-height: calc(16px * ${scale});
      color: #3c4043;
    `,
  }
}

const PhotosSignIn = ({ provider, scale }: { provider: ClientSafeProvider; scale: number }) => {
  const styles = stylesFn(scale)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) return <></>

  return (
    <Button className={styles.button} onClick={() => signIn(provider.id)}>
      <Image
        priority
        quality={100}
        className={styles.image}
        width={210}
        height={144}
        src={'/google_photos.png'}
        alt="Sign in with Google"
      />
      <span className={styles.text}>{'Connect to Google Photos'}</span>
    </Button>
  )
}

export default PhotosSignIn

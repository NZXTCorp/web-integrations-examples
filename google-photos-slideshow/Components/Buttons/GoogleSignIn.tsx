import { css } from '@emotion/css'
import { ClientSafeProvider, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Button from '../Button'

const stylesFn = (scale: number) => {
  return {
    button: css`
      width: calc(185px * ${scale});
      height: calc(40px * ${scale});
      left: calc(50% - (185px * ${scale}) / 2);
      top: calc(50% - (40px * ${scale}) / 2);
      border-radius: calc(2px * ${scale});
      background-color: #4285f4;
      user-select: none;

      &:hover {
        background-color: #4285f4;
      }

      &:active {
        transition: none;
        background-color: #3367d6;
      }
    `,

    image: css`
      position: absolute;
      width: calc(18px * ${scale});
      height: calc(18px * ${scale});
      left: calc(11px * ${scale});
      top: calc(50% - 18px * ${scale} / 2);
      user-select: none;
    `,

    imagebg: css`
      position: absolute;
      width: calc(38px * ${scale});
      height: calc(38px * ${scale});
      left: calc(1px * ${scale});
      border-radius: 1px;
      top: calc(50% - 38px * ${scale} / 2);
      background: #ffffff;
      border-radius: calc(1px * ${scale});
      user-select: none;
    `,

    text: css`
      position: absolute;
      width: calc(126px * ${scale});
      height: calc(16px * ${scale});
      right: calc(9px * ${scale});
      top: calc(50% - 16px * ${scale} / 2);
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      font-size: calc(14px * ${scale});
      line-height: calc(16px * ${scale});
      display: flex;
      align-items: flex-end;
      letter-spacing: calc(0.21875px * ${scale});
      color: #ffffff;
    `,
  }
}

const GoogleSignIn = ({ provider, scale }: { provider: ClientSafeProvider; scale: number }) => {
  const styles = stylesFn(scale)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) return <></>

  return (
    <Button className={styles.button} onClick={() => signIn(provider.id)}>
      <span className={styles.imagebg} />
      <Image
        priority
        quality={100}
        className={styles.image}
        width={210}
        height={144}
        src={'google.svg'}
        alt="Sign in with Google"
      />
      <span className={styles.text}>{'Sign in with Google'}</span>
    </Button>
  )
}

export default GoogleSignIn

import { NextPageContext } from 'next'
import { BuiltInProviderType } from 'next-auth/providers'
import { css } from '@emotion/css'
import { getSession, getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import kraken1 from '../public/kraken1.png'
import kraken2 from '../public/kraken2.png'
import { stringifyQuery } from '../lib/utils'
import PhotosSignIn from '../Components/Buttons/PhotosSignIn'
import NZXTLogo from '../Components/NZXTLogo'

const styles = {
  container: css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 140px);
    width: 100vw;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,

  subContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 480px;
    min-height: 225px;
    border-radius: 4px;
    padding: 0 20px;
  `,

  signIn: css`
    position: relative;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  `,

  logo: css`
    color: white;
    height: 100px;
  `,

  description: css`
    margin-bottom: 20px;
    color: white;
    text-align: center;
    font-weight: 300;
    font-size: 1.1rem;
    line-height: 1.5;
  `,

  info: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
}

type Provider = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>

type SignInProps = {
  providers: Provider
  kraken?: string
}

const SignIn = ({ kraken, providers }: SignInProps) => {
  const [images, _setImages] = useState([kraken1, kraken2])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const setCurrentImage = () => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    setCurrentImageIndex(newIndex)
  }

  useEffect(() => {
    const intervalId = setInterval(setCurrentImage, 5000)
    return () => clearInterval(intervalId)
  }, [currentImageIndex])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.subContainer}>
          {providers && providers.google && (
            <>
              <div className={styles.info}>
                <NZXTLogo className={styles.logo} />
                <h1 className={styles.description}>
                  {
                    'To display a photo slideshow on your NZXT Kraken, NZXT Kraken Photo Slideshow needs your permission to connect to your Google Photos account.'
                  }
                </h1>
              </div>
              <div className={styles.signIn}>
                <PhotosSignIn scale={1.4} provider={providers.google} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

SignIn.getInitialProps = async (context: NextPageContext) => {
  const { req, res, query } = context
  const session = await getSession({ req })

  if (session && res && session) {
    res.writeHead(302, { Location: '/' + stringifyQuery(query) })
    res.end()
    return
  }

  const { kraken } = context.query

  return {
    providers: await getProviders(),
    kraken,
  }
}

export default SignIn

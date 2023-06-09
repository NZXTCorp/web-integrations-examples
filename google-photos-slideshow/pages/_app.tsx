import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import Layout from '../Components/Layout'

type Props = AppProps & { session: Session | null | undefined }

export default function App({ Component, pageProps, session }: Props) {
  return (
    <SessionProvider session={session} refetchInterval={15 * 60}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

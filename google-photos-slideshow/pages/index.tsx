import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { getAlbums } from '../lib/photos'
import { AlbumType } from '../types/album'
import { isString } from '../lib/utils'
import { Session } from 'next-auth'
import Albums from '../Components/Albums'
import Home from '../Components/Home'

export default function HomePage({
  albums: initialAlbums,
  kraken,
  nextPageToken,
  session,
}: {
  albums?: AlbumType[]
  kraken?: string
  nextPageToken?: string
  session: Session | undefined
}) {
  if (!session || session?.error === 'RefreshAccessTokenError') {
    return <Home kraken={kraken}></Home>
  }

  return <Albums initialAlbums={initialAlbums} nextPageToken={nextPageToken} kraken={kraken} session={session} />
}

export async function getServerSideProps({ req, res, query }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions)

  let albums = []
  let nextPageToken
  if (session?.accessToken && isString(session?.accessToken)) {
    const data = await getAlbums(session?.accessToken, '', 50)
    if (!data.albums.length) {
      return { props: { albums: [] } }
    }
    albums = data.albums
    nextPageToken = data.nextPageToken
  }

  const { kraken } = query

  return {
    props: {
      albums,
      session,
      kraken: kraken ?? null,
      nextPageToken: nextPageToken ?? null,
    },
  }
}

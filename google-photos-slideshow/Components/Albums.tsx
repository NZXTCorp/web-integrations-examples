import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import { css, cx } from '@emotion/css'
import { useEffect, useState } from 'react'
import { AlbumType } from '../types/album'
import { Session } from 'next-auth'
import Photos from './Photos'
import useSelectedAlbum from '../lib/useSelectedAlbum'
import useReload from '../lib/useReload'

const styles = {
  container: css`
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    user-select: none;
    padding-top: 20px;
  `,
  albumList: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-gap: 4rem;
    justify-content: space-evenly;
    width: 100%;
    padding: 32px 20px;
  `,
  albumFrame: css`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    outline: 1px solid grey;
    transition: outline 0.3s ease;
    background-color: #111;
    max-width: 300px;
    max-height: 300px;

    &:hover {
      outline: 1px solid white;
      cursor: pointer;
    }

    &:active {
      outline: 1px solid #8a00fc;
      transition: none;
    }
  `,
  albumTitle: css`
    overflow: hidden;
    white-space: no-wrap;
    text-overflow: ellipsis;
    padding-bottom: 2px;
  `,
  albumItemsCount: css`
    overflow: hidden;
    white-space: no-wrap;
    text-overflow: ellipsis;
  `,
  albumSelected: css`
    outline: 1px solid #8a00fc;

    &:hover {
      outline: 1px solid #8a00fc;
      cursor: pointer;
    }

    transition: outline 0.1s ease-in-out;
  `,
  albumImg: css`
    width: 250px;
    height: 200px;
    object-fit: cover;
    border-radius: 1rem;
    padding: 12px;
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
  chooseHeader: css`
    display: flex;
    width: 100%;
    justify-content: flex-start;
    text-align: center;
    font-weight: 300;
    font-size: 26px;
    padding-left: 32px;
  `,
  emptyState: css`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: calc(100vh - 150px);
    width: 100%;
  `,
  emptyStateContent: css`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    gap: 1vh;
    font-size: 20px;
    user-select: none;
  `,
}

const Albums: React.FC<{
  initialAlbums?: AlbumType[]
  kraken?: string
  nextPageToken?: string
  session: Session | undefined
}> = ({ initialAlbums, nextPageToken, kraken }) => {
  const [loading, setLoading] = useState(true)
  const [pageToken, setPageToken] = useState(nextPageToken ?? '')
  const [albums, setAlbums] = useState(initialAlbums ?? [])
  const { currentAlbumId, setCurrentAlbumId } = useSelectedAlbum()

  useEffect(() => {
    setLoading(false)
  }, [])

  useReload(kraken)

  const fetchMoreData = async () => {
    if (pageToken) {
      fetch(`/api/content/albums?pageToken=${pageToken}&pageSize=50`)
        .then(res => res.json())
        .then(data => {
          setPageToken(data.nextPageToken)
          setAlbums(albums => albums.concat(data.albums))
        })
    }
  }

  if (loading) return <></>

  if (kraken) {
    if (currentAlbumId) {
      return <Photos albumId={currentAlbumId} kraken={kraken} t={5} />
    } else {
      return (
        <div className={styles.blockedState}>
          <p className={styles.blockedText}>{'Choose a Google Photos Album'}</p>
        </div>
      )
    }
  }

  return (
    <InfiniteScroll
      hasMore={!!pageToken && albums.length > 0}
      loader={<></>}
      dataLength={albums.length}
      next={fetchMoreData}
      className={styles.container}
    >
      {albums.length > 0 ? (
        <>
          <div className={styles.chooseHeader}>
            <p>{'Choose an album to display on your Kraken'}</p>
          </div>
          <div className={styles.albumList}>
            {albums.map(album => (
              <div
                onClick={() => setCurrentAlbumId(album.id)}
                key={album.id}
                className={cx(styles.albumFrame, album.id === currentAlbumId && styles.albumSelected)}
              >
                <div>
                  <Image
                    priority
                    className={styles.albumImg}
                    width={300}
                    height={300}
                    src={album.coverPhotoBaseUrl}
                    alt={album.title}
                  />
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '0px 12px 12px 12px',
                  }}
                >
                  <p className={styles.albumTitle}>{album.title}</p>
                  <p className={styles.albumItemsCount}>{album.mediaItemsCount} Photos</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <p>{'No photo albums created on this account. Create a photo album to stream it.'}</p>
          </div>
        </div>
      )}
    </InfiniteScroll>
  )
}

export default Albums

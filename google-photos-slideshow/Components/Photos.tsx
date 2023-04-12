/* eslint-disable @next/next/no-img-element */
import { MediaItem } from '../types/mediaItem'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const getPhotos = async (
  albumId: string,
  pageToken: string,
  pageSize = 50
): Promise<{
  mediaItems: MediaItem[]
  nextPageToken?: string
}> => {
  const res = await fetch(`/api/content/photos?pageToken=${pageToken}&pageSize=${pageSize}&albumId=${albumId}`)
  return await res.json()
}

const preload = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = reject
    img.onload = resolve
    img.src = url
  })
}

export default function Photos({
  albumId,
  nextPageToken,
  t,
}: {
  albumId: string
  kraken?: string
  nextPageToken?: string
  t: number
}) {
  const { data: session } = useSession()
  const [pageToken, setPageToken] = useState(nextPageToken)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [requesting, setRequesting] = useState(false)

  const initializeItems = async () => {
    const { mediaItems, nextPageToken } = await getPhotos(albumId, '')
    setPageToken(nextPageToken ?? '')
    setMediaItems(mediaItems)
    await preload(mediaItems[0].baseUrl)
    setCurrentPhotoIndex(0)
  }

  useEffect(() => {
    initializeItems()
  }, [albumId])

  useEffect(() => {
    const id = setInterval(async () => {
      if (currentPhotoIndex + 1 >= mediaItems.length) {
        if (pageToken) {
          if (!requesting) {
            setRequesting(true)
            const { mediaItems: newMediaItems, nextPageToken } = await getPhotos(albumId, pageToken)
            setPageToken(nextPageToken ?? '')
            setMediaItems(items => [...items, ...newMediaItems])
            await preload(newMediaItems[0].baseUrl)
            setCurrentPhotoIndex(currentPhotoIndex + 1)
            setRequesting(false)
          }
        } else {
          await preload(mediaItems[0].baseUrl)
          setCurrentPhotoIndex(0)
        }
      } else {
        await preload(mediaItems[currentPhotoIndex + 1].baseUrl)
        setCurrentPhotoIndex(currentPhotoIndex + 1)
      }
    }, 5000)
    return () => clearInterval(id)
  }, [mediaItems, pageToken, albumId, t, currentPhotoIndex, requesting])

  if (!mediaItems?.length || !session || session?.error === 'RefreshAccessTokenError') return <></>

  const photo = mediaItems[currentPhotoIndex]

  if (!photo) return <></>

  return (
    <>
      <div
        style={{
          position: 'absolute',
          zIndex: '-1',
          backgroundImage: `url(${photo.baseUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          filter: 'blur(40px)',
          width: '100vw',
          height: '100vh',
          // transition: 'background ease 2s', // FPS currently too low
        }}
      />
      <img
        style={{ height: '100vh', width: '100vw' }}
        width={640}
        height={640}
        src={photo.baseUrl}
        alt={photo.description || ''}
      />
    </>
  )
}

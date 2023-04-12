import { MediaItem } from '../types/mediaItem'
import { googlePhotosUrl } from './constants'

export const getAlbums = async (accessToken: string, pageToken = '', pageSize = 50) => {
  try {
    const url = new URL('/v1/albums', googlePhotosUrl)
    url.search = new URLSearchParams({
      pageSize: pageSize.toString(),
      ...(pageToken && { pageToken }),
    }).toString()

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      return { albums: [], nextPageToken: '' }
    }

    const data = await response.json()
    return { albums: data?.albums ?? [], nextPageToken: data?.nextPageToken ?? '' }
  } catch (err) {
    console.log(err)
    return { albums: [], nextPageToken: '' }
  }
}

export const getMediaItems = async (
  accessToken = '',
  albumId = '',
  pageToken = '',
  pageSize = '50'
): Promise<{
  mediaItems: MediaItem[]
  nextPageToken: string | null
}> => {
  try {
    const url = new URL('/v1/mediaItems:search', googlePhotosUrl)
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        albumId,
        pageSize: parseInt(pageSize),
        ...(pageToken && { pageToken }),
      }),
    })

    if (!response.ok) {
      return {
        mediaItems: [],
        nextPageToken: null,
      }
    }

    const { mediaItems = [], nextPageToken: returnedNextPageToken = null } = await response.json()
    return { mediaItems, nextPageToken: returnedNextPageToken }
  } catch {
    return { mediaItems: [], nextPageToken: null }
  }
}

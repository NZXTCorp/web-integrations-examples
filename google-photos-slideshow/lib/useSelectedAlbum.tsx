import { useEffect, useState } from 'react'
import { StateKey } from './constants'

/**
 * Gets and sets the selected album id in localStorage
 * Initial value is set from localStorage
 * @returns {currentAlbumId, setCurrentAlbumId}
 */
const useSelectedAlbum = () => {
  const [currentAlbumId, setAlbumId] = useState<string | null>(null)

  const setCurrentAlbumId = (albumId: string) => {
    if (albumId === currentAlbumId) {
      window.localStorage.removeItem(StateKey.albumId)
      setAlbumId(null)
    } else {
      window.localStorage.setItem(StateKey.albumId, albumId)
      setAlbumId(albumId)
    }
  }

  useEffect(() => {
    // Set the initial album from localStorage
    setAlbumId(window.localStorage.getItem(StateKey.albumId))

    // Will fire on the Kraken Side
    const handleStorage = (e: StorageEvent) => {
      if (e.key === StateKey.albumId) {
        setAlbumId(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorage)
  }, [])

  return { currentAlbumId, setCurrentAlbumId }
}

export default useSelectedAlbum

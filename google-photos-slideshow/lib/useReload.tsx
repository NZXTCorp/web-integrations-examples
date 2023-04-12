import router from 'next/router'
import { useEffect } from 'react'
import { MyBroadcastChannel } from './broadcast'
import { BROADCAST_CHANNEL } from './constants'

/**
 * Reload kraken document onload
 * @param kraken
 */
const useReload = (kraken?: string, deps = []) => {
  useEffect(() => {
    const reloadChannel = new MyBroadcastChannel(BROADCAST_CHANNEL.RELOAD)
    if (!kraken) {
      reloadChannel.postMessage({})
    } else {
      reloadChannel.addEventListener(() => {
        router.reload()
      })
    }

    return () => reloadChannel.close()
  }, [...deps])
}

export default useReload

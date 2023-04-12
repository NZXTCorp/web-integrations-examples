import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getMediaItems } from '../../../lib/photos'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { accessToken } = session

  const { pageToken, pageSize, albumId } = req.query

  if (!accessToken || !albumId) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  if (albumId && typeof albumId !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' })
  }

  if (pageToken && typeof pageToken !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' })
  }

  if (pageSize && typeof pageSize !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' })
  }

  return res.status(200).json(await getMediaItems(accessToken, albumId, pageToken, pageSize))
}

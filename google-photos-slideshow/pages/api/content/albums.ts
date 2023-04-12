import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getAlbums } from '../../../lib/photos'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { pageToken, pageSize } = req.query
  // @ts-ignore
  const { accessToken } = await getSession({ req })

  if (!accessToken || !pageToken || !pageSize) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  if (typeof pageToken !== 'string' || typeof pageSize !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' })
  }

  return res.status(200).json(await getAlbums(accessToken, pageToken as string, parseInt(pageSize)))
}

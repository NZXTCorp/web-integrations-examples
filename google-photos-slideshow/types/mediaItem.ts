export type MediaItem = {
  id: string
  description: string
  productUrl: string
  baseUrl: string
  mimeType: string
  mediaMetadata: MediaMetadata
  contributorInfo: ContributorInfo
  filename: string
}

type ContributorInfo = {
  profilePictureBaseUrl: string
  displayName: string
}

type MediaMetadata = {
  creationTime: string
  width: string
  height: string
  photo: Photo
  video: Video
}

type Photo = {
  cameraMake: string
  cameraModel: string
  focalLength: string
  apertureFNumber: string
  isoEquivalent: string
  exposureTime: string
}

type Video = {
  cameraMake: string
  cameraModel: string
  fps: string
  status: string
}

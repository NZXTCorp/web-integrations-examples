# Google Photos Slideshow

Enables users to display their photo albums on their Kraken LCD devices.

## Authentication

[Authjs](https://authjs.dev/guides/basics/refresh-token-rotation) handles authentication with Google as the provider. The `authOptions` object contains configuration options for the app, including pages to use for sign-in and callback functions to handle the user's session and JSON Web Token (JWT). The GoogleProvider object specifies the necessary client ID and secret, along with the authorization URL and least necessary scope.

Different providers require different means of configuration and renewal.

### callbacks

`jwt()` callback function that checks if the token has expired and if so, calls the refreshAccessToken() function to get a new token.
`session()` callback function updates the user session with the access token, refresh token, and expiration time.

### session

Calls to `getSession()`, `getServerSession()`, and `useSession()` will invoke the `jwt()` callback function ensuring the latest access token will be up to date.

### renewal

`refreshAccessToken()` uses the Google API token endpoint to refresh the access token when it expires. This function is called in the `jwt()` callback function if the expiration threshold has been reached. The session will also be refetched every 15 minutes, or on window focus.

## Broadcast Channel

[Broadcast channels](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) use a publish/subscribe model where a message is broadcast to all subscribed channels that have the same channel name. This allows for real-time communication between different parts of an application or between different users on the same website. We can utilize broadcast channels to tell the browser that is loaded on Kraken when we want it to refresh. In this case, we want to refresh the browser when the user signs in or out.

`localStorage` or `cookie` listeners can accomplish this too.

### useReload

```ts
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
```

In this project, we implement this in a useReload custom hook. The hook takes in the `kraken` parameter. If the `kraken` parameter is not present, the hook will broadcast a message to all subscribed channels. If the `kraken` parameter is present, the hook will listen for a message on the channel and reload the browser. This is a useful pattern for implementing a reload mechanism that can be used in both the browser and on Kraken when the user signs in or out.

### useSelectedAlbum

```ts
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

const { currentAlbumId, setCurrentAlbumId } = useSelectedAlbum()
```

We also use the `useSelectedAlbum` custom hook to communicate the selected album. The hook uses `localStorage` to store the selected album ID when the user selects an item. When the user selects the same album, the hook will remove the album ID from `localStorage`. This allows the selected album data to be accessible from the Kraken Browser without reload. Note that the hook will only fire on the Kraken side. When setting an item in localStorage, the browser that set the item will not receive a storage event, but the other browsers will.

```ts
const { currentAlbumId, setCurrentAlbumId } = useSelectedAlbum()

if (kraken) {
  return <Photos albumId={currentAlbumId}>
} else {
  return (
    <div onClick={setCurrentAlbumId} />
  )
}
```

## Tools

Google Photos Slideshow is built using open-source libraries and APIs.

- Next.js
- Next-Auth
- Google Library API

## Installation

To run Google Photos Slideshow, you will need to have [Node.js](https://nodejs.org/en) and [Yarn](https://yarnpkg.com/) installed on your computer.

## Setup

Clone this repository to your local machine.
Navigate to the project directory and run `yarn` to install dependencies.
To set up a Google application and get the client ID, you can follow these steps:

Go to the Google Developers Console at https://console.developers.google.com/.

1. Create a new project by clicking on the "Select a project" dropdown menu at the top of the page and then clicking on the "New Project" button.
2. Give your project a name and click on the "Create" button.
3. Once your project is created, click on the "Credentials" tab on the left-hand side of the page.
4. Click on the "Create credentials" button and select "OAuth client ID".
5. Once your OAuth Client is created, you will be able to view your client ID and client secret on the "Credentials" page.

Add these environment variables to a .env.local file in the root directory:

```
JWT_SECRET=<your-generated-jwt-secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

Run the development server using `yarn dev`.
Open a supported web browser and navigate to http://localhost:3000.

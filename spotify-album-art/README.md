# Spotify Album Art

Enables users to display their currently playing album art on their Kraken LCD devices.

## Authentication

[Authjs](https://authjs.dev/guides/basics/refresh-token-rotation) handles authentication with Spotify as the provider. The `authOptions` object contains configuration options for the app, including pages to use for sign-in and callback functions to handle the user's session and JSON Web Token (JWT). The SpotifyProvider object specifies the necessary client ID and secret, along with the authorization URL and least necessary scope.

Different providers require different means of configuration and renewal.

### callbacks

`jwt()` callback function that checks if the token has expired and if so, calls the refreshAccessToken() function to get a new token.
`session()` callback function updates the user session with the access token, refresh token, and expiration time.

### session

Calls to `getSession()`, `getServerSession()`, `useSession()` will invoke the `jwt()` callback function ensuring the latest access token will be up to date.

### renewal

`refreshAccessToken()` uses the Spotify API token endpoint to refresh the access token when it expires. This function is called in the `jwt()` callback function if the expiration threshold has been reached. The session will also be refetched every 15 minutes, or on window focus.

## Reloader using Broadcast Channel

[Broadcast channels](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) use a publish/subscribe model where a message is broadcast to all subscribed channels that have the same channel name. This allows for real-time communication between different parts of an application or between different users on the same website. We can utilize broadcast channels to tell the browser that is loaded on Kraken when we want it to refresh. In this case, we want to refresh the browser when the user signs in or out.

`localStorage` or `cookie` listeners can accomplish this too.

### Usage

```ts
useEffect(() => {
  const reloader = new MyBroadcastChannel(BROADCAST_CHANNEL.RELOAD);
  if (kraken) {
    reloader.addEventListener(() => {
      if (kraken) {
        router.reload();
      }
    });
  } else {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
    reloader.postMessage({});
  }
  return () => {
    reloader.close();
  };
}, [session]);

return (
  <>
    <Head />
    {!kraken && <SignIn session={session} />}
    {kraken && (
      <div className={styles.container}>
        <KrakenNowPlaying
          session={session}
          nowPlayingInitial={nowPlayingInitial}
          viewstate={viewstate}
        />
      </div>
    )}
  </>
);
```

In the above snippet, if our Kraken query parameter is present, that means we are rendering on the Kraken Browser. The Broadcast Channel `RELOAD` is created on both browsers, but it is only subscribed to when we have the query parameter `kraken`. The addEventListener method on Kraken Browser will reload the page when ever a message is received on this channel. On non-kraken page load, we will always ask the Kraken Browser to reload.

We are also rendering our views conditionally, based on whether we are on the Kraken Browser or not. If we are on the Kraken Browser, we will render the `KrakenNowPlaying` component. If we are not on the Kraken Browser, we will render the `SignIn` component so the user can sign in or out.

## API

The bulk of requests are via [Spotify's Playback API](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-information-about-the-users-current-playback)

## Tools

Spotify Album Art is built using open-source libraries and APIs.

- Next.js
- Next-Auth
- Spotify Developer Platform

## Installation

To run Spotify Album Art, you will need to have [Node.js](https://nodejs.org/en) and [Yarn](https://yarnpkg.com/) installed on your computer.

## Setup

Clone this repository to your local machine.
Navigate to the project directory and run `yarn` to install dependencies.

Set up a Spotify Developer account and create a new Spotify application. Note down the client ID and client secret.
Create a .env.local file in the root directory of the project and add the following environment variables:

```
JWT_SECRET=<your-generated-jwt-secret>
NEXTAUTH_URL=http://localhost:3000
SPOTIFY_CLIENT_ID=<your-client-id>
SPOTIFY_CLIENT_SECRET=<your-client-secret>
```

Run the development server using `yarn dev`.
Open a supported web browser and navigate to http://localhost:3000.

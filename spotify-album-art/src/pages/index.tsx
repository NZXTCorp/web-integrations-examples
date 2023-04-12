import Head from "../components/Head";
import { NextPageContext } from "next";
import { useEffect } from "react";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { getCookie } from "cookies-next";
import SignIn from "@/components/SignIn";
import { createCurrentlyPlaying, getCurrentlyPlaying } from "@/lib/spotify";
import { MyBroadcastChannel } from "@/lib/broadcast";
import { BROADCAST_CHANNEL } from "@/lib/constants";
import { useRouter } from "next/router";
import { CurrentlyPlaying } from "spotify-types";
import KrakenNowPlaying from "@/components/KrakenNowPlaying";
import { css } from "@emotion/css";

const styles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;

    a:hover {
      text-decoration: underline;
    }
  `,
};

export default function Home({
  kraken,
  session,
  nowPlayingInitial,
  viewstate,
}: {
  session: Session | null;
  kraken: boolean;
  nowPlayingInitial: CurrentlyPlaying | null;
  viewstate: number;
}) {
  const router = useRouter();

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
        if (typeof window !== "undefined") {
          signOut();
        }
      }
      reloader.postMessage({});
    }
    return () => {
      reloader.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
}

export async function getServerSideProps(context: NextPageContext) {
  let viewstate = 640;
  const viewstateCookie = getCookie("viewstate", context);

  if (viewstateCookie) {
    const parsed = parseInt(viewstateCookie.toString());
    if (!isNaN(parsed)) {
      viewstate = parsed;
    }
  }

  let nowPlaying: CurrentlyPlaying | null = null;
  const session = await getSession({ req: context.req });

  if (session?.accessToken && context.query?.kraken) {
    try {
      const res = await getCurrentlyPlaying(session.accessToken);
      const data = await res.json();
      if (res.status === 200) {
        if (data.item) {
          nowPlaying = createCurrentlyPlaying(data);
        } else {
          nowPlaying = { ...data, status: res.status };
        }
      }
    } catch (e) {
      console.error("Unable to retrieve album art");
    }
  }

  return {
    props: {
      nowPlayingInitial: nowPlaying,
      session: await getSession({ req: context.req }),
      viewstate,
      kraken: !!context.query?.kraken,
    },
  };
}

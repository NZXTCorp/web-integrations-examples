import { Account, AuthOptions, User, Session, TokenSet } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";

export const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

async function refreshAccessToken(tokenParam: JWT): Promise<JWT> {
  try {
    if (!tokenParam.refreshToken) {
      throw new Error("Expected token.refreshToken to be defined");
    }

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: tokenParam.refreshToken,
      }),
    });

    const tokens: TokenSet & { expires_in: number } = await response.json();

    if (!response.ok) {
      throw tokens;
    }

    return {
      ...tokenParam,
      accessToken: tokens.access_token,
      refreshToken: tokenParam.refreshToken,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      ...tokenParam,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          error: null,
        };
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      user: User | AdapterUser;
      token: JWT;
    }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token?.error ?? null;
      return session;
    },
  },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          show_dialog: true,
          scope: [
            "user-read-currently-playing",
            "user-read-playback-state",
          ].join(" "),
        },
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  secret: process.env.JWT_SECRET!,
};

export default NextAuth(authOptions);

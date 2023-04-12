import NextAuth from 'next-auth'
import { AuthOptions, Account, User, TokenSet } from 'next-auth/core/types'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      throw new Error('Expected token.refreshToken to be defined')
    }

    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })

    const tokens: TokenSet & { expires_in: number } = await response.json()

    if (!response.ok) {
      throw tokens
    }

    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000,
      refreshToken: tokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      error: null,
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: AuthOptions & { pages: { signIn: string } } = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/photoslibrary.readonly',
          ].join(' '),
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT
      user?: User | AdapterUser
      account?: Account | null
    }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        if (!account.expires_at) {
          // Expires at is not returned by Google, it is calculated by NextAuth
          throw new Error('Expected account.expires_at')
        }

        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          error: null,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.accessTokenExpires = token.accessTokenExpires
      session.error = token?.error ?? null
      return session
    },
  },
  secret: process.env.JWT_SECRET!,
  pages: {
    signIn: '/signin',
  },
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error: 'RefreshAccessTokenError' | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User | AdapterUser
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    error: 'RefreshAccessTokenError' | null
  }
}

export default NextAuth(authOptions)

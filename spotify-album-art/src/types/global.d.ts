import * as NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error: "RefreshAccessTokenError" | null;
  }

  interface Account {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User | AdapterUser;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    error: "RefreshAccessTokenError" | null;
  }
}

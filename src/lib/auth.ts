import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '951128900258-1hqt359h97d9ov88elfa9rcec72vp8r8.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || '986e26fc-eb5d-484e-810a-a5f5e1cda89d',
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    }
  },
  pages: {
    signIn: "/",
    error: "/api/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  }
}
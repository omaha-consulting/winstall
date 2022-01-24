import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const options = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: true,

  callbacks: {
    session: async ({ session, token }) => {
      if (session && token) {
        session.user = token;
      }

      return Promise.resolve(session);
    },

    jwt: async ({ token, account, profile }) => {
      if (profile) {
        token.id = profile.id_str;
      }

      if (account) {
        token.accessToken = account.accessToken;
        token.refreshToken = account.refreshToken;
      }

      return Promise.resolve(token);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);

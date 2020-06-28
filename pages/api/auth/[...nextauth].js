import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  site: process.env.SITE,
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
  ],
  secret: process.env.SECRET,

  session: {
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: true,

  callbacks: {
    session: async (session, token) => {
      if (!session || !session.user || !token || !token.account) {
        return Promise.resolve(session);
      }

      session.user.id = token.account.id;
      session.accessToken = token.account.accessToken;
      
      return Promise.resolve(session);
    }
  },

};

export default (req, res) => NextAuth(req, res, options);

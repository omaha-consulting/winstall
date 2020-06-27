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
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    signin: async (profile, account, metadata) => {
      Promise.resolve(true);
    },
  },

};

export default (req, res) => NextAuth(req, res, options);

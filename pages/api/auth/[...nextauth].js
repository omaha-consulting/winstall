import NextAuth from "next-auth";
import Providers from "next-auth/providers";


const options = {
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
    session: async (session, user) => {
      if(session && user){
        console.log(user)
        session.user = user;
      }

      return Promise.resolve(session);
    },

    jwt: async (token, user, account, profile, isNewUser) => {
      if(profile){
        token.id = profile.id_str;
      }

      return Promise.resolve(token);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);

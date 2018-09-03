
export default {

  facebookAuth: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    profileFields: ['id', 'email', 'name'] // For requesting permissions from Facebook API
  },

  // twitterAuth: {
  //   consumerKey: process.env.TWITTER_APP_ID,
  //   consumerSecret: process.env.TWITTER_APP_SECRET,
  //   callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
  // },

  googleAuth: {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }

};

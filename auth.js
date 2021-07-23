const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '934437502472-23rm6d91lqnrgrts08cfg0gispn4ih76.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'LXcz2gHz2dTWRxExrnFz-oJC';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:7000/protected"
  },
  function(accessToken, refreshToken, profile, cb) {
      return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
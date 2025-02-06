const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const Buyer = require("./models/Buyer");
const Seller = require("./models/Seller");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await Buyer.findOne({ email: profile.emails[0].value }) || await Seller.findOne({ email: profile.emails[0].value });
        if (!user) {
          req.session.tempUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "google"
          };
          return done(null, req.session.tempUser);
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await Buyer.findOne({ email: profile.emails[0].value }) || await Seller.findOne({ email: profile.emails[0].value });
        if (!user) {
          req.session.tempUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "facebook"
          };
          return done(null, req.session.tempUser);
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;

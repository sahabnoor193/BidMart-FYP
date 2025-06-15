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
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await Buyer.findOne({ email }) || await Seller.findOne({ email });

        if (!user) {
          req.session.tempUser = { 
            name: profile.displayName, 
            email, 
            provider: "google" 
          };
          req.session.save();  // ✅ Ensure session persists  
          return done(null, req.session.tempUser);
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error);
        return done(error, null);
      }
    }
  )
);


// Serialize and Deserialize user session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("../models");
const User = db.User;

// jwt for signup
// if using cookies extract jwt token from the cookie sent with every request.
// const cookieExtracter = req => {
//   let token = null;
//   // check for cookies
//   if (req && req.cookies) {
//     token = req.cookies["access_token"];
//   }
//   return token;
// };

passport.use(
  "jwt",
  new JwtStrategy(
    {
      // get jwt token by specifying where it is coming from. The header can be called anythnig. in this case i chose 'authorization'
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      // if token is in a cookie=> jwtFromRequest: cookieExtracter
      // the secret or key to decode the token
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        // find the user specified in the token
        const user = await User.findOne({ where: { id: payload.user.id } });

        // user not found
        if (!user) {
          return done(null, false);
        }

        // return user
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// local strategy for sign in
passport.use(
  "local",
  new LocalStrategy(
    {
      // we are usin email to authorize the user
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        // find user by email
        const user = await User.findOne({ where: { email: email } });

        // no user or email is not verified
        if (!user || !user.isVerified) {
          return done(null, false);
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        // wrong password
        if (!isMatch) {
          return done(null, false);
        }

        // change account to active in case it wasn't
        user.isActive = true;
        await user.save();
      } catch (err) {}
    }
  )
);

// To help keep authentication state across HTTP requests, Passport needs to serialize and desrialize the user.
// This is just boilerplate needed to make things work
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// export the configured passport
module.exports = passport;

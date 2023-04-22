const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const secret = process.env.SECRET;

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, async function (
  email,
  password,
  done
) {
  // Verify this email and password, call `done` with the user
  // if it is the correct email and password
  // otherwise, call `done` with false
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false);

    // Compare passwords
    user.comparePassword(password, function (err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  } catch (error) {
    done(error, false);
  }
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call `done` with that user
  // Otherwise call `done` without a user object
  try {
    const user = await User.findById(payload.sub);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

// Tell passport to use these strategies
passport.use(jwtLogin);
passport.use(localLogin);

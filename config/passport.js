const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");
const { validatePassword } = require("../utility/passwordHelpers");

const verifyUser = async (username, password, done) => {
    try {
        const user = await User.findOne({username: username});
        if (!user) {
            return done(null, false);
        }

        const isValid = validatePassword(password, user.hash, user.salt);

        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    } catch (err) {
        done(err);
    }
}

const strategy = new LocalStrategy(verifyUser);

passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
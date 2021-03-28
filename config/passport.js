const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      db.query(
        `SELECT * FROM users WHERE username = ? LIMIT 1`,
        username,
        (error, user) => {
          if (error) {
            throw error;
          }
          user = user[0];
          if (!user) {
            console.log("🔴 Incorrect username...");
            return done(null, false, {
              message: "Username doesn't exist",
            });
          }
          bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
              console.log("🔴 Incorrect password...");
              return done(null, false, {
                message: "Wrong password",
              });
            }

            console.log("🟢 User " + user.username + " logged in!");
            return done(null, user);
          });
        }
      );
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user); //todo: is this correctly done?!?
  });
};

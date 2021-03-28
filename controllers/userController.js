const db = require("./../config/db");
const bcrypt = require('bcrypt');
const passport = require('passport');
const path = require('path');
const uploadPath = 'public/uploads/';

require('./../config/passport')(passport);


exports.renderLoginPage = (req, res) => {
  res.render('login');
}

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/u/login',
    failureFlash: true,
  })(req, res, next);
}

exports.renderRegisterPage = (req, res) => {
  res.render('register');
}

exports.registerUser = (req, res) => {
  username_input = req.body.username || null;
  email_input = req.body.email || null;
  password_input = req.body.password || null;
  const errors = [];
  db.query(
    `SELECT username, email 
    FROM users
    WHERE username = ? OR email = ?`,
    [username_input, email_input],
    (error, users) => {
      if (error) {
        throw error;
      }
      if(users.length > 0){
        if(users.find( ({username}) => username === username_input )){
          errors.push({
            msg: 'username is already registred...'
          });
        }
        if(users.find( ({email}) => email === email_input )){
          errors.push({
            msg: 'email is already registred...'
          });
        }
      }
      if(errors.length > 0) {
        res.render('register', {
          errors,
          username_input,
          email_input
        })
        return
      }
      bcrypt.hash(password_input, 10, function(err, hash) {
        db.query(`INSERT INTO users (username, email, password) VALUES (?,?,?)`,[username_input, email_input, hash], (error, response) => {
          if (error) {
            throw error;
          }
          req.flash('success_msg', 'You have now registered');
          res.redirect('/u/login');
        });
      });

    }
  );
}

exports.userSettings = (req, res) => {
  res.render('userSettings', {
    user: req.user,
    profile_pic: req.user.profile_pic
  });
}

exports.uploadPicture = (req, res) => {
  if (!req.file) {
    return res.redirect('/u/settings');
  }

  try {
    const profile_pic = uploadPath + req.file.filename;
    const id = req.user._id;
    const User = require('../models/user');

    User
      .findByIdAndUpdate(id, {
        profile_pic: profile_pic
      })
      .exec((error, user) => {
        if (error) {
          return console.log(error);
        }
        res.render('userSettings', {
          user: user,
          profile_pic: profile_pic
        });
      });
  }
  catch (error) {
    res.end(error);
  }
}
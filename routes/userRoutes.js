const express = require('express');
const app = express();
const flash = require('connect-flash');
const router = express.Router();
const { ensureAuthenticated } = require('./../config/auth.js');
const userController = require('./../controllers/userController');

// Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Login
router
  .route('/login')
  .get(userController.renderLoginPage)
  .post(userController.loginUser);

// Register
router
  .route('/register')
  .get(userController.renderRegisterPage)
  .post(userController.registerUser);

// Logout
router.route('/logout').get(function (req, res) {
  req.logout();
  req.flash('success_msg', 'You have been logged out');
  res.redirect('/');
});

// Settings
router
  .route('/settings')
  .get(ensureAuthenticated, userController.userSettings);


module.exports = router;
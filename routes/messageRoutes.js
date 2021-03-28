const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./../config/auth.js');
const messageController = require('./../controllers/messageController');

router
  .route('/room')
  .post(messageController.postMessage);

router
	.route('/:name')
	.get(messageController.renderMessage);

router
  .route('/upload')
  .post(messageController.postFile);  
  
module.exports = router;
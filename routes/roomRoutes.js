const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router
	.route('/')
	.get(roomController.rendercreateRoom)
	.post(roomController.createRoom);

router
	.route('/:name')
	.get(roomController.renderRoom);

router
	.route('/posts/:id')
	.delete(roomController.deletePost)
	.patch(roomController.updatePost);

module.exports = router;
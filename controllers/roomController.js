const db = require("./../config/db");
const ChannelPost = require('../models/channelPost');
const Channel = require('../models/channel');
const User = require('../models/user');

exports.rendercreateRoom = (req, res) => {
	res.render('roomCreate', { currentUser: req.user });
}

exports.renderRoom = (req, res) => {
	let room_name = req.params.name;
  db.query(`SELECT * FROM rooms WHERE name = ?`, room_name, (error, room) => {
    if (error) {
      throw error;
    }
    room = room[0];
    db.query(
      `SELECT message_id, user_id, username, message, datetime_created, datetime_updated 
      FROM messages 
      LEFT JOIN users ON messages.from_user_id = user_id
      WHERE to_room_id = ? ORDER BY datetime_created`,
      room.room_id,
      (error, messages) => {
        if (error) {
          throw error;
        }
        room["messages"] = messages;
        res.render('channel', {
					user: req.user,
					room_id: room.room_id,
					room_name: room_name,
					posts: messages,
					to_user_id: null,
          to_username: null
				});
      }
    );
  });
}

exports.createRoom = (req, res) => {
	room_name = req.body.roomName || null;
  room_description = req.body.description || null;
  created_by_user_id = req.user.user_id
  if(!room_name){
		req.flash('error_msg', 'Roomname cant be empty');
		return res.redirect('/r');
  }
	db.query(
    `SELECT * FROM rooms WHERE name = ?`,
    room_name,
    (error, rooms) => {
      if (error) {
        throw error;
      }
			if(rooms.length > 0) {
				req.flash('error_msg', 'Room already exists');
				return res.redirect('/r');
			}
			db.query(
				`INSERT INTO rooms (name, description, created_by_user_id)
				VALUES (?,?,?)`,
				[room_name, room_description, created_by_user_id],
				(error, user) => {
					if (error) {
						throw error;
					}
					req.flash('success_msg', 'Room '+room_name+' created!');
					return res.redirect(`/home`)
				}
			);
    }
  );
}

exports.deletePost = (req, res) => {
	let message_id = req.params.id;
  db.query(
    `SELECT from_user_id FROM messages WHERE message_id = ?`,
    message_id,
    (error, message) => {
      if (error) {
        throw error;
      }
      message = message[0]
      if(req.user.user_id != message.from_user_id) {
				return console.log("That's not your message")
      }
      db.query(`DELETE FROM messages WHERE message_id = ?`,message_id, (error, deleted) => {
        if (error) {
          throw error;
        }
        res.end();
      });
    }
  );
	return
}

exports.updatePost = (req, res) => {
	let message_id = req.params.id;
  let message_input = req.body.msg || null;
  if (!message_input) {
		return console.log("'message' can't be empty")
  }
  db.query(
    `SELECT from_user_id FROM messages WHERE message_id = ?`,
    message_id,
    (error, message) => {
      if (error) {
        throw error;
      }
      message = message[0]
      if(req.user.user_id != message.from_user_id) {
				return console.log("That's not your message")
      }
      db.query(`UPDATE messages SET message = ? WHERE message_id = ?`,[message_input,message_id], (error, message_edit) => {
        if (error) {
          throw error;
        }
        res.end()
      });
    }
  );
	return 
}
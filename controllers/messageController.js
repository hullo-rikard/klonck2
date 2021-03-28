const db = require("./../config/db");
const bcrypt = require('bcrypt');
const passport = require('passport');
const path = require('path');
const user = require("../models/user");





require('./../config/passport')(passport);


exports.postFile = (req, res) => {

  const user_id = req.user.user_id || null

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('first error')
    return res.redirect('/u/settings');
  }

  let upload = req.files.image;

  let uploadPath = __dirname + '/../public/uploads/' + upload.name;
  upload.mv(uploadPath, function(error) {
    if (error) {
      return res.redirect('/u/settings');
    }
    db.query(`
      INSERT INTO uploads 
      (uploaded_by_user_id, filename)
      VALUES (?,?)`,
      [req.user.user_id, upload.name],
      (error, messages) => {
        if (error) {
          throw error;
        }
        db.query(`
          UPDATE users set avatar = ? WHERE user_id = ? `,
          [upload.name, req.user.user_id],
          (error, uploadfile) => {
            if (error) {
              throw error;
            }
            req.user.avtar = upload.name
            return res.redirect('/u/settings');
          }
        );
      }
    );
  });
}

exports.postMessage = (req, res) => {
  const message = req.body.message || null
  const from_user_id = req.user.user_id || null
  const to_room_id = req.body.to_room_id || null
  const to_user_id = req.body.to_user_id || null
  const room_name = req.body.room_name || null
  const to_username = req.body.to_username || null

  if (to_user_id && to_room_id) {
    req.flash('error_msg', 'Needs a recipient');
    return res.redirect('/r/'+room_name)
  }
  if (!message) {
    req.flash('error_msg', 'Messages cant be empty');
    return res.redirect('/r/'+room_name)
  }
  db.query(`
    INSERT INTO messages 
    (from_user_id, to_user_id, to_room_id, message)
    VALUES (?,?,?,?)`,
    [from_user_id, to_user_id, to_room_id, message],
    (error, messages) => {
      if (error) {
        throw error;
      }
      if(to_room_id){
        return res.redirect('/r/'+room_name)
      }
      return res.redirect('/m/'+to_username)
    }
  );
}

exports.renderMessage = (req, res) => {
  let username = req.params.name;
  db.query(`SELECT user_id FROM users WHERE username = ?`, username, (error, getUser) => {
    if (error) {
      throw error;
    }
    getUser = getUser[0];
    db.query(`
      SELECT message_id, from_user_id as 'user_id', to_user_id, to_room_id, message, datetime_created, datetime_updated, username
      FROM messages
      LEFT JOIN users ON messages.from_user_id = user_id
      WHERE (from_user_id = ? AND to_user_id = ?)
      OR (from_user_id = ? AND to_user_id = ?)`,
      [req.user.user_id, getUser.user_id, getUser.user_id, req.user.user_id],
      (error, messages) => {
        if (error) {
          throw error;
        }
        res.render('channel', {
					user: req.user,
					room_id: null,
					room_name: null,
					posts: messages,
          to_user_id: getUser.user_id,
          to_username: username
				});
      }
    );
  });

  return
}
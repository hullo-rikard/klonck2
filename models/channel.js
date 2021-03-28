const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  time_stamp: {
    type: Date,
    default: Date.now()
  },
  users: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  description: {
    type: String
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'ChannelPost'
  }],
  channel_name: {
    type: String,
    required: true
  },
  admin: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  isPrivate: {
    required: true,
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Channel', ChannelSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelPostSchema = new Schema({
  time_stamp: {
    type: Date,
    default: Date.now()
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  post: {
    type: String,
  },
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('ChannelPost', ChannelPostSchema);
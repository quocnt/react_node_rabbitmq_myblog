var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Comment = new Schema({
  content : {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    require: true
  },
  blogId: {
    type: Schema.ObjectId,
    ref: 'Blog',
    require: true
  }
});

module.exports = mongoose.model('Comment', Comment);


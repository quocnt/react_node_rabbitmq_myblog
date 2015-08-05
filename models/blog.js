var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var Blog = new Schema({
  title: {
    type: String,
    required: true
  },
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
  comments : [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }]
});

module.exports = mongoose.model('Blog', Blog);

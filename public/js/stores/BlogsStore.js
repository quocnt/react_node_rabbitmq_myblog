var AppDispatcher = require('../dispatcher/AppDispatcher');
var BlogsConstants = require('../constants/BlogsConstants');
var blogs = [],
    blog  = {};

function loadBlogs(data) {
  blogs = data;
}

function loadBlog(data) {
  blog = data;
}

var BlogStore  = _.assign({}, EventEmitter.prototype, {
  getBlogs : function() {
    return blogs;
  },

  getBlog : function() {
    return blog;
  },
  // Emit Change event
  emitChange: function(data) {
    this.emit('change', data);
  },

  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  // Remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.actiontype) {
    // Respond to RECEIVE_DATA action
    case BlogsConstants.RECEIVE_BLOGS: 
      loadBlogs(action.data);
      break;

    case BlogsConstants.RECEIVE_BLOG: 
      loadBlog(action.data);
      break;
  }

  BlogStore.emitChange(action.actiontype);
  return true;
});

module.exports = BlogStore;
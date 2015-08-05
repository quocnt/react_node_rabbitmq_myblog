var AppDispatcher  = require('../dispatcher/AppDispatcher');
var BlogsConstants = require('../constants/BlogsConstants');

var BlogActions = {
  receiveBlogs : function(data) {
    AppDispatcher.handleAction({
      actiontype: BlogsConstants.RECEIVE_BLOGS,
      data: data
    });
  },
  receiveBlog : function(data) {
    AppDispatcher.handleAction({
      actiontype: BlogsConstants.RECEIVE_BLOG,
      data: data
    });  
  },
  commented : function() {
    AppDispatcher.handleAction({
      actiontype: BlogsConstants.COMMENTED
    }); 
  },
  created : function() {
    AppDispatcher.handleAction({
      actiontype: BlogsConstants.CREATEDBLOG
    }); 
  }
};

module.exports = BlogActions;
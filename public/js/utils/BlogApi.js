var BlogActions = require('../actions/BlogActions');
var blogApi = 'api/blogs';
module.exports = {
  getBlogs : function() {
    $.get(blogApi)
      .done(function(data) {
        BlogActions.receiveBlogs(data);
      });
  },
  getBlog : function(blogId) {
    $.get(blogApi + '/' + blogId)
      .done(function(data) {
        BlogActions.receiveBlog(data);
      });
  },
  postBlog : function(title, content) {
    $.post(blogApi, {title: title, content: content})
      .done(function(data) {
        BlogActions.created();
      });
  },
  postComment : function(blogId, content) {
    $.post(blogApi + '/' +  blogId + '/comments', {content: content})
      .done(function(data) {
        BlogActions.commented();
      });
  }
};
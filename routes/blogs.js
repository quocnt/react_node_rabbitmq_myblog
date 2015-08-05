var express  = require('express');
var router   = express.Router();
var Blog     = require('../models/blog');
var Comment  = require('../models/comment');
var User     = require('../models/user');
var mongoose = require('mongoose');
var Promise  = require('bluebird');
var ObjectId = mongoose.Types.ObjectId;

module.exports = exports = function(app) {
  /////////// BLOG //////////////
  var populateBlog = function(req, res, next) {
    var blogId = req.body.blogId || req.params.blogId;
    Blog.findOne({_id: blogId}, function(err, data) {
      if (err || !data) { return next(err); }
      User.findOne({_id: data.author}, function(err, user) {
        req.blog = data;
        req.blog.author = user;
        next();
      });
    }); 
  };
  var getListBlogs = function(req, res, next) {
    Blog.find().sort('-createdAt')
    .populate('author')
    .exec(function(err, data) {
      if (err) { return next(err); }
      return res.status(200).send(data);
    });
  };

  var postBlog = function(req, res, next) {
    var blog = {
      title: req.body.title,
      content: req.body.content,
      author : req.user._id
    };

    Blog.create(blog, function(err, data) {
      if (err) { return next(err); }
      return res.status(200).send(data);
    });
  };

  var getBlog = function(req, res, next) {
    Blog.findOne({_id: req.params.blogId})
      .populate('comments')
      .populate('author')
      .exec(function(err, data) {
        if (err) { return next(err); }
        var promise = data.comments.map(function(comment) {
          return User.findOne({_id: comment.author}).exec()
            .then(function(user) {
              comment.author = user;
            });
        });
        return Promise.all(promise)
          .then(function() {
            return res.status(200).send(data);
          })
      }); 
  };

  ///////// COMMENT //////////
  var postComment = function(req, res, next) {
    var comment = {
      content : req.body.content,
      author  : req.user._id,
      blogId  : req.params.blogId
    };

    Comment.create(comment, function(err, data) {
      if (err) { return next(err); }
      
      req.blog.comments.push(data);
      req.blog.save(function(err) {
        if (err) { return next(err); }
          var object = {
            to: req.blog.author.username,
            from: req.user.username,
            title: req.blog.title,
            comment: data.content
          };

          if (req.user._id.toString() !== req.blog.author._id.toString()) {
            app.rabbit.publish('notify:email', object);
          }
          return res.sendStatus(200);
      });
    });
  };

  router.get('/', getListBlogs);
  router.post('/', postBlog);
  router.get('/:blogId', populateBlog, getBlog);
  router.post('/:blogId/comments',populateBlog, postComment);

  return router;
};


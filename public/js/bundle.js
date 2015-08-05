(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../constants/BlogsConstants":10,"../dispatcher/AppDispatcher":11}],2:[function(require,module,exports){
var BlogApi    = require('./utils/BlogApi');
var BlogApp    = require('./components/BlogApp.react');
var ViewBlog   = require('./components/ViewBlog.react');
var CreateBlog = require('./components/CreateBlog.react');
var NavBar     = require('./components/NavBar.react');

var Route        = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;

var routes = (
  React.createElement(Route, null, 
  	React.createElement(DefaultRoute, {handler: BlogApp}), 
    React.createElement(Route, {name: "blogs", handler: BlogApp}), 
    React.createElement(Route, {name: "blog", path: "/blogs/:blogId", handler: ViewBlog}), 
    React.createElement(Route, {name: "create", handler: CreateBlog, path: "/create"})
  )
);

ReactRouter.run(routes, function (Handler) {
  React.render(
  	React.createElement("div", {className: "blog-app"}, 
      React.createElement("div", {className: "nav-bar"}, 
        React.createElement(NavBar, null)
      ), 
      React.createElement("div", {className: "container"}, 
	      React.createElement("div", {className: "col-md-10"}, 
	        React.createElement(Handler, null)
	      )
      )
    ), document.getElementById('my-blog')
  );
});

},{"./components/BlogApp.react":3,"./components/CreateBlog.react":5,"./components/NavBar.react":8,"./components/ViewBlog.react":9,"./utils/BlogApi":13}],3:[function(require,module,exports){
// Load store data
var BlogsStore = require('../stores/BlogsStore');
var ListBlogs  = require('./ListBlogs.react');
var NavBar     = require('./NavBar.react');
var BlogApi    = require('../utils/BlogApi');
var Link       = ReactRouter.Link;

function getData() {
  return {
    blogs: BlogsStore.getBlogs()
  }
}

var BlogApp = React.createClass({displayName: "BlogApp",
  // get initial state from store
  getInitialState : function() {
    return getData();
  },

  componentDidMount: function() {
    // Load blog data
    BlogApi.getBlogs();
    BlogsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BlogsStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var blogs = this.state.blogs;
    if (blogs.length) {
      return (
        React.createElement(ListBlogs, {blogs: blogs})
      );
    } else if (!_.isEmpty(USER)){
      return (
        React.createElement(Link, {to: "create"}, "Create one ?")
      )
    } else {
      return (React.createElement("div", null))
    }
  },

  _onChange: function() {
    this.setState(getData());
  }
});

module.exports = BlogApp;

},{"../stores/BlogsStore":12,"../utils/BlogApi":13,"./ListBlogs.react":7,"./NavBar.react":8}],4:[function(require,module,exports){
var BlogApi        = require('../utils/BlogApi');
var BlogsStore     = require('../stores/BlogsStore');
var BlogsConstants = require('../constants/BlogsConstants');
var FormDate       = require('./Date.react');
var BlogId, displayInput, newComment;

var enterTrigger = function() {
	$('#comment').keypress(function(e) {
		if (e.which === 13) {
			$('#submit-comment').trigger('click');
			return false;
		}
	});
};

var Input = React.createClass({displayName: "Input",
	componentDidMount: function() {
		enterTrigger();
	},
	render : function() {
		return (
			React.createElement("div", {className: "input row"}, 
				React.createElement("div", {className: "col-md-11"}, 
					React.createElement("input", {type: "text", className: "form-control", id: "comment", placeholder: "Enter your comment"})
				), 
				React.createElement("button", {id: "submit-comment", className: "btn btn-default col-md-1", onClick: this.comment}, "Comment")
			)
		)
	},
	comment : function() {
		newComment = $('#comment').val();
		if (!newComment) return;
		BlogApi.postComment(BlogId, newComment);
	},
});

if (!_.isEmpty(USER)) {
	displayInput = React.createElement(Input, null);
} else {
	displayInput = React.createElement('div');
}


var Comments = React.createClass({displayName: "Comments",
	componentDidMount: function() {
		BlogId = this.props.blogId;
    BlogsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BlogsStore.removeChangeListener(this._onChange);
  },
	render: function() {
		var comments = this.props.comments;
		return (
			React.createElement("div", {className: "comments"}, 
				displayInput, 
				React.createElement("div", {className: "wrap-comment"}, 
				
					comments.map(function(comment) {
						return (
							React.createElement("div", {className: "comment"}, 
								React.createElement("span", {className: "comment-author"}, comment.author.username), " commented on",  
								React.createElement("span", {className: "comment-date"}, React.createElement(FormDate, {time: comment.createdAt})), 
								React.createElement("div", {className: "comment-content"}, React.createElement("i", {className: "fa fa-angle-right"}), comment.content)
							)
						)
					})
				
				)
			)
		)
	},
	_onChange: function(data) {
		if (data === BlogsConstants.COMMENTED) {
			$('#comment').val(''); // Clear input
			var obj = {
				content: newComment,
				author: USER.username ? {username: USER.username} : '',
				createdAt: new Date().toISOString()
			};
			this.props.comments.push(obj);
			this.setState(this.props.comments); // Render with new comment
		}
	}
});

module.exports = Comments;

},{"../constants/BlogsConstants":10,"../stores/BlogsStore":12,"../utils/BlogApi":13,"./Date.react":6}],5:[function(require,module,exports){
var BlogsStore    = require('../stores/BlogsStore');
var BlogConstants = require('../constants/BlogsConstants');
var BlogApi       = require('../utils/BlogApi');

var CreateBlog = React.createClass({displayName: "CreateBlog",
	componentDidMount: function() {
		if (_.isEmpty(USER)) {
			window.location.href = '/';
		}
		BlogsStore.addChangeListener(this._onChange);
	},

	componentWillUnmount : function() {
		BlogsStore.removeChangeListener(this._onChange);
	},
	render: function() {
		return (
			React.createElement("div", {className: "bl-form-create"}, 
	      React.createElement("form", {className: "form-horizontal"}, 
	        React.createElement("div", {className: "form-group"}, 
	          React.createElement("label", {for: "inputEmail3", className: "col-sm-2 control-label"}, "Title"), 
	          React.createElement("div", {className: "col-sm-10"}, 
	            React.createElement("input", {type: "text", className: "form-control", placeholder: "Blog's title", id: "title"})
	          )
	        ), 
	        React.createElement("div", {className: "form-group"}, 
	          React.createElement("label", {for: "inputPassword3", className: "col-sm-2 control-label"}, "Content"), 
	          React.createElement("div", {className: "col-sm-10"}, 
	            React.createElement("textarea", {className: "form-control", id: "content"})
	          )
	        ), 
	        React.createElement("div", {className: "form-group"}, 
	          React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
	            React.createElement("button", {onClick: this.post, className: "btn btn-default"}, "Post")
	          )
	        )
	      )
	    )
		)
	},
	post: function($event) {
		$event.preventDefault();
		var title = $('#title').val();
		var content = $('#content').val();
		if (!title || !content) return;
		BlogApi.postBlog(title, content);
	},
	_onChange: function(data) {
		if (BlogConstants.CREATEDBLOG) {
			window.location.href = '/'
		}
	}
});

module.exports = CreateBlog;

},{"../constants/BlogsConstants":10,"../stores/BlogsStore":12,"../utils/BlogApi":13}],6:[function(require,module,exports){
var formatTime = function(time) {
	return moment(time).format('MMMM Do YYYY');
};

var DATE = React.createClass({displayName: "DATE",
	render: function() {
		var time = formatTime(this.props.time);
		return (
			React.createElement("span", null, " ", time, " ")
		);
	}
});

module.exports = DATE;

},{}],7:[function(require,module,exports){
var DateFormat = require('./Date.react');
var Link       = ReactRouter.Link;
var ListBlogs  = React.createClass({displayName: "ListBlogs",
	render: function() {
		var self = this;
		var blogs = this.props.blogs || [];
		return (
			React.createElement("div", {className: "blog-list"}, 
			
				blogs.map(function(blog) {
					return (
						React.createElement("div", {className: "blog"}, 
							React.createElement(Link, {to: "blog", params: {blogId: blog._id}, className: "title"}, React.createElement("i", {className: "fa fa-bookmark-o"}), " ", blog.title), 
							React.createElement("div", {className: "under-title"}, 
								React.createElement("span", {className: "author"}, React.createElement("i", {className: "fa fa-user"}), " ", blog.author.username), 
								React.createElement("span", {className: "time"}, 
									React.createElement("i", {className: "fa fa-calendar"}), " ", React.createElement(DateFormat, {time: blog.createdAt})
								)
							), 
							React.createElement("p", {className: "blog-content"}, " ", blog.content, " "), 
							React.createElement("div", {className: "blog-comments"}, 
								React.createElement("span", null, blog.comments.length), " comments"
							 )						
						)
					)
				})	
			
			) 
		);
	}
});

module.exports = ListBlogs;

},{"./Date.react":6}],8:[function(require,module,exports){
var loginButton, createButton;
var Link  = ReactRouter.Link;
var Login = React.createClass({displayName: "Login",
	render: function() {
		return (
			React.createElement("li", null, React.createElement("a", {href: "/login"}, "Login"))
		)
	}
});

var Create = React.createClass({displayName: "Create",
	render: function() {
		return (
			React.createElement("li", null, React.createElement("a", {href: "/#create"}, "Create Blog"))
		)
	}
});

var Logout = React.createClass({displayName: "Logout",
	render: function() {
		return (
			React.createElement("li", null, React.createElement("a", {href: "/logout"}, "Logout"))
		)
	}
});

if (_.isEmpty(USER)) {
	loginButton = React.createElement(Login, null);
	createButton = React.createElement('li');
} else {
	loginButton = React.createElement(Logout, null);
	createButton = React.createElement(Create, null);
}


var NavBar = React.createClass({displayName: "NavBar",
	render: function() {
		return (
			React.createElement("header", {className: "navbar navbar-static-top bs-docs-nav", id: "top", role: "banner"}, 
				React.createElement("nav", {className: "navbar-default"}, 
		      React.createElement("div", {className: "container"}, 
		        React.createElement("div", {className: "navbar-header"}, 
		          React.createElement("a", {className: "navbar-brand", href: "#"}, "Home Page")
		        ), 
		        React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
		        	createButton, 
			        loginButton
			      )
		      )
	    	)
	    )
		)
	}
});

module.exports = NavBar;

},{}],9:[function(require,module,exports){
var BlogApi    = require('../utils/BlogApi');
var BlogsStore = require('../stores/BlogsStore');
var Comments   = require('./Comments.react');
var NavBar     = require('./NavBar.react');
var DateFormat = require('./Date.react');

function getData() {
	return {
		blog : BlogsStore.getBlog()
	};
}

function getBlog(id) {
	BlogApi.getBlog(id);
}

var ViewBlog = React.createClass({displayName: "ViewBlog",
	getInitialState: function() {
		return getData();
	},

	componentDidMount: function() {
		getBlog(this.props.params.blogId);
		BlogsStore.addChangeListener(this._onChange);
	},

	componentWillUnmount : function() {
		BlogsStore.removeChangeListener(this._onChange);
	},

	render: function() {
		var blog = this.state.blog;
		if (!_.isEmpty(blog)) {
			return (
	      React.createElement("div", {className: "blog-detail blog"}, 
					React.createElement("div", {className: "title"}, React.createElement("i", {className: "fa fa-bookmark-o"}), " ", blog.title), 
					React.createElement("div", {className: "under-title"}, 
						React.createElement("span", {className: "author"}, React.createElement("i", {className: "fa fa-user"}), " ", blog.author.username), 
						React.createElement("span", {className: "time"}, 
							React.createElement("i", {className: "fa fa-calendar"}), " ", React.createElement(DateFormat, {time: blog.createdAt})
						)
					), 
					React.createElement("p", {className: "blog-content"}, blog.content), 
					React.createElement(Comments, {comments: blog.comments, blogId: blog._id})
				)
			)
		} else {
			return (React.createElement("div", null))
		}
		
	},

	_onChange : function() {
		this.setState(getData());
	}
});

module.exports = ViewBlog;

},{"../stores/BlogsStore":12,"../utils/BlogApi":13,"./Comments.react":4,"./Date.react":6,"./NavBar.react":8}],10:[function(require,module,exports){
// Define action constants
module.exports = KeyMirror({
  // CART_ADD: null,       // Adds item to cart
  // CART_REMOVE: null,    // Remove item from cart
  // CART_VISIBLE: null,   // Shows or hides the cart
  // SET_SELECTED: null,   // Selects a product option
  RECEIVE_BLOGS: null,    // Load all blogs,
  RECEIVE_BLOG: null,    // Load a blog
  COMMENTED: null,         // Comment successfuly
  CREATEDBLOG: null				// Create blog successfuly
});

},{}],11:[function(require,module,exports){
// Create dispatcher instance
var AppDispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
AppDispatcher.handleAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

module.exports = AppDispatcher;

},{}],12:[function(require,module,exports){
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

},{"../constants/BlogsConstants":10,"../dispatcher/AppDispatcher":11}],13:[function(require,module,exports){
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

},{"../actions/BlogActions":1}]},{},[2]);

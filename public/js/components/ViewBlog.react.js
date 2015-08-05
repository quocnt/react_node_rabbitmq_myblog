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

var ViewBlog = React.createClass({
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
	      <div className="blog-detail blog">
					<div className="title"><i className="fa fa-bookmark-o"></i> {blog.title}</div>
					<div className="under-title">
						<span className="author"><i className="fa fa-user"></i> {blog.author.username}</span>
						<span className="time">
							<i className="fa fa-calendar"></i> <DateFormat time={blog.createdAt}/>
						</span>
					</div>
					<p className="blog-content">{blog.content}</p>
					<Comments comments={blog.comments} blogId={blog._id}/>
				</div>
			)
		} else {
			return (<div/>)
		}
		
	},

	_onChange : function() {
		this.setState(getData());
	}
});

module.exports = ViewBlog;
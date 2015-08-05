var DateFormat = require('./Date.react');
var Link       = ReactRouter.Link;
var ListBlogs  = React.createClass({
	render: function() {
		var self = this;
		var blogs = this.props.blogs || [];
		return (
			<div className="blog-list">
			{
				blogs.map(function(blog) {
					return (
						<div className="blog">
							<Link to="blog" params={{blogId: blog._id}} className="title"><i className="fa fa-bookmark-o"></i> {blog.title}</Link>
							<div className="under-title">
								<span className="author"><i className="fa fa-user"></i> {blog.author.username}</span>
								<span className="time">
									<i className="fa fa-calendar"></i> <DateFormat time={blog.createdAt}/>
								</span>
							</div>
							<p className="blog-content"> {blog.content} </p>
							<div className="blog-comments">
								<span>{blog.comments.length}</span> comments
							 </div> 						
						</div>
					)
				})	
			}
			</div> 
		);
	}
});

module.exports = ListBlogs;
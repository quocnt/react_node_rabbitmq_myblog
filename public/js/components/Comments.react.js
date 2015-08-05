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

var Input = React.createClass({
	componentDidMount: function() {
		enterTrigger();
	},
	render : function() {
		return (
			<div className="input row">
				<div className="col-md-11">
					<input type="text" className="form-control" id="comment" placeholder="Enter your comment"/>
				</div>
				<button id="submit-comment" className="btn btn-default col-md-1" onClick={this.comment}>Comment</button>
			</div>
		)
	},
	comment : function() {
		newComment = $('#comment').val();
		if (!newComment) return;
		BlogApi.postComment(BlogId, newComment);
	},
});

if (!_.isEmpty(USER)) {
	displayInput = <Input/>;
} else {
	displayInput = React.createElement('div');
}


var Comments = React.createClass({
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
			<div className="comments">
				{displayInput}
				<div className="wrap-comment">
				{
					comments.map(function(comment) {
						return (
							<div className="comment">
								<span className="comment-author">{comment.author.username}</span> commented on 
								<span className="comment-date"><FormDate time={comment.createdAt}/></span>
								<div className="comment-content"><i className="fa fa-angle-right"></i>{comment.content}</div>
							</div>
						)
					})
				}
				</div>
			</div>
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
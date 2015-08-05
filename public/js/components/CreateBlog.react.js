var BlogsStore    = require('../stores/BlogsStore');
var BlogConstants = require('../constants/BlogsConstants');
var BlogApi       = require('../utils/BlogApi');

var CreateBlog = React.createClass({
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
			<div className="bl-form-create">
	      <form className="form-horizontal">
	        <div className="form-group">
	          <label for="inputEmail3" className="col-sm-2 control-label">Title</label>
	          <div className="col-sm-10">
	            <input type="text" className="form-control" placeholder="Blog's title" id="title"/>
	          </div>
	        </div>
	        <div className="form-group">
	          <label for="inputPassword3" className="col-sm-2 control-label">Content</label>
	          <div className="col-sm-10">
	            <textarea className="form-control" id="content"/>
	          </div>
	        </div>
	        <div className="form-group">
	          <div className="col-sm-offset-2 col-sm-10">
	            <button onClick={this.post} className="btn btn-default">Post</button>
	          </div>
	        </div>
	      </form>
	    </div>
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
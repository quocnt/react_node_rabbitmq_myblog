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

var BlogApp = React.createClass({
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
        <ListBlogs blogs={blogs}/>
      );
    } else if (!_.isEmpty(USER)){
      return (
        <Link to="create">Create one ?</Link>
      )
    } else {
      return (<div/>)
    }
  },

  _onChange: function() {
    this.setState(getData());
  }
});

module.exports = BlogApp;
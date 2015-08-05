var BlogApi    = require('./utils/BlogApi');
var BlogApp    = require('./components/BlogApp.react');
var ViewBlog   = require('./components/ViewBlog.react');
var CreateBlog = require('./components/CreateBlog.react');
var NavBar     = require('./components/NavBar.react');

var Route        = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;

var routes = (
  <Route>
  	<DefaultRoute handler={BlogApp}/>
    <Route name="blogs" handler={BlogApp}/>
    <Route name="blog" path="/blogs/:blogId" handler={ViewBlog} />
    <Route name="create" handler={CreateBlog} path="/create"/>
  </Route>
);

ReactRouter.run(routes, function (Handler) {
  React.render(
  	<div className="blog-app">
      <div className="nav-bar">
        <NavBar/>
      </div>
      <div className="container">
	      <div className="col-md-10">
	        <Handler/>
	      </div>
      </div>
    </div>, document.getElementById('my-blog')
  );
});
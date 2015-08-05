var loginButton, createButton;
var Link  = ReactRouter.Link;
var Login = React.createClass({
	render: function() {
		return (
			<li><a href="/login">Login</a></li>
		)
	}
});

var Create = React.createClass({
	render: function() {
		return (
			<li><a href="/#create">Create Blog</a></li>
		)
	}
});

var Logout = React.createClass({
	render: function() {
		return (
			<li><a href="/logout">Logout</a></li>
		)
	}
});

if (_.isEmpty(USER)) {
	loginButton = <Login/>;
	createButton = React.createElement('li');
} else {
	loginButton = <Logout/>;
	createButton = <Create/>;
}


var NavBar = React.createClass({
	render: function() {
		return (
			<header className="navbar navbar-static-top bs-docs-nav" id="top" role="banner">
				<nav className="navbar-default">
		      <div className="container">
		        <div className="navbar-header">
		          <a className="navbar-brand" href="#">Home Page</a>
		        </div>
		        <ul className="nav navbar-nav navbar-right">
		        	{createButton}
			        {loginButton}
			      </ul>
		      </div>
	    	</nav>
	    </header>
		)
	}
});

module.exports = NavBar;
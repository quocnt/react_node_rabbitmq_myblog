var formatTime = function(time) {
	return moment(time).format('MMMM Do YYYY');
};

var DATE = React.createClass({
	render: function() {
		var time = formatTime(this.props.time);
		return (
			<span> {time} </span>
		);
	}
});

module.exports = DATE;
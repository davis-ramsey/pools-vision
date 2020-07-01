import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends React.Component {
	componentDidUpdate() {
		console.log(this.props.portfolio);
	}
	render() {
		if (this.props.portfolio.length !== 0)
			return (
				<div className="ui secondary pointing menu">
					<Link to={`/${this.props.portfolio}`} className="ui button primary">
						Portfolio
					</Link>
				</div>
			);
		else return <div className="ui secondary pointing menu">Header</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		portfolio: state.portfolio
	};
};

export default connect(mapStateToProps)(Header);

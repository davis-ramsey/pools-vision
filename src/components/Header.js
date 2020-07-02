import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends React.Component {
	render() {
		if (this.props.portfolio.length !== 0)
			return (
				<div className="two ui buttons header">
					<Link
						to={`/portfolio/${this.props.portfolio.filter((value) => value !== '' && value !== null)}`}
						className="ui button left aligned primary"
					>
						Portfolio
					</Link>
					<Link to="/" className="ui button right aligned primary">
						All Pools
					</Link>
				</div>
			);
		else
			return (
				<div className="two ui buttons header">
					<Link to="/" className="ui button right aligned primary">
						All Pools
					</Link>
				</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		portfolio: state.portfolio
	};
};

export default connect(mapStateToProps)(Header);

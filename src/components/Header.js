import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends React.Component {
	render() {
		if (this.props.portfolio.length !== 0)
			return (
				<div className="five ui buttons header">
					<Link
						to={`/portfolio/${this.props.portfolio.filter((value) => value !== '' && value !== null)}`}
						className="ui button left aligned primary"
					>
						Portfolio
					</Link>
					<div className="ui animated secondary button">
						<div className="ui avatar image visible content">
							<img alt="grug stack rock" src="/images/pebbles.png" />
						</div>
						<div className="hidden content white">Grug stack rock</div>
					</div>

					<div className="ui animated secondary button">
						<div className="ui avatar image visible content">
							<img alt="graph" src="/images/graph.png" />
						</div>
						<div className="hidden content">Built using The Graph Protocol</div>
					</div>
					<div className="ui animated secondary button">
						<div className="ui avatar image visible content">
							<img alt="coingecko" src="/images/gecko.png" />
						</div>
						<div className="hidden content">Powered by CoinGecko API</div>
					</div>
					<Link to="/" className="ui button right aligned primary">
						All Pools
					</Link>
				</div>
			);
		else
			return (
				<div className="five ui buttons header">
					<div className="ui button left aligned primary loading">Portfolio</div>
					<div className="ui animated secondary button ">
						<div className="ui avatar image visible content">
							<img alt="grug stack rock" src="/images/pebbles.png" />
						</div>
						<div className="hidden content">Grug stack rock</div>
					</div>
					<div className="ui animated secondary button ">
						<div className="ui avatar image visible content">
							<img alt="graph" src="/images/graph.png" />
						</div>
						<div className="hidden content">Built using The Graph Protocol</div>
					</div>
					<div className="ui animated secondary button ">
						<div className="ui avatar image visible content">
							<img alt="coingecko" src="/images/gecko.png" />
						</div>
						<div className="hidden content">Powered by CoinGecko API</div>
					</div>
					<Link to="/" className="ui button right aligned primary ">
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

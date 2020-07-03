import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.timer = 0;
	}
	renderPortfolioButton() {
		if (this.props.portfolio.length !== 0)
			return (
				<Link
					to={`/portfolio/${this.props.portfolio.filter((value) => value !== '' && value !== null)}`}
					className="ui button animated left aligned primary"
				>
					<div className="visible content center">Portfolio</div>
					<div className="hidden content">View Selected Pools</div>
				</Link>
			);
		else return null;
	}

	renderMenu() {
		return (
			<div className="five ui buttons header">
				{this.renderPortfolioButton()}
				<div className="ui animated secondary button">
					<div className="ui avatar image visible content">
						<img alt="grug stack rock" src="/images/pebbles.png" />
					</div>
					<div className="hidden content">Grug stack rock</div>
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
				<Link to="/" className="ui button animated right aligned primary">
					<div className="visible content">All Pools</div>
					<div className="hidden content">View All Pools</div>
				</Link>
			</div>
		);
	}

	render() {
		return (
			<div>
				{this.renderMenu()}
				<div className="ui horizontal divider">Page Last Refreshed: {Date()}</div>
				<div className="ui ignored info message">
					For the official Balancer Pool interface, please visit
					<a target="_blank" rel="noopener noreferrer" href={`https://pools.balancer.exchange/#/`}>
						{' '}
						https://pools.balancer.exchange/#/
					</a>
					<br />
					Click a pool to add or remove it from your selected pools. To view only selected pools, click the
					Portfolio button. To view all pools, click the All Pools button. Prices are automatically updated
					every 5 minutes. Note: APY is calculated using 24h fee yield extrapolated to an annualized rate plus
					yield on weekly BAL distributions.
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		portfolio: state.portfolio,
		prices: state.coingecko
	};
};

export default connect(mapStateToProps)(Header);

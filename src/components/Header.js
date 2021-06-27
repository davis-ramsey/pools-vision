import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderTable from './HeaderTable';

class Header extends React.Component {
	renderPortfolioButton() {
		if (this.props.portfolio.length !== 0)
			return (
				<Link
					to={`/portfolio/${this.props.portfolio.filter((value) => value !== '' && value !== null)}`}
					className="ui button animated left aligned primary"
				>
					<div className="visible content center">Selected Pools</div>
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
						<img alt="grug stack rock" src="https://i.imgur.com/87YWwgq.png" />
					</div>
					<div className="ui hidden content">Grug stack rock</div>
				</div>

				<div className="ui animated secondary button">
					<div className="ui avatar image visible content">
						<img alt="graph" src="https://i.imgur.com/90yffKg.png" />
					</div>
					<div className="hidden content">Built using The Graph Protocol</div>
				</div>
				<div className="ui animated secondary button">
					<div className="ui avatar image visible content">
						<img alt="coingecko" src="https://i.imgur.com/EbNy23a.png" />
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
				<div className="ui inverted horizontal divider">Page Last Refreshed: {Date()}</div>
				<div className="ui black message" style={{ boxShadow: '0 0 0.5rem white', borderRadius: '10px' }}>
Est Liquidity: Liquidity calculated by multiplying USDC balance in the pool. If no USDC in pool, then 0.<br />
Days Passed: Days since pool creation<br/>
FPD: Average Fees Per Day over pool's lifetime. <br/>
Avg APY: Average Fee APY since pool creation <br/>
Total APY: All rewards APY plus Avg. Fee APY<br/>
					<br />
					<b>Welcome to Balancer v2 on Polygon!</b> Click a pool address to see that pool on the main UI at https://polygon.balancer.fi/#/<br />
				</div>
				<HeaderTable />
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

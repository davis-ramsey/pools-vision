import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { connect } from 'react-redux';
import {
	fetchPools,
	fetchPool,
	fetchPrice,
	deletePools,
	selectPool,
	deletePool,
	sumLiquidity,
	clearLiquidity,
	deletePrices
} from '../actions';
import {
	renderAssets,
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	checkLiquidity,
	renderTotalYield,
	renderAdjLiquidity,
	renderAssetsText
} from './helpers/balancerHelpers';
import { feeFactor, ratioFactor } from './helpers/factorCalcs';

class PortfolioView extends React.Component {
	constructor(props) {
		super(props);
		this.timer = null;
	}
	async componentDidMount() {
		const pools = this.props.portfolio.split(',');
		for (let pool of pools) {
			await this.props.fetchPool(pool);
			this.props.selectPool(pool);
		}
		if (!this.props.allPools) await this.props.fetchPools();
		if (!this.props.prices['0xba100000625a3754423978a60c9317c58a424e3d'] && this.props.allPools) {
			const addresses = [];
			for (let pool of this.props.allPools) {
				for (let token of pool.tokens) {
					if (addresses.indexOf(token.address) === -1) addresses.push(token.address);
				}
			}
			const a1 = addresses.slice(0, addresses.length / 2);
			const a2 = addresses.slice(addresses.length / 2);
			await this.props.fetchPrice(a1.join(','));
			await this.props.fetchPrice(a2.join(','));
		}
		if (this.props.allPools) for (let pool of this.props.allPools) this.adjLiquidity(pool);
		this.timer = setInterval(() => {
			this.props.deletePrices();
			this.refreshData();
		}, 60000);
	}
	componentWillUnmount() {
		this.props.deletePools();
		this.props.clearLiquidity();
		clearInterval(this.timer);
	}
	async refreshData() {
		clearInterval(this.timer);
		await this.props.fetchPools();
		const addresses = [];
		for (let pool of this.props.allPools) {
			for (let token of pool.tokens) {
				if (addresses.indexOf(token.address) === -1) addresses.push(token.address);
			}
		}
		const a1 = addresses.slice(0, addresses.length / 2);
		const a2 = addresses.slice(addresses.length / 2);
		await this.props.fetchPrice(a1.join(','));
		await this.props.fetchPrice(a2.join(','));
		this.timer = setInterval(() => {
			this.props.deletePrices();
			this.refreshData();
		}, 60000);
	}

	totalFactor = (pool) => {
		const fee = feeFactor(pool.swapFee);
		const ratio = ratioFactor(pool);
		return fee * ratio;
	};
	adjLiquidity = (pool) => {
		const totalFactor = this.totalFactor(pool);
		const liquidity = renderTotalLiquidity(pool, this.props.prices).split(',').join('');
		this.props.sumLiquidity(liquidity * totalFactor);
	};

	renderTable() {
		const pools = this.props.portfolio.split(',');
		return pools.map((pool) => {
			if (this.props.checkPortfolio.indexOf(pool) === -1) return null;
			const selectedPool = this.props.pools[pool];
			if (selectedPool && this.props.prices && this.props.portfolio && this.props.sumLiq > 138683236) {
				const check = parseInt(checkLiquidity(selectedPool, this.props.prices));
				if (check !== 0)
					return (
						<tr key={selectedPool.id}>
							<td className="center aligned" data-label="Pool Address">
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={`https://pools.balancer.exchange/#/pool/${selectedPool.id}`}
								>
									<button className="ui inverted left floated button">
										...{selectedPool.id.slice(-8)}
									</button>
								</a>
							</td>

							<td
								onClick={() => this.props.deletePool(selectedPool.id)}
								className="center aligned"
								data-label="Assets"
							>
								<PieChart className="ui tiny circular image" data={renderAssets(selectedPool)} />
								<i className="icon long arrow alternate right" />
								{renderAssetsText(selectedPool).join('  ')}
							</td>
							<td
								onClick={() => this.props.deletePool(selectedPool.id)}
								className="center aligned"
								data-label="Swap Fee"
							>
								{(selectedPool.swapFee * 100).toFixed(2)}%
							</td>
							<td
								onClick={() => this.props.deletePool(selectedPool.id)}
								className="center aligned"
								data-label="Total Liquidity"
							>
								${renderTotalLiquidity(selectedPool, this.props.prices)}
							</td>
							<td
								onClick={() => this.props.deletePool(selectedPool.id)}
								className="center aligned"
								data-label="24h Trading Volume"
							>
								${renderVolume(selectedPool)}
							</td>
							<td
								onClick={() => this.props.deletePool(selectedPool.id)}
								className="center aligned"
								data-label="24h Fees"
							>
								${renderFees(selectedPool)}
							</td>
							<td
								onClick={() => this.props.deletePool(selectedPool.id)}
								className="center aligned"
								data-label="Annual BAL"
							>
								{renderAdjLiquidity(selectedPool, this.props.prices, this.props.sumLiq).toFixed(0)}
							</td>
							<td
								onClick={() => this.props.deletePool(selectedPool.id)}
								className="center aligned"
								data-label="APY"
							>
								{renderTotalYield(selectedPool, this.props.prices, this.props.sumLiq)}%
							</td>
						</tr>
					);
				else
					return (
						<tr key={selectedPool.id}>
							<td>Loading!</td>
						</tr>
					);
			} else return null;
		});
	}

	render() {
		return (
			<div>
				<div className="ui horizontal divider">Your Selected Pools</div>
				<table className="ui selectable inverted striped celled table">
					<thead>
						<tr>
							<th className="center aligned">Pool Address</th>
							<th className="center aligned">Assets</th>
							<th className="center aligned">Swap Fee</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">24h Trading Volume</th>
							<th className="center aligned">24h Fees</th>
							<th className="center aligned">Annual BAL</th>
							<th className="center aligned">APY</th>
						</tr>
					</thead>
					<tbody>{this.renderTable()}</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		portfolio: ownProps.match.params.portfolio,
		pools: state.poolReducer,
		prices: state.coingecko,
		checkPortfolio: state.portfolio,
		sumLiq: state.sumLiq,
		allPools: state.balancer.pools
	};
};

export default connect(mapStateToProps, {
	fetchPools,
	fetchPool,
	fetchPrice,
	selectPool,
	deletePool,
	deletePools,
	sumLiquidity,
	clearLiquidity,
	deletePrices
})(PortfolioView);

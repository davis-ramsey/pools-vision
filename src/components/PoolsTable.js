import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { connect } from 'react-redux';
import { fetchPools, fetchPrice, selectPool, deletePool, sumLiquidity, clearLiquidity, deletePrices } from '../actions';
import {
	renderAssets,
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	checkLiquidity,
	renderAdjLiquidity,
	renderTotalYield,
	renderAssetsText
} from './helpers/balancerHelpers';
import { feeFactor, ratioFactor } from './helpers/factorCalcs';

class PoolsTable extends React.Component {
	constructor(props) {
		super(props);
		this.timer = null;
		this.sum = 0;
	}
	async componentDidMount() {
		if (!this.props.pools) await this.props.fetchPools();
		if (!this.props.prices['0xba100000625a3754423978a60c9317c58a424e3d']) {
			const addresses = [];
			for (let pool of this.props.pools) {
				for (let token of pool.tokens) {
					if (addresses.indexOf(token.address) === -1) addresses.push(token.address);
				}
			}
			const a1 = addresses.slice(0, addresses.length / 2);
			const a2 = addresses.slice(addresses.length / 2);
			await this.props.fetchPrice(a1.join(','));
			await this.props.fetchPrice(a2.join(','));
		}
		for (let pool of this.props.pools) this.adjLiquidity(pool);
		this.props.sumLiquidity(this.sum);
		this.timer = setInterval(() => {
			this.props.deletePrices();
			this.refreshData();
		}, 300000);
	}
	componentWillUnmount() {
		this.props.clearLiquidity();
		clearInterval(this.timer);
	}

	async refreshData() {
		clearInterval(this.timer);
		await this.props.fetchPools();
		const addresses = [];
		for (let pool of this.props.pools) {
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
		}, 300000);
	}

	totalFactor = (pool) => {
		const fee = feeFactor(pool.swapFee);
		const ratio = ratioFactor(pool);
		return fee * ratio;
	};

	adjLiquidity = (pool) => {
		const totalFactor = this.totalFactor(pool);
		const liquidity = renderTotalLiquidity(pool, this.props.prices).split(',').join('');
		if (isNaN(liquidity * totalFactor)) return;
		this.sum += liquidity * totalFactor;
	};

	render() {
		if (this.props.pools && this.props.prices && this.props.portfolio && this.props.sumLiq > 138683236)
			return this.props.pools.map((pool) => {
				const check = parseInt(checkLiquidity(pool, this.props.prices));
				if (check !== 0) {
					if (this.props.portfolio.indexOf(pool.id) === -1)
						return (
							<tr key={pool.id}>
								<td className="center aligned" data-label="Pool Address">
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={`https://pools.balancer.exchange/#/pool/${pool.id}`}
									>
										<button className="ui inverted left floated button">
											...{pool.id.slice(-8)}
										</button>
									</a>
								</td>
								<td
									onClick={() => this.props.selectPool(pool.id)}
									className="center aligned"
									data-label="Assets"
								>
									<PieChart
										onClick={() => this.props.selectPool(pool.id)}
										className="ui tiny circular image"
										data={renderAssets(pool)}
									/>
									<i className="icon long arrow alternate right" />
									{renderAssetsText(pool).join('  ')}
								</td>
								<td
									onClick={() => this.props.selectPool(pool.id)}
									className="center aligned"
									data-label="Swap Fee"
								>
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td
									onClick={() => this.props.selectPool(pool.id)}
									className="center aligned"
									data-label="Total Liquidity"
								>
									${renderTotalLiquidity(pool, this.props.prices)}
								</td>
								<td
									onClick={() => this.props.selectPool(pool.id)}
									className="center aligned"
									data-label="24h Trading Volume"
								>
									${renderVolume(pool)}
								</td>
								<td
									onClick={() => this.props.selectPool(pool.id)}
									className="center aligned"
									data-label="24h Fees"
								>
									${renderFees(pool)}
								</td>
								<td
									onClick={() => this.props.selectPool(pool.id)}
									className="center aligned"
									data-label="Annual BAL"
								>
									{Number(
										renderAdjLiquidity(pool, this.props.prices, this.props.sumLiq).toFixed(0)
									).toLocaleString()}
								</td>
								<td
									onClick={() => this.props.selectPool(pool.id)}
									className="center aligned"
									data-label="APY"
								>
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq)}%
								</td>
							</tr>
						);
					else
						return (
							<tr className="positive" key={pool.id}>
								<td className="center aligned" data-label="Pool Address">
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={`https://pools.balancer.exchange/#/pool/${pool.id}`}
									>
										<button className="ui left floated button">...{pool.id.slice(-8)}</button>
									</a>
								</td>
								<td
									onClick={() => this.props.deletePool(pool.id)}
									className="center aligned"
									data-label="Assets"
								>
									<PieChart
										onClick={() => this.props.deletePool(pool.id)}
										className="ui tiny circular image"
										data={renderAssets(pool)}
									/>
									<i className="icon long arrow alternate right" />
									{renderAssetsText(pool).join('  ')}
								</td>
								<td
									onClick={() => this.props.deletePool(pool.id)}
									className="center aligned"
									data-label="Swap Fee"
								>
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td
									onClick={() => this.props.deletePool(pool.id)}
									className="center aligned"
									data-label="Total Liquidity"
								>
									${renderTotalLiquidity(pool, this.props.prices)}
								</td>
								<td
									onClick={() => this.props.deletePool(pool.id)}
									className="center aligned"
									data-label="24h Trading Volume"
								>
									${renderVolume(pool)}
								</td>
								<td
									onClick={() => this.props.deletePool(pool.id)}
									className="center aligned"
									data-label="24h Fees"
								>
									${renderFees(pool)}
								</td>
								<td
									onClick={() => this.props.deletePool(pool.id)}
									className="center aligned"
									data-label="Annual BAL"
								>
									{Number(
										renderAdjLiquidity(pool, this.props.prices, this.props.sumLiq).toFixed(0)
									).toLocaleString()}
								</td>
								<td
									onClick={() => this.props.deletePool(pool.id)}
									className="center aligned"
									data-label="APY"
								>
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq)}%
								</td>
							</tr>
						);
				}
				return null;
			});
		else
			return (
				<tr>
					<td>Loading</td>
				</tr>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko,
		portfolio: state.portfolio,
		sumLiq: state.sumLiq
	};
};

export default connect(mapStateToProps, {
	fetchPools,
	fetchPrice,
	selectPool,
	deletePool,
	sumLiquidity,
	clearLiquidity,
	deletePrices
})(PoolsTable);

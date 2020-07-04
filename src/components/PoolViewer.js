import React from 'react';
import { connect } from 'react-redux';
import {
	fetchPools,
	fetchPool,
	fetchPrice,
	deletePools,
	sumAllLiq,
	sumAllVol,
	sumLiquidity,
	clearLiquidity,
	deleteAllLiq,
	deleteAllVol
} from '../actions';
import {
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderAdjLiquidity,
	renderAssetsText,
	renderTotalYield
} from './helpers/balancerHelpers';
import { feeFactor, ratioFactor } from './helpers/factorCalcs';

class PoolViewer extends React.Component {
	constructor(props) {
		super(props);
		this.sumTotalAdjLiq = 0;
		this.sumTotalLiq = 0;
		this.sumVolume = 0;
	}
	async componentDidMount() {
		await this.props.fetchPool(this.props.viewPool);
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

		for (let pool of this.props.allPools) {
			this.adjLiquidity(pool);
			this.getTotalVolume(pool);
		}
		this.props.sumAllLiq(this.sumTotalLiq);
		this.props.sumAllVol(this.sumVolume);
		this.props.sumLiquidity(this.sumTotalAdjLiq);
	}

	getTotalVolume(pool) {
		const totalSwapVolume = pool.totalSwapVolume;
		if (pool.swaps[0] === undefined) return;
		const swap = pool.swaps[0].poolTotalSwapVolume;
		const volume = totalSwapVolume - swap;
		this.sumVolume += volume;
	}

	totalFactor = (pool) => {
		const fee = feeFactor(pool.swapFee);
		const ratio = ratioFactor(pool);
		return fee * ratio;
	};

	adjLiquidity = (pool) => {
		const totalFactor = this.totalFactor(pool);
		const liquidity = parseFloat(renderTotalLiquidity(pool, this.props.prices).split(',').join(''));
		if (!isNaN(liquidity)) this.sumTotalLiq += liquidity;
		if (isNaN(liquidity * totalFactor)) return;
		this.sumTotalAdjLiq += liquidity * totalFactor;
	};
	componentWillUnmount() {
		this.props.deletePools();
		this.props.clearLiquidity();
		this.props.deleteAllLiq();
		this.props.deleteAllVol();
	}

	renderAssetValue(index) {
		const token = this.props.pool[this.props.viewPool].tokens[index];
		const address = token.address;
		if (this.props.prices[address] === undefined) return '0';
		const price = this.props.prices[address].usd;
		const balance = parseFloat(token.balance);
		console.log(price);
		console.log(balance);
		return Number((price * balance).toFixed(2)).toLocaleString();
	}

	renderAssetPrice(index) {
		const token = this.props.pool[this.props.viewPool].tokens[index];
		const address = token.address;
		if (this.props.prices[address] === undefined) return '0';
		const price = this.props.prices[address].usd;
		return Number(price).toLocaleString();
	}

	renderAssetTable() {
		const assets = renderAssetsText(this.props.pool[this.props.viewPool]);
		return assets.map((asset, index) => {
			const output = asset.split(' ');
			return (
				<tr key={index}>
					<td className="center aligned" data-label="Asset">
						{output[1]}
					</td>
					<td className="center aligned" data-label="Price">
						${this.renderAssetPrice(index)}
					</td>
					<td className="center aligned" data-label="Weight">
						{output[0]}
					</td>
					<td className="center aligned" data-label="Value">
						${this.renderAssetValue(index)}
					</td>
				</tr>
			);
		});
	}

	render() {
		if (this.props.pool[this.props.viewPool] && this.props.prices && this.props.sumLiq > 138683236)
			return (
				<div>
					<div className="ui horizontal divider">Pool Viewer: {this.props.viewPool}</div>
					<table className="ui selectable inverted striped celled table">
						<thead>
							<tr>
								<th className="center aligned">Total Liquidity</th>
								<th className="center aligned">Swap Fee</th>
								<th className="center aligned">24h Trading Volume</th>
								<th className="center aligned">24h Fees</th>
								<th className="center aligned">Annual BAL</th>
								<th className="center aligned">APY</th>
							</tr>
						</thead>
						<tbody>
							<tr key="main">
								<td className="center aligned" data-label="Total Liquidity">
									${renderTotalLiquidity(this.props.pool[this.props.viewPool], this.props.prices)}
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(this.props.pool[this.props.viewPool].swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="24h Trading Volume">
									${renderVolume(this.props.pool[this.props.viewPool])}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${renderFees(this.props.pool[this.props.viewPool])}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{Number(
										renderAdjLiquidity(
											this.props.pool[this.props.viewPool],
											this.props.prices,
											this.props.sumLiq
										).toFixed(0)
									).toLocaleString()}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(
										this.props.pool[this.props.viewPool],
										this.props.prices,
										this.props.sumLiq
									)}%
								</td>
							</tr>
						</tbody>
					</table>
					<table className="ui selectable inverted striped celled table">
						<thead>
							<tr>
								<th className="center aligned">Asset</th>
								<th className="center aligned">Price</th>
								<th className="center aligned">Weight</th>
								<th className="center aligned">Value</th>
							</tr>
						</thead>
						<tbody>{this.renderAssetTable()}</tbody>
					</table>
				</div>
			);
		else return 'Loading!';
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		viewPool: ownProps.match.params.viewPool,
		prices: state.coingecko,
		pool: state.poolReducer,
		sumLiq: state.sumLiq,
		allPools: state.balancer.pools
	};
};

export default connect(mapStateToProps, {
	fetchPools,
	fetchPrice,
	fetchPool,
	deletePools,
	sumAllLiq,
	sumAllVol,
	sumLiquidity,
	clearLiquidity,
	deleteAllLiq,
	deleteAllVol
})(PoolViewer);

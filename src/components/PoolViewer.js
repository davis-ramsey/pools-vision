import React from 'react';
import { connect } from 'react-redux';
import { fetchPool, deletePools } from '../actions';
import {
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderTotalYield,
	renderNumLP,
	renderLifetimeFees,
	numberWithCommas,
	renderCapFactor,
} from './helpers/balancerHelpers';

class PoolViewer extends React.Component {
	constructor(props) {
		super(props);
		this.timer = null;
	}
	async componentDidMount() {
		await this.props.fetchPool(this.props.viewPool);
		this.timer = setInterval(async () => {
			await this.props.fetchPool(this.props.viewPool);
		}, 60000);
	}

	componentWillUnmount() {
		this.props.deletePools();
		clearInterval(this.timer);
	}

	renderAssetValue(index) {
		const token = this.props.pool[this.props.viewPool].tokens[index];
		const address = token.address;
		if (this.props.prices[address] === undefined) return '0';
		const price = this.props.prices[address].usd;
		const balance = parseFloat(token.balance);
		return numberWithCommas((price * balance).toFixed(2));
	}

	renderAssetPrice(index) {
		const token = this.props.pool[this.props.viewPool].tokens[index];
		const address = token.address;
		if (this.props.prices[address] === undefined) return '0';
		const price = this.props.prices[address].usd;
		return numberWithCommas(price);
	}

	renderCap(asset) {
		const obj = this.props.caps.filter((item) => item.name === asset);
		if (!obj[0]) return `Asset Not Whitelisted`;
		return renderCapFactor(obj[0].addr, obj[0].adj).toFixed(4);
	}

	renderAssetTable() {
		const pool = this.props.pool[this.props.viewPool];
		const assets = [];
		for (let token of pool.tokens) {
			const weight = token.weight / pool.totalWeight;
			const percentage = (weight * 100).toFixed(2) + '%';
			assets.push(percentage + ' ' + token.symbol);
		}
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
					<td className="center aligned" data-label="Balance">
						{parseFloat(this.props.pool[this.props.viewPool].tokens[index].balance).toFixed(2)}
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

	renderSwapsTable() {
		const pool = this.props.pool[this.props.viewPool];
		const swapFee = parseFloat(pool.swapFee)
		return pool.swaps.map((swap, index) => {
			const addressIn = swap.tokenIn;
			const addressOut = swap.tokenOut
			return (
				<tr key={index}>
					<td className="center aligned" data-label="Asset">
						{swap.tokenInSym}
					</td>
					<td className="center aligned" data-label="Amount In">
						{parseFloat(swap.tokenAmountIn).toFixed(4)}
					</td>
					<td className="center aligned" data-label="Value">
						${(this.props.prices[addressIn].usd*parseFloat(swap.tokenAmountIn)).toFixed(2)}
					</td>
					<td className="center aligned" data-label="Asset">
						{swap.tokenOutSym}
					</td>
					<td className="center aligned" data-label="Amount Out">
						{parseFloat(swap.tokenAmountOut).toFixed(4)}
					</td>
					<td className="center aligned" data-label="Value">
						${(this.props.prices[addressOut].usd*parseFloat(swap.tokenAmountOut)).toFixed(2)}
					</td>
					<td className="center aligned" data-label="Fee">
					${(this.props.prices[addressOut].usd*parseFloat(swap.tokenAmountOut)*swapFee).toFixed(2)}
					</td>
					<td className="center aligned" data-label="Time">
					<a
								target="_blank"
								rel="noopener noreferrer"
								href={`https://etherscan.io/tx/${swap.tx}`}
							>{new Date(swap.timestamp*1000).toLocaleTimeString("en-US")}
							</a>
					</td>
				</tr>
			);
		});
	}

	render() {
		if (
			this.props.pool[this.props.viewPool] && this.props.prices['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'] && this.props.caps[5]
		)
			return (
				<div>
					<div className="ui inverted horizontal divider">Pool Viewer: {this.props.viewPool}</div>
					<table className="ui selectable inverted striped celled table">
						<thead>
							<tr>
								<th className="center aligned">Total Liquidity</th>
								<th className="center aligned">Swap Fee</th>
								<th className="center aligned">24h Volume</th>
								<th className="center aligned">24h Fees</th>
								<th className="center aligned">Total APY</th>
								<th className="center aligned">Lifetime Fees</th>
								<th className="center aligned"># of LP's</th>
							</tr>
						</thead>
						<tbody>
							<tr key="main">
								<td className="center aligned" data-label="Total Liquidity">
									<div className="ui">
										${numberWithCommas(
											renderTotalLiquidity(
												this.props.pool[this.props.viewPool],
												this.props.prices
											)
										)}
									</div>
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(this.props.pool[this.props.viewPool].swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="24h Volume">
									${numberWithCommas(renderVolume(this.props.pool[this.props.viewPool]))}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${numberWithCommas(renderFees(this.props.pool[this.props.viewPool]))}
								</td>
								<td className="center aligned" data-label="Total APY">
									{
										renderTotalYield(
											this.props.pool[this.props.viewPool],
											this.props.prices,
											this.props.sumLiq,
											this.props.caps,
											this.props.balMultiplier
										)[2]
									}%
								</td>
								<td className="center aligned" data-label="Lifetime Fees">
									${numberWithCommas(renderLifetimeFees(this.props.pool[this.props.viewPool]))}
								</td>
								<td className="center aligned" data-label="# of LP's">
									{renderNumLP(this.props.pool[this.props.viewPool], this.props.moreShares)}
								</td>
							</tr>
						</tbody>
					</table>
					<table className="ui selectable inverted striped celled table">
						<thead>
							<tr>
								<th className="center aligned">Asset</th>
								<th className="center aligned">Price</th>
								<th className="center aligned">Balance</th>
								<th className="center aligned">Weight</th>
								<th className="center aligned">Value</th>
							</tr>
						</thead>
						<tbody>{this.renderAssetTable()}</tbody>
					</table>
					<table className="ui selectable inverted striped celled table">
						<thead>
							<tr>
								<th className="center aligned">Asset</th>
								<th className="center aligned">Amount In</th>
								<th className="center aligned">Value</th>
								<th className="center aligned">Asset</th>
								<th className="center aligned">Amount Out</th>
								<th className="center aligned">Value</th>
								<th className="center aligned">Fee</th>
								<th className="center aligned">Time</th>
							</tr>
						</thead>
						<tbody>{this.renderSwapsTable()}</tbody>
					</table>
				</div>
			);
		else
			return (
				<div class="ui active dimmer">
					<div class="ui text loader">{this.props.error}</div>
				</div>
			);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		viewPool: ownProps.match.params.viewPool,
		prices: state.coingecko,
		pool: state.poolReducer,
		sumLiq: state.sumFinal,
		allPools: state.balancer.pools,
		moreShares: state.moreShares,
		caps: state.caps,
		balMultiplier: state.balMultiplier,
		error: state.error
	};
};

export default connect(mapStateToProps, {
	fetchPool,
	deletePools
})(PoolViewer);

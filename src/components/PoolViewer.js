import React from 'react';
import { connect } from 'react-redux';
import { fetchPool, deletePools } from '../actions';
import {
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderAdjLiquidity,
	renderTotalYield,
	renderNumLP,
	renderLifetimeFees,
	balFactor,
	wrapFactor,
	totalFactor,
	renderRealAdj,
	numberWithCommas,
	renderCapFactor
} from './helpers/balancerHelpers';
import { feeFactor } from './helpers/factorCalcs';

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
		return renderCapFactor(obj[0].addr, obj[0].adj).toFixed(4);
	}

	renderAssetTable() {
		const pool = this.props.pool[this.props.viewPool];
		const assets = [];
		for (let token of pool.tokens) {
			const weight = token.denormWeight / pool.totalWeight;
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
					<td className="center aligned" data-label="capFactor">
						{this.renderCap(output[1])}
					</td>
				</tr>
			);
		});
	}

	render() {
		if (
			this.props.pool[this.props.viewPool] &&
			this.props.prices &&
			this.props.sumLiq > 138683236 &&
			this.props.caps[5]
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
								<th className="center aligned">Fee Factor</th>
								<th className="center aligned">BAL/Ratio Factor</th>
								<th className="center aligned">Wrap Factor</th>
								<th className="center aligned">Total Factor</th>
								<th className="center aligned">Annual BAL</th>
								<th className="center aligned">APY</th>
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
									<div className="ui" style={{ fontSize: '12px' }}>
										Adj: ${numberWithCommas(
											renderRealAdj(
												this.props.pool[this.props.viewPool],
												this.props.prices,
												this.props.caps
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
								<td className="center aligned" data-label="Fee Factor">
									{feeFactor(this.props.pool[this.props.viewPool].swapFee).toFixed(4)}
								</td>
								<td className="center aligned" data-label="Bal Factor">
									{balFactor(this.props.pool[this.props.viewPool]).toFixed(4)}
								</td>
								<td className="center aligned" data-label="Wrap Factor">
									{wrapFactor(this.props.pool[this.props.viewPool]).toFixed(4)}
								</td>
								<td className="center aligned" data-label="Total Factor">
									{totalFactor(this.props.pool[this.props.viewPool]).toFixed(4)}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{numberWithCommas(
										renderAdjLiquidity(
											this.props.pool[this.props.viewPool],
											this.props.prices,
											this.props.sumLiq,
											this.props.caps
										).toFixed(0)
									)}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(
										this.props.pool[this.props.viewPool],
										this.props.prices,
										this.props.sumLiq,
										this.props.caps
									)}%
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
								<th className="center aligned">capFactor</th>
							</tr>
						</thead>
						<tbody>{this.renderAssetTable()}</tbody>
					</table>
				</div>
			);
		else return <div className="ui inverted horizontal divider">Pool Viewer is loading! Standby..</div>;
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
		caps: state.caps
	};
};

export default connect(mapStateToProps, {
	fetchPool,
	deletePools
})(PoolViewer);

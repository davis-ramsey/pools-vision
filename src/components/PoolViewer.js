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
	renderLifetimeFees
} from './helpers/balancerHelpers';

class PoolViewer extends React.Component {
	async componentDidMount() {
		await this.props.fetchPool(this.props.viewPool);
	}

	componentWillUnmount() {
		this.props.deletePools();
	}

	renderAssetValue(index) {
		const token = this.props.pool[this.props.viewPool].tokens[index];
		const address = token.address;
		if (this.props.prices[address] === undefined) return '0';
		const price = this.props.prices[address].usd;
		const balance = parseFloat(token.balance);
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
						{Number(
							parseFloat(this.props.pool[this.props.viewPool].tokens[index].balance).toFixed(2)
						).toLocaleString()}
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
					<div className="ui inverted horizontal divider">Pool Viewer: {this.props.viewPool}</div>
					<table className="ui selectable inverted striped celled table">
						<thead>
							<tr>
								<th className="center aligned">Total Liquidity</th>
								<th className="center aligned">Swap Fee</th>
								<th className="center aligned">24h Volume</th>
								<th className="center aligned">24h Fees</th>
								<th className="center aligned">Annual BAL</th>
								<th className="center aligned">APY</th>
								<th className="center aligned">Lifetime Fees</th>
								<th className="center aligned"># of LP's</th>
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
								<td className="center aligned" data-label="24h Volume">
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
								<td className="center aligned" data-label="Lifetime Fees">
									${renderLifetimeFees(this.props.pool[this.props.viewPool])}
								</td>
								<td className="center aligned" data-label="# of LP's">
									{renderNumLP(this.props.pool[this.props.viewPool])}
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
		sumLiq: state.sumLiq,
		allPools: state.balancer.pools
	};
};

export default connect(mapStateToProps, {
	fetchPool,
	deletePools
})(PoolViewer);

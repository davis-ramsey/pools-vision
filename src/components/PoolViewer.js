import React from 'react';
import { connect } from 'react-redux';
import { fetchPool, deletePools } from '../actions';
import {
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderAdjLiquidity,
	renderAssetsText,
	renderTotalYield
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
	fetchPool,
	deletePools
})(PoolViewer);

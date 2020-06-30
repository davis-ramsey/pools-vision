import React from 'react';
import { connect } from 'react-redux';
import { fetchPools, fetchPrice } from '../actions';

class Pools extends React.Component {
	componentDidMount() {
		this.props.fetchPrice('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
		this.props.fetchPools();
	}

	renderAssets(pool) {
		if (this.props.pools) {
			const assets = [];
			for (let token of pool.tokens) {
				const weight = token.denormWeight / pool.totalWeight;
				assets.push(weight.toFixed(4) * 100 + '% ' + token.symbol);
			}
			return <td data-label="Assets">{assets.join(' ')}</td>;
		}
	}

	renderTable() {
		if (this.props.pools)
			return this.props.pools.map((pool) => {
				return (
					<tr key={pool.id}>
						<td data-label="Pool Address">{pool.id}</td>
						{this.renderAssets(pool)}
						<td data-label="Swap Fee">{pool.swapFee * 100}%</td>
						<td data-label="Total Liquidity">$900,000</td>
						<td data-label="24h Trading Volume">$50,000</td>
						<td data-label="24h fees">$500</td>
					</tr>
				);
			});
	}

	render() {
		return (
			<div>
				<div className="ui horizontal divider header">List of All Pools</div>
				<table className="ui celled table">
					<thead>
						<tr>
							<th>Pool Address</th>
							<th>Assets</th>
							<th>Swap Fee</th>
							<th>Total Liquidity</th>
							<th>24h Trading Volume</th>
							<th>24h Fees</th>
						</tr>
					</thead>
					<tbody>{this.renderTable()}</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools
	};
};
export default connect(mapStateToProps, { fetchPools, fetchPrice })(Pools);

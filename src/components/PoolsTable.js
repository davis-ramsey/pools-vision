import React from 'react';
import { connect } from 'react-redux';
import { fetchPools, fetchPrice, selectPool } from '../actions';
import {
	renderAssets,
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderYield,
	checkLiquidity
} from './helpers/balancerHelpers';

class PoolsTable extends React.Component {
	async componentDidMount() {
		await this.props.fetchPools();
		const addresses = [];
		for (let pool of this.props.pools) {
			for (let token of pool.tokens) {
				if (addresses.indexOf(token.address) === -1) addresses.push(token.address);
			}
		}
		await this.props.fetchPrice(addresses.join(','));
	}

	render() {
		if (this.props.pools && this.props.prices)
			return this.props.pools.map((pool, index) => {
				const check = parseInt(checkLiquidity(pool, this.props.prices));
				if (check !== 0) {
					return (
						<tr onClick={() => this.props.selectPool(pool.id)} key={pool.id}>
							<td data-label="Pool Address">...{pool.id.slice(-8)}</td>
							{renderAssets(pool)}
							<td data-label="Swap Fee">{(pool.swapFee * 100).toFixed(2)}%</td>
							{renderTotalLiquidity(pool, this.props.prices)}
							{renderVolume(pool)}
							{renderFees(pool)}
							{renderYield(pool, index, this.props.prices)}
						</tr>
					);
				}
				return null;
			});
		else return null;
	}
}

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko.prices
	};
};

export default connect(mapStateToProps, { fetchPools, fetchPrice, selectPool })(PoolsTable);

import React from 'react';
import { connect } from 'react-redux';
import { fetchPools, fetchPrice, fetchSwaps } from '../actions';

class Pools extends React.Component {
	async componentDidMount() {
		await this.props.fetchPools();
		const addresses = [];
		for (let pool of this.props.pools) {
			await this.props.fetchSwaps(pool.id);
			for (let token of pool.tokens) {
				addresses.push(token.address);
			}
		}
		await this.props.fetchPrice(addresses.join(','));
	}

	renderAssets(pool) {
		if (this.props.pools) {
			const assets = [];
			for (let token of pool.tokens) {
				const weight = token.denormWeight / pool.totalWeight;
				const percentage = (weight * 100).toFixed(2) + '%';
				assets.push(percentage + ' ' + token.symbol);
			}
			return <td data-label="Assets">{assets.join(' ')}</td>;
		} else return <td data-label="Assets">Loading...</td>;
	}

	renderTotalLiquidity(pool) {
		if (this.props.pools && this.props.prices) {
			let total = 0;
			for (let token of pool.tokens) {
				const address = token.address;
				const price = this.props.prices[address].usd;
				const balance = parseFloat(token.balance);
				total += price * balance;
			}
			return <td data-label="Total Liquidity">${Number(total.toFixed(2)).toLocaleString()}</td>;
		} else return <td data-label="Total Liquidity">Loading...</td>;
	}

	renderVolume(pool, index) {
		if (this.props.pools && this.props.prices && this.props.swaps) {
			let total = 0;
			const swaps = this.props.swaps[index].swaps;
			for (let swap of swaps) {
				if (swap.timestamp > (Date.now() / 1000).toFixed(0) - 86400) {
					const price = this.props.prices[swap.tokenIn].usd;
					const amount = parseFloat(swap.tokenAmountIn);
					total += price * amount;
				}
			}

			return <td data-label="24h Trading Volume">${Number(total.toFixed(2)).toLocaleString()}</td>;
		} else return <td data-label="24h Trading Volume">Loading...</td>;
	}

	renderFees(pool, index) {
		if (this.props.pools && this.props.prices && this.props.swaps) {
			let total = 0;
			const swaps = this.props.swaps[index].swaps;
			const swapFee = this.props.pools[index].swapFee;
			console.log(swapFee);
			for (let swap of swaps) {
				if (swap.timestamp > (Date.now() / 1000).toFixed(0) - 86400) {
					const price = this.props.prices[swap.tokenIn].usd;
					const amount = parseFloat(swap.tokenAmountIn);
					total += price * amount * swapFee;
				}
			}

			return <td data-label="24h Fees">${Number(total.toFixed(2)).toLocaleString()}</td>;
		} else return <td data-label="24h Fees">Loading...</td>;
	}

	renderTable() {
		if (this.props.pools)
			return this.props.pools.map((pool, index) => {
				return (
					<tr key={pool.id}>
						<td data-label="Pool Address">{pool.id}</td>
						{this.renderAssets(pool)}
						<td data-label="Swap Fee">{pool.swapFee * 100}%</td>
						{this.renderTotalLiquidity(pool)}
						{this.renderVolume(pool, index)}
						{this.renderFees(pool, index)}
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
		pools: state.balancer.pools,
		prices: state.coingecko.prices,
		swaps: state.balancer.swaps
	};
};
export default connect(mapStateToProps, { fetchPools, fetchPrice, fetchSwaps })(Pools);

import React from 'react';
import { connect } from 'react-redux';
import { fetchPools, fetchPrice, fetchSwaps } from '../actions';

class PoolsTable extends React.Component {
	async componentDidMount() {
		await this.props.fetchPools();
		const addresses = [];
		for (let pool of this.props.pools) {
			await this.props.fetchSwaps();
			for (let token of pool.tokens) {
				if (addresses.indexOf(token.address) === -1) addresses.push(token.address);
			}
		}
		await this.props.fetchPrice(addresses.join(','));
	}

	renderAssets(pool) {
		const assets = [];
		for (let token of pool.tokens) {
			const weight = token.denormWeight / pool.totalWeight;
			const percentage = (weight * 100).toFixed(2) + '%';
			assets.push(percentage + ' ' + token.symbol);
		}
		return <td data-label="Assets">{assets.join(' ')}</td>;
	}

	renderTotalLiquidity(pool) {
		let total = 0;
		for (let token of pool.tokens) {
			const address = token.address;
			const price = this.props.prices[address].usd;
			const balance = parseFloat(token.balance);
			total += price * balance;
		}
		return <td data-label="Total Liquidity">${Number(total.toFixed(2)).toLocaleString()}</td>;
	}

	renderVolume(pool, index) {
		const totalSwapVolume = pool.totalSwapVolume;
		if (this.props.swaps[index].swaps[0] === undefined) return <td data-label="24h Trading Volume">$0</td>;
		const swap = this.props.swaps[index].swaps[0].poolTotalSwapVolume;
		const volume = totalSwapVolume - swap;
		return <td data-label="24h Trading Volume">${Number(volume.toFixed(2)).toLocaleString()}</td>; //
	}

	renderFees(pool, index) {
		const totalSwapVolume = pool.totalSwapVolume;
		if (this.props.swaps[index].swaps[0] === undefined) return <td data-label="24h Fees">$0</td>;
		const swap = this.props.swaps[index].swaps[0].poolTotalSwapVolume;
		const volume = totalSwapVolume - swap;
		const fees = volume * pool.swapFee;
		return <td data-label="24h Fees">${Number(fees.toFixed(2)).toLocaleString()}</td>; //
	}

	checkLiquidity(pool) {
		let total = 0;
		for (let token of pool.tokens) {
			const address = token.address;
			const price = this.props.prices[address].usd;
			const balance = parseFloat(token.balance);
			total += price * balance;
		}
		return Number(total.toFixed(2)).toLocaleString();
	}

	render() {
		if (this.props.pools && this.props.prices && this.props.swaps)
			return this.props.pools.map((pool, index) => {
				const check = parseInt(this.checkLiquidity(pool));
				if (check !== 0) {
					return (
						<tr key={pool.id}>
							<td data-label="Pool Address">{pool.id}</td>
							{this.renderAssets(pool)}
							<td data-label="Swap Fee">{(pool.swapFee * 100).toFixed(2)}%</td>
							{this.renderTotalLiquidity(pool)}
							{this.renderVolume(pool, index)}
							{this.renderFees(pool, index)}
						</tr>
					);
				}
			});
		else return null;
	}
}

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko.prices,
		swaps: state.balancer.swaps
	};
};

export default connect(mapStateToProps, { fetchPools, fetchPrice, fetchSwaps })(PoolsTable);

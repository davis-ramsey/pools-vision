import React from 'react';
import { connect } from 'react-redux';
import {
	fetchPools,
	fetchPrice,
	selectPool,
	deletePool,
	sumLiquidity,
	clearLiquidity,
	deletePrices,
	sumAllLiq,
	deleteAllLiq,
	sumAllVol,
	deleteAllVol
} from '../actions';
import { feeFactor, ratioFactor } from './helpers/factorCalcs';
import { renderTotalLiquidity } from './helpers/balancerHelpers';

class Data extends React.Component {
	constructor(props) {
		super(props);
		this.timer = null;
		this.sumTotalAdjLiq = 0;
		this.sumTotalLiq = 0;
		this.sumVolume = 0;
		this.refreshTimer = 300000;
	}
	componentDidMount() {
		this.gatherData();
	}

	async gatherData() {
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
		for (let pool of this.props.pools) {
			this.adjLiquidity(pool);
			this.getTotalVolume(pool);
		}
		this.props.sumAllLiq(this.sumTotalLiq);
		this.props.sumAllVol(this.sumVolume);
		this.props.sumLiquidity(this.sumTotalAdjLiq);
		this.timer = setInterval(() => {
			this.refreshData();
		}, this.refreshTimer);
	}

	async refreshData() {
		clearInterval(this.timer);
		this.sumTotalAdjLiq = 0;
		this.sumTotalLiq = 0;
		this.sumVolume = 0;
		this.props.clearLiquidity();
		this.props.deleteAllLiq();
		this.props.deleteAllVol();
		this.props.deletePrices();
		this.gatherData();
	}

	adjLiquidity = (pool) => {
		const totalFactor = this.totalFactor(pool);
		const liquidity = parseFloat(renderTotalLiquidity(pool, this.props.prices).split(',').join(''));
		if (!isNaN(liquidity)) this.sumTotalLiq += liquidity;
		if (isNaN(liquidity * totalFactor)) return;
		this.sumTotalAdjLiq += liquidity * totalFactor;
	};

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

	render() {
		return null;
	}
}

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko
	};
};

export default connect(mapStateToProps, {
	fetchPools,
	fetchPrice,
	selectPool,
	deletePool,
	sumLiquidity,
	clearLiquidity,
	deletePrices,
	sumAllLiq,
	deleteAllLiq,
	sumAllVol,
	deleteAllVol
})(Data);

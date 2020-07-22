import React from 'react';
import { connect } from 'react-redux';
import {
	fetchPools,
	fetchPrice,
	sumLiquidity,
	clearLiquidity,
	deletePrices,
	sumAllLiq,
	deleteAllLiq,
	sumAllVol,
	deleteAllVol,
	deletePools,
	fetchPool,
	addShares,
	deleteShares
} from '../actions';
import { renderTotalLiquidity, totalFactor } from './helpers/balancerHelpers';

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
			if (pool.shares.length > 990) {
				await this.props.addShares(pool, 1);
			}
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
		const checked = [];
		for (let i = 2; i < 999; i++) {
			let exit = true;
			for (let j = 0; j < this.props.moreShares.length; j++) {
				const pool = this.props.moreShares[j];
				if (pool.shares.length > 990 && checked.indexOf(j) === -1) {
					this.props.addShares(pool, i);
					checked.push(j);
					exit = false;
				}
			}
			if (exit) break;
		}
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
		this.props.deleteShares();
		if (this.props.portfolioPools && this.props.poolsList) {
			this.props.deletePools();
			for (let pool of this.props.poolsList) await this.props.fetchPool(pool);
		}

		this.gatherData();
	}
	adjLiquidity = (pool) => {
		const totalFac = totalFactor(pool);
		const liquidity = parseFloat(renderTotalLiquidity(pool, this.props.prices).split(',').join(''));
		if (!isNaN(liquidity)) this.sumTotalLiq += liquidity;
		if (isNaN(liquidity * totalFac)) return;
		this.sumTotalAdjLiq += liquidity * totalFac;
	};

	getTotalVolume(pool) {
		const totalSwapVolume = pool.totalSwapVolume;
		if (pool.swaps[0] === undefined) return;
		const swap = pool.swaps[0].poolTotalSwapVolume;
		const volume = totalSwapVolume - swap;
		this.sumVolume += volume;
	}

	render() {
		return null;
	}
}

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko,
		portfolioPools: state.poolReducer,
		poolsList: state.portfolio,
		moreShares: state.moreShares
	};
};

export default connect(mapStateToProps, {
	fetchPools,
	fetchPrice,
	sumLiquidity,
	clearLiquidity,
	deletePrices,
	sumAllLiq,
	deleteAllLiq,
	sumAllVol,
	deleteAllVol,
	deletePools,
	fetchPool,
	addShares,
	deleteShares
})(Data);

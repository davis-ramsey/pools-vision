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
	deleteShares,
	removePools,
	addCaps,
	removeCaps,
	sumFinal,
	deleteFinal,
	sumFees,
	removeFees,
	addBalMultiplier,
	errorMessage
} from '../actions';
import {
	renderTotalLiquidity,
	totalFactor,
	renderCapFactor,
	splitLiquidityProviders,
	stakerOwnership,
	renderRealAdj
} from './helpers/balancerHelpers';

class Data extends React.Component {
	constructor(props) {
		super(props);
		this.timer = null;
		this.sumTotalAdjLiq = 0;
		this.sumTotalLiq = 0;
		this.sumVolume = 0;
		this.sumFees = 0;
		this.sumFinalLiq = 0;
		this.refreshTimer = 300000;
		this.tokenAdjBalance = [];
		this.addresses = [];
		this.tokenNames = [];
	}
	componentDidMount() {
		this.gatherData();
	}

	async gatherData() {
		try {
			this.props.errorMessage(
				'Gathering data from the balancer subgraph! This may take a few seconds. Data will automatically refresh in the background every 5 minutes.'
			);
			await this.props.fetchPools(0);
			for (let i = 1; i < 100; i++) {
				if (this.props.pools.length > 999 * i) await this.props.fetchPools(i);
			}
			const tokenTotalBalance = [];
			for (const pool of this.props.pools) {
				if (pool.shares.length > 990) {
					await this.props.addShares(pool, 1);
				}
				for (const token of pool.tokens) {
					if (this.addresses.indexOf(token.address) === -1) this.addresses.push(token.address);
					const index = this.addresses.indexOf(token.address);
					if (!tokenTotalBalance[index]) tokenTotalBalance[index] = 0;
					tokenTotalBalance[index] += parseFloat(token.balance);
					this.tokenNames[index] = token.symbol;
				}
			}
			const a1 = this.addresses.slice(0, this.addresses.length / 4);
			const a2 = this.addresses.slice(this.addresses.length / 4, this.addresses.length / 2);
			const a3 = this.addresses.slice(this.addresses.length / 2, 3 * this.addresses.length / 4);
			const a4 = this.addresses.slice(3 * this.addresses.length / 4, this.addresses.length);
			await this.props.fetchPrice(a1.join(','));
			await this.props.fetchPrice(a2.join(','));
			await this.props.fetchPrice(a3.join(','));
			await this.props.fetchPrice(a4.join(','));
			tokenTotalBalance.forEach((item, index) => {
				const price = this.addresses[index];
				if (!this.props.prices[price]) return;
				tokenTotalBalance[index] = item * this.props.prices[price].usd;
			});
			for (const pool of this.props.pools) {
				this.adjLiquidity(pool);
				this.getTotalVolume(pool);
			}
			const addrs = this.addresses;
			const tokenAdj = this.tokenAdjBalance;
			const names = this.tokenNames;
			const caps = [];
			tokenTotalBalance.forEach((item, index) =>
				caps.push({ addr: addrs[index], name: names[index], total: item, adj: tokenAdj[index] })
			);
			this.props.addCaps(caps);
			this.props.sumAllLiq(this.sumTotalLiq);
			this.props.sumAllVol(this.sumVolume);
			this.props.sumLiquidity(this.sumTotalAdjLiq);
			this.props.sumFees(this.sumFees);
			for (let cap of caps) if (cap.adj) this.sumFinalLiq += renderCapFactor(cap.addr, cap.adj) * cap.adj;
			this.props.sumFinal(this.sumFinalLiq);
			const stakerShare = this.sumFinalLiq / (1 - 45000 / 145000); //target liquidity
                      const tempBoost = 3;
                      const tempLiquidity = this.newTotalLiquidity(tempBoost);
			const stakingBoost =
				1 +
				(tempBoost - 1) * (stakerShare - this.sumFinalLiq) / (tempLiquidity[0] + tempLiquidity[1] - this.sumFinalLiq);
			const finalLiquidity = this.newTotalLiquidity(stakingBoost);
			this.props.deleteFinal();
			this.props.sumFinal(finalLiquidity[0] + finalLiquidity[1]);
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
			this.props.addBalMultiplier(stakingBoost);
		} catch (error) {
			console.log(error);
			this.props.errorMessage(
				'An error occurred while trying to gather data. Another attempt will be made in 10 seconds. If this error persists, the subgraph or coingecko are likely experiencing downtime.'
			);
			setTimeout(() => this.refreshData(), 10000);
		}
	}

	newTotalLiquidity(balMultiplier) {
		let userLiquidity = 0;
		let shareHolderLiquidity = 0;
		for (const pool of this.props.pools) {
			let lpOwnership = null;
			const subpoolLiquidityProviders = splitLiquidityProviders(pool);
			if (subpoolLiquidityProviders.length !== 1) {
				lpOwnership = stakerOwnership(pool, subpoolLiquidityProviders[0]);
				userLiquidity += renderRealAdj(pool, this.props.prices, this.props.caps, lpOwnership, balMultiplier);
				shareHolderLiquidity += renderRealAdj(pool, this.props.prices, this.props.caps, 1 - lpOwnership, 1);
			} else userLiquidity += renderRealAdj(pool, this.props.prices, this.props.caps, 1, balMultiplier);
		}
		return [ userLiquidity, shareHolderLiquidity ];
	}

	async refreshData() {
		clearInterval(this.timer);
		this.sumTotalAdjLiq = 0;
		this.sumTotalLiq = 0;
		this.sumVolume = 0;
		this.sumFinalLiq = 0;
		this.sumFees = 0;
		this.tokenAdjBalance = [];
		this.addresses = [];
		this.tokenNames = [];
		this.props.removePools();
		this.props.clearLiquidity();
		this.props.deleteAllLiq();
		this.props.deleteAllVol();
		this.props.deletePrices();
		this.props.deleteShares();
		this.props.deleteFinal();
		this.props.removeCaps();
		this.props.removeFees();
		if (this.props.portfolioPools && this.props.poolsList) {
			this.props.deletePools();
			for (let pool of this.props.poolsList) await this.props.fetchPool(pool);
		}

		this.gatherData();
	}
	adjLiquidity = (pool, balMultiplier = 1) => {
		const totalFac = totalFactor(pool, balMultiplier);
		const liquidity = parseFloat(renderTotalLiquidity(pool, this.props.prices));
		if (!isNaN(liquidity)) this.sumTotalLiq += liquidity;
		if (isNaN(liquidity * totalFac)) return;
		const adjLiq = liquidity * totalFac;
		for (const token of pool.tokens) {
			const index = this.addresses.indexOf(token.address);
			if (!this.tokenAdjBalance[index]) this.tokenAdjBalance[index] = 0;
			if (this.props.prices[token.address])
				this.tokenAdjBalance[index] +=
					parseFloat(token.balance) * this.props.prices[token.address].usd * totalFac;
		}
		this.sumTotalAdjLiq += adjLiq;
	};

	getTotalVolume(pool) {
		const totalSwapVolume = pool.totalSwapVolume;
		if (pool.swaps[0] === undefined) return;
		const swap = pool.swaps[0].poolTotalSwapVolume;
		const volume = totalSwapVolume - swap;
		this.sumVolume += volume;
		this.sumFees += volume * pool.swapFee;
	}

	disableRefresh = () => {
		clearInterval(this.timer);
		console.log('auto refresh disabled!');
	};

	enableRefresh = () => {
		if (this.sumTotalAdjLiq !== 0) this.refreshData();
		console.log('auto refresh enabled!');
	};
	shouldComponentUpdate(nextProps) {
		if (this.props.form && nextProps.form && nextProps.form.values) {
			if (this.props.form.values && this.props.form.values.refresh !== nextProps.form.values.refresh) return true;
			else if (!this.props.form.values && nextProps.form.values && nextProps.form.values.refresh) return true;
			else return false;
		} else return false;
	}
	render() {
		if (this.props.form && this.props.form.values && this.props.form.values.refresh) this.disableRefresh();
		else if (this.props.form && this.props.form.values && !this.props.form.values.refresh) this.enableRefresh();
		return null;
	}
}

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko,
		portfolioPools: state.poolReducer,
		poolsList: state.portfolio,
		moreShares: state.moreShares,
		caps: state.caps,
		form: state.form.UserInput
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
	deleteShares,
	removePools,
	addCaps,
	removeCaps,
	sumFinal,
	deleteFinal,
	sumFees,
	removeFees,
	addBalMultiplier,
	errorMessage
})(Data);

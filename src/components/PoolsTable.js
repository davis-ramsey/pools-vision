import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { connect } from 'react-redux';
import { selectPool, deletePool } from '../actions';
import {
	renderAssets,
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	checkLiquidity,
	renderAdjLiquidity,
	renderTotalYield,
	renderAssetsText,
	renderOwnership,
	renderNumLP,
	renderLifetimeFees,
	numberWithCommas,
	newTotalLiquidity
} from './helpers/balancerHelpers';

import history from '../history';

class PoolsTable extends React.Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.pools !== nextProps.pools || this.props.caps !== nextProps.caps) return true;
		else if (this.props.ownProps.userAddr !== nextProps.ownProps.userAddr) return true;
		else if (this.props.portfolio !== nextProps.portfolio) return true;
		else if (this.props.form && this.props.form.values && this.props.form.values !== nextProps.form.values)
			return true;
		else if (this.props.balMultiplier !== nextProps.balMultiplier) return true;
		else return false;
	}

	addressChecker = (pool) => {
		const nav = this.props.ownProps.userAddr.location.pathname;
		if (!nav.includes('/user/')) return 1;
		let userBalance = 0;
		const userInput = nav.slice(6).toLowerCase().split(',');
		for (let share of pool.shares) {
			const shareBalance = parseFloat(share.balance);
			for (let input of userInput)
				if (share.userAddress.id === input && shareBalance !== 0)
					userBalance += shareBalance / parseFloat(pool.totalShares).toFixed(4);
		}
		for (let anotherPool of this.props.moreShares)
			if (pool.id === anotherPool.id)
				for (let share of anotherPool.shares) {
					const shareBalance = parseFloat(share.balance);
					for (let input of userInput)
						if (share.userAddress.id === input && shareBalance !== 0)
							userBalance += shareBalance / parseFloat(pool.totalShares).toFixed(4);
				}
		return userBalance;
	};

	tokenChecker = (pool) => {
		if (!this.props.form || !this.props.form.values || !this.props.form.values.token) return true;
		const userInput = this.props.form.values.token.toUpperCase().split(' ');
		const matches = [];
		for (let token of pool.tokens)
			for (let input of userInput) if (input === token.symbol.toUpperCase()) matches.push(token.symbol);
		if (matches.length === userInput.length) return true;
		return false;
	};

	apyChecker = (pool) => {
		if (!this.props.form || !this.props.form.values || !this.props.form.values.apy) return true;
		const userInput = this.props.form.values.apy;
		if (userInput >= parseFloat(renderTotalYield(pool, this.props.prices, this.props.sumLiq, this.props.caps)))
			return false;
		else return true;
	};

	totalLiqChecker = (pool) => {
		if (!this.props.form || !this.props.form.values || !this.props.form.values.totalLiq) return true;
		const userInput = parseInt(this.props.form.values.totalLiq);
		if (userInput >= parseFloat(renderTotalLiquidity(pool, this.props.prices))) return false;
		else return true;
	};

	renderAPY = (pool) => {
		if (!this.props.form || !this.props.form.values || !this.props.form.values.display) return pool.totalAPY;
		const userInput = this.props.form.values.display;
		return pool[userInput];
	};

	renderToggle(pool, ownership) {
		const nav = this.props.ownProps.userAddr.location.pathname;
		if (parseFloat(renderLifetimeFees(pool)) > 100000000)
			return (
				<td className="center aligned" data-label="Lifetime Fees">
					$0
				</td>
			);
		if (!nav.includes('/user/'))
			return (
				<td className="center aligned" data-label="Lifetime Fees">
					${numberWithCommas(renderLifetimeFees(pool))}
				</td>
			);
		return (
			<td className="center aligned" data-label="User %">
				{renderOwnership(ownership)}%
			</td>
		);
	}

	sortPools() {
		const sorted = this.props.pools.map((pool) => {
			const ownership = this.addressChecker(pool);
			if (ownership === 0 || !this.tokenChecker(pool) || !this.apyChecker(pool) || !this.totalLiqChecker(pool))
				return null;
			const check = parseFloat(checkLiquidity(pool, this.props.prices));
			if (check === 0) return null;
			const liquidity = newTotalLiquidity(pool, this.props.prices, this.props.caps, this.props.balMultiplier);
			const id = pool.id;
			const chartAssets = renderAssets(pool);
			const assetText = renderAssetsText(pool);
			const swapFee = (pool.swapFee * 100).toFixed(2);
			const totalLiq = renderTotalLiquidity(pool, this.props.prices, ownership);
			const finalAdj = (liquidity[0] + liquidity[1]).toFixed(2);
			const volume = renderVolume(pool, ownership);
			const fees = renderFees(pool, ownership);
			const annualBAL = (renderAdjLiquidity(
				pool,
				this.props.prices,
				this.props.sumLiq,
				this.props.caps,
				1,
				this.props.balMultiplier
			) * ownership).toFixed(0);
			let apy = renderTotalYield(
				pool,
				this.props.prices,
				this.props.sumLiq,
				this.props.caps,
				this.props.balMultiplier
			);
			if (isNaN(apy[0]) || isNaN(apy[1]) || isNaN(apy[2])) {
				apy[0] = 0;
				apy[1] = 0;
				apy[2] = 0;
			}
			const balAPY = apy[0];
			const feeAPY = apy[1];
			const totalAPY = apy[2];
			const toggleUserHoldings = this.renderToggle(pool, ownership);
			const numLP = renderNumLP(pool, this.props.moreShares);
			return {
				id,
				chartAssets,
				assetText,
				swapFee,
				totalLiq,
				finalAdj,
				volume,
				fees,
				annualBAL,
				balAPY,
				feeAPY,
				totalAPY,
				toggleUserHoldings,
				numLP
			};
		});
		if (this.props.form && this.props.form.values && this.props.form.values.sortby) {
			const sortMe = this.props.form.values.sortby;
			sorted.sort((a, b) => {
				if (a === null) return 1;
				else if (b === null) return -1;
				else return b[sortMe] - a[sortMe];
			});
		}

		return sorted;
	}

	portfolioToggle(pool) {
		if (this.props.portfolio.indexOf(pool.id) === -1) return '';
		else return `active`;
	}
	portfolioButton(pool) {
		if (this.props.portfolio.indexOf(pool.id) === -1)
			return (
				<button
					onClick={() => this.props.selectPool(pool.id)}
					className="ui small inverted floating compact centered button"
				>
					Add
				</button>
			);
		else
			return (
				<button
					onClick={() => this.props.deletePool(pool.id)}
					className="ui small floating compact centered button"
				>
					Remove
				</button>
			);
	}

	render() {
		if (this.props.pools && this.props.prices && this.props.portfolio && this.props.caps[5])
			return this.sortPools().map((pool) => {
				if (pool === null) return <tr key={Math.random()} />;
				const isActive = this.portfolioToggle(pool);
				const button = this.portfolioButton(pool);
				return (
					<tr key={pool.id} className={isActive}>
						<td className="center aligned" data-label="Pool Address">
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={`https://pools.balancer.exchange/#/pool/${pool.id}`}
							>
								<button className="ui small inverted floating compact centered button">
									...{pool.id.slice(-8)}
								</button>{' '}
							</a>
							{button}
						</td>
						<td
							className="mini center aligned selectable"
							data-label="Assets"
							onClick={() => history.push(`/pool/${pool.id}`)}
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontFamily: 'Roboto Condensed, sans-serif',
								letterSpacing: 1.3,
								fontSize: '12px'
							}}
						>
							<div className="ui">
								<PieChart
									className="ui tiny circular image"
									data={pool.chartAssets}
									onClick={() => history.push(`/pool/${pool.id}`)}
									style={{ padding: '5%' }}
								/>
							</div>
							<div className="ui">&nbsp;&nbsp;{pool.assetText}</div>
						</td>
						<td className="center aligned" data-label="Swap Fee">
							{pool.swapFee}%
						</td>
						<td className="center aligned" data-label="Total Liquidity">
							<div className="ui">${numberWithCommas(pool.totalLiq)}</div>
							<div className="ui" style={{ fontSize: '12px' }}>
								Adj: ${numberWithCommas(pool.finalAdj)}
							</div>
						</td>
						<td className="center aligned" data-label="24h Volume">
							${numberWithCommas(pool.volume)}
						</td>
						<td className="center aligned" data-label="24h Fees">
							${numberWithCommas(pool.fees)}
						</td>
						<td className="center aligned" data-label="Annual BAL">
							{numberWithCommas(pool.annualBAL)}
						</td>
						<td className="center aligned" data-label="APY">
							{this.renderAPY(pool)}%
						</td>
						{pool.toggleUserHoldings}
						<td className="center aligned" data-label="# of LP's">
							{pool.numLP}
						</td>
					</tr>
				);
			});
		else
			return (
				<tr key={Math.random()}>
					<td />
					<td>
						<div class="ui active dimmer">
							<div class="ui text loader">
								Gathering data from the balancer subgraph! This may take a few seconds. Data will
								automatically refresh every 5 minutes.
							</div>
						</div>
					</td>
				</tr>
			);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko,
		portfolio: state.portfolio,
		sumLiq: state.sumFinal,
		form: state.form.UserInput,
		moreShares: state.moreShares,
		ownProps,
		caps: state.caps,
		balMultiplier: state.balMultiplier
	};
};

export default connect(mapStateToProps, { selectPool, deletePool })(PoolsTable);

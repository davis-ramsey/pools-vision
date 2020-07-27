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
	renderRealAdj,
	numberWithCommas
} from './helpers/balancerHelpers';

import history from '../history';

class PoolsTable extends React.PureComponent {
	addressChecker = (pool) => {
		const nav = this.props.ownProps.userAddr.location.pathname;
		if (!nav.includes('/user/')) return;
		let userBalance = 0;
		const userInput = nav.slice(6).toLowerCase().split(',');
		for (let share of pool.shares) {
			const shareBalance = parseFloat(share.balance);
			for (let input of userInput)
				if (share.userAddress.id === input && shareBalance !== 0)
					userBalance += shareBalance / parseFloat(pool.totalShares).toFixed(4);
			for (let anotherPool of this.props.moreShares)
				if (pool.id === anotherPool.id)
					for (let share of anotherPool.shares) {
						const shareBalance = parseFloat(share.balance);
						for (let input of userInput)
							if (share.userAddress.id === input && shareBalance !== 0)
								userBalance += shareBalance / parseFloat(pool.totalShares).toFixed(4);
					}
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

	render() {
		if (
			this.props.pools &&
			this.props.prices &&
			this.props.portfolio &&
			this.props.sumLiq > 150683236 &&
			this.props.caps[5]
		)
			return this.props.pools.map((pool) => {
				const ownership = this.addressChecker(pool);
				if (ownership === 0 || !this.tokenChecker(pool) || !this.apyChecker(pool)) return null;
				const check = parseFloat(checkLiquidity(pool, this.props.prices));
				if (check !== 0) {
					if (this.props.portfolio.indexOf(pool.id) === -1)
						return (
							<tr key={pool.id}>
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

									<button
										onClick={() => this.props.selectPool(pool.id)}
										className="ui small inverted floating compact centered button"
									>
										Add
									</button>
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
											data={renderAssets(pool)}
											onClick={() => history.push(`/pool/${pool.id}`)}
										/>
									</div>
									<div className="ui">&nbsp;&nbsp;{renderAssetsText(pool)}</div>
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="Total Liquidity">
									<div className="ui">
										${numberWithCommas(renderTotalLiquidity(pool, this.props.prices, ownership))}
									</div>
									<div className="ui" style={{ fontSize: '12px' }}>
										Adj: ${numberWithCommas(
											renderRealAdj(pool, this.props.prices, this.props.caps, ownership)
										)}
									</div>
								</td>
								<td className="center aligned" data-label="24h Volume">
									${numberWithCommas(renderVolume(pool, ownership))}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${numberWithCommas(renderFees(pool, ownership))}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{numberWithCommas(
										renderAdjLiquidity(
											pool,
											this.props.prices,
											this.props.sumLiq,
											this.props.caps,
											ownership
										).toFixed(0)
									)}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq, this.props.caps)}%
								</td>
								{this.renderToggle(pool, ownership)}
								<td className="center aligned" data-label="# of LP's">
									{renderNumLP(pool, this.props.moreShares)}
								</td>
							</tr>
						);
					else
						return (
							<tr className="active" key={pool.id}>
								<td className="center aligned" data-label="Pool Address">
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={`https://pools.balancer.exchange/#/pool/${pool.id}`}
									>
										<button className="ui small floating compact centered button">
											...{pool.id.slice(-8)}
										</button>{' '}
									</a>

									<button
										onClick={() => this.props.deletePool(pool.id)}
										className="ui small floating compact centered button"
									>
										Remove
									</button>
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
											data={renderAssets(pool)}
											onClick={() => history.push(`/pool/${pool.id}`)}
										/>
									</div>
									<div className="ui">&nbsp;&nbsp;{renderAssetsText(pool)}</div>
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="Total Liquidity">
									<div className="ui">
										${numberWithCommas(renderTotalLiquidity(pool, this.props.prices, ownership))}
									</div>
									<div className="ui" style={{ fontSize: '12px' }}>
										Adj: ${numberWithCommas(
											renderRealAdj(pool, this.props.prices, this.props.caps, ownership)
										)}
									</div>
								</td>
								<td className="center aligned" data-label="24h Volume">
									${numberWithCommas(renderVolume(pool, ownership))}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${numberWithCommas(renderFees(pool, ownership))}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{numberWithCommas(
										renderAdjLiquidity(
											pool,
											this.props.prices,
											this.props.sumLiq,
											this.props.caps,
											ownership
										).toFixed(0)
									)}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq, this.props.caps)}%
								</td>
								{this.renderToggle(pool, ownership)}
								<td className="center aligned" data-label="# of LP's">
									{renderNumLP(pool, this.props.moreShares)}
								</td>
							</tr>
						);
				}
				return null;
			});
		else
			return (
				<tr>
					<td>Loading</td>
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
		caps: state.caps
	};
};

export default connect(mapStateToProps, { selectPool, deletePool })(PoolsTable);

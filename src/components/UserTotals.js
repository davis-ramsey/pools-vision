import React from 'react';
import { connect } from 'react-redux';

import {
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderAdjLiquidity,
	renderTotalYield,
	numberWithCommas
} from './helpers/balancerHelpers';

class UserTotals extends React.Component {
	constructor(props) {
		super(props);
		this.userSum = {};
	}
	checker = (pool) => {
		const nav = this.props.ownProps.userAddr.location.pathname;
		if (!nav.includes('/user/')) return;
		let userBalance = 0;
		const userInput = nav.slice(6).toLowerCase().split(',');
		for (let share of pool.shares) {
			const shareBalance = parseFloat(share.balance);
			for (let input of userInput)
				if (share.userAddress.id === input && shareBalance !== 0) {
					userBalance += shareBalance / parseFloat(pool.totalShares).toFixed(4);
				}
		}
		for (let anotherPool of this.props.moreShares)
			if (pool.id === anotherPool.id)
				for (let share of anotherPool.shares) {
					const shareBalance = parseFloat(share.balance);
					for (let input of userInput)
						if (share.userAddress.id === input && shareBalance !== 0) {
							userBalance += shareBalance / parseFloat(anotherPool.totalShares).toFixed(4);
						}
				}

		if (userBalance !== 0) {
			this.userSum.Liq.push(parseFloat(renderTotalLiquidity(pool, this.props.prices, userBalance)));
			if (parseFloat(renderVolume(pool, userBalance)) !== 0)
				this.userSum.Vol += parseFloat(renderVolume(pool, userBalance).split(',').join(''));
			if (parseFloat(renderFees(pool, userBalance)) !== 0)
				this.userSum.Fees += parseFloat(renderFees(pool, userBalance).split(',').join(''));
			this.userSum.Bal +=
				renderAdjLiquidity(pool, this.props.prices, this.props.sumLiq, this.props.caps) * userBalance;
			this.userSum.AvgAPY.push(renderTotalYield(pool, this.props.prices, this.props.sumLiq, this.props.caps));
		}

		return userBalance;
	};

	renderLiq() {
		let sum = 0;
		for (let liq of this.userSum.Liq) sum += liq;
		return sum;
	}

	renderAvgApy() {
		let weightedSum = 0;
		let sumLiq = 0;
		const apy = this.userSum.AvgAPY;
		const liq = this.userSum.Liq;
		for (let i = 0; i < apy.length; i++) {
			weightedSum += parseFloat(apy[i]) * liq[i];
			sumLiq += liq[i];
		}
		return weightedSum / sumLiq;
	}
	render() {
		this.userSum = {
			Liq: [],
			Vol: 0,
			Fees: 0,
			Bal: 0,
			AvgAPY: []
		};
		const nav = this.props.ownProps.userAddr.location.pathname;
		if (!nav.includes('/user/')) return null;
		if (
			this.props.pools &&
			this.props.prices &&
			this.props.portfolio &&
			this.props.sumLiq > 138683236 &&
			this.props.caps[5]
		)
			this.props.pools.map((pool) => {
				this.checker(pool);
				return null;
			});
		return (
			<tr key={'alpha'}>
				<td className="center aligned" data-label="Pool Address" />
				<td className="center aligned selectable" data-label="Assets">
					Totals for User Pools <i className="icon long arrow alternate right" />
					<i className="icon long arrow alternate right" />
				</td>
				<td className="center aligned" data-label="Swap Fee" />
				<td className="center aligned" data-label="Total Liquidity">
					${numberWithCommas(this.renderLiq().toFixed(2))}
				</td>
				<td className="center aligned" data-label="24h Volume">
					${numberWithCommas(this.userSum.Vol.toFixed(2))}
				</td>
				<td className="center aligned" data-label="24h Fees">
					${numberWithCommas(this.userSum.Fees.toFixed(2))}
				</td>
				<td className="center aligned" data-label="Annual BAL">
					{numberWithCommas(this.userSum.Bal.toFixed(0))}
				</td>
				<td className="center aligned" data-label="APY">
					{this.renderAvgApy().toFixed(2)}%
				</td>
				<td className="center aligned" data-label="User %" />
				<td className="center aligned" data-label="# of LP's" />
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

export default connect(mapStateToProps)(UserTotals);

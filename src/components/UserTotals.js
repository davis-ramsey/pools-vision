import React from 'react';
import { connect } from 'react-redux';

import {
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderAdjLiquidity,
	renderTotalYield
} from './helpers/balancerHelpers';

class UserTotals extends React.Component {
	constructor(props) {
		super(props);
		this.userSum = {};
	}
	checker = (pool) => {
		if (!this.props.form || !this.props.form.values || !this.props.form.values.address) return;
		const userInput = this.props.form.values.address.toLowerCase();
		for (let share of pool.shares) {
			const shareBalance = parseFloat(share.balance);
			if (share.userAddress.id === userInput && shareBalance !== 0) {
				const ownership = shareBalance / parseFloat(pool.totalShares).toFixed(4);
				this.userSum.Liq.push(
					parseFloat(renderTotalLiquidity(pool, this.props.prices, ownership).split(',').join(''))
				);
				this.userSum.Vol += parseFloat(renderVolume(pool, ownership).split(',').join(''));
				this.userSum.Fees += parseFloat(renderFees(pool, ownership).split(',').join(''));
				this.userSum.Bal += renderAdjLiquidity(pool, this.props.prices, this.props.sumLiq, ownership);
				this.userSum.AvgAPY.push(renderTotalYield(pool, this.props.prices, this.props.sumLiq));

				return ownership;
			}
			for (let anotherPool of this.props.moreShares)
				if (pool.id === anotherPool.id)
					for (let share of anotherPool.shares) {
						const shareBalance = parseFloat(share.balance);
						if (share.userAddress.id === userInput && shareBalance !== 0) {
							const ownership = shareBalance / parseFloat(anotherPool.totalShares).toFixed(4);
							this.userSum.Liq.push(
								parseFloat(
									renderTotalLiquidity(anotherPool, this.props.prices, ownership).split(',').join('')
								)
							);
							this.userSum.Vol += parseFloat(renderVolume(anotherPool, ownership).split(',').join(''));
							this.userSum.Fees += parseFloat(renderFees(anotherPool, ownership).split(',').join(''));
							this.userSum.Bal += renderAdjLiquidity(
								anotherPool,
								this.props.prices,
								this.props.sumLiq,
								ownership
							);
							this.userSum.AvgAPY.push(
								renderTotalYield(anotherPool, this.props.prices, this.props.sumLiq)
							);

							return ownership;
						}
					}
		}

		return 0;
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
	//0x000b79f52356189c80a9d3ada3911d4438218516
	render() {
		this.userSum = {
			Liq: [],
			Vol: 0,
			Fees: 0,
			Bal: 0,
			AvgAPY: []
		};
		if (!this.props.form || !this.props.form.values || !this.props.form.values.address) return null;
		if (this.props.pools && this.props.prices && this.props.portfolio && this.props.sumLiq > 138683236)
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
					${Number(this.renderLiq().toFixed(2)).toLocaleString()}
				</td>
				<td className="center aligned" data-label="24h Volume">
					${Number(this.userSum.Vol.toFixed(2)).toLocaleString()}
				</td>
				<td className="center aligned" data-label="24h Fees">
					${Number(this.userSum.Fees.toFixed(2)).toLocaleString()}
				</td>
				<td className="center aligned" data-label="Annual BAL">
					{Number(this.userSum.Bal.toFixed(0)).toLocaleString()}
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

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko,
		portfolio: state.portfolio,
		sumLiq: state.sumLiq,
		form: state.form.UserInput,
		moreShares: state.moreShares
	};
};

export default connect(mapStateToProps)(UserTotals);

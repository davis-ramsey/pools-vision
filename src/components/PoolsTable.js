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
	renderAssetsText
} from './helpers/balancerHelpers';

import history from '../history';

class PoolsTable extends React.Component {
	checker = (pool) => {
		if (!this.props.form) return 1;
		if (!this.props.form.values) return 1;
		const userInput = this.props.form.values.address.toLowerCase();
		for (let share of pool.shares) {
			const shareBalance = parseFloat(share.balance);
			if (share.userAddress.id === userInput && shareBalance !== 0)
				return shareBalance / parseFloat(pool.totalShares).toFixed(4);
		}
		return 0;
	};

	renderOwnership(ownership) {
		if (ownership === 1) return '-';
		else return (ownership * 100).toFixed(2);
	}

	render() {
		if (this.props.pools && this.props.prices && this.props.portfolio && this.props.sumLiq > 138683236)
			return this.props.pools.map((pool) => {
				const ownership = this.checker(pool);
				if (ownership === 0) return null;
				const check = parseInt(checkLiquidity(pool, this.props.prices));
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
									className="center aligned selectable"
									data-label="Assets"
									onClick={() => history.push(`/pool/${pool.id}`)}
								>
									<PieChart
										className="ui tiny circular image"
										data={renderAssets(pool)}
										onClick={() => history.push(`/pool/${pool.id}`)}
									/>
									<i className="icon long arrow alternate right" />
									{renderAssetsText(pool).join('  ')}
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="Total Liquidity">
									${renderTotalLiquidity(pool, this.props.prices, ownership)}
								</td>
								<td className="center aligned" data-label="24h Volume">
									${renderVolume(pool, ownership)}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${renderFees(pool, ownership)}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{Number(
										renderAdjLiquidity(
											pool,
											this.props.prices,
											this.props.sumLiq,
											ownership
										).toFixed(0)
									).toLocaleString()}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq)}%
								</td>
								<td className="center aligned" data-label="User %">
									{this.renderOwnership(ownership)}%
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
									className="center aligned selectable"
									data-label="Assets"
									onClick={() => history.push(`/pool/${pool.id}`)}
								>
									<PieChart
										className="ui tiny circular image"
										data={renderAssets(pool)}
										onClick={() => history.push(`/pool/${pool.id}`)}
									/>
									<i className="icon long arrow alternate right" />
									{renderAssetsText(pool).join('  ')}
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="Total Liquidity">
									${renderTotalLiquidity(pool, this.props.prices, ownership)}
								</td>
								<td className="center aligned" data-label="24h Volume">
									${renderVolume(pool, ownership)}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${renderFees(pool, ownership)}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{Number(
										renderAdjLiquidity(
											pool,
											this.props.prices,
											this.props.sumLiq,
											ownership
										).toFixed(0)
									).toLocaleString()}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq)}%
								</td>
								<td className="center aligned" data-label="User %">
									{this.renderOwnership(ownership)}%
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

const mapStateToProps = (state) => {
	return {
		pools: state.balancer.pools,
		prices: state.coingecko,
		portfolio: state.portfolio,
		sumLiq: state.sumLiq,
		form: state.form.UserInput
	};
};

export default connect(mapStateToProps, { selectPool, deletePool })(PoolsTable);

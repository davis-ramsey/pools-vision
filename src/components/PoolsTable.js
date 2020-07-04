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
	render() {
		if (this.props.pools && this.props.prices && this.props.portfolio && this.props.sumLiq > 138683236)
			return this.props.pools.map((pool) => {
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
										Add to Portfolio
									</button>
								</td>
								<td
									className="center aligned selectable"
									data-label="Assets"
									onClick={() => history.push(`/pool/${pool.id}`)}
								>
									<PieChart className="ui tiny circular image" data={renderAssets(pool)} />
									<i className="icon long arrow alternate right" />
									{renderAssetsText(pool).join('  ')}
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="Total Liquidity">
									${renderTotalLiquidity(pool, this.props.prices)}
								</td>
								<td className="center aligned" data-label="24h Trading Volume">
									${renderVolume(pool)}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${renderFees(pool)}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{Number(
										renderAdjLiquidity(pool, this.props.prices, this.props.sumLiq).toFixed(0)
									).toLocaleString()}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq)}%
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
										Remove From Portfolio
									</button>
								</td>
								<td className="center aligned" data-label="Assets">
									<PieChart className="ui tiny circular image" data={renderAssets(pool)} />
									<i className="icon long arrow alternate right" />
									{renderAssetsText(pool).join('  ')}
								</td>
								<td className="center aligned" data-label="Swap Fee">
									{(pool.swapFee * 100).toFixed(2)}%
								</td>
								<td className="center aligned" data-label="Total Liquidity">
									${renderTotalLiquidity(pool, this.props.prices)}
								</td>
								<td className="center aligned" data-label="24h Trading Volume">
									${renderVolume(pool)}
								</td>
								<td className="center aligned" data-label="24h Fees">
									${renderFees(pool)}
								</td>
								<td className="center aligned" data-label="Annual BAL">
									{Number(
										renderAdjLiquidity(pool, this.props.prices, this.props.sumLiq).toFixed(0)
									).toLocaleString()}
								</td>
								<td className="center aligned" data-label="APY">
									{renderTotalYield(pool, this.props.prices, this.props.sumLiq)}%
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
		sumLiq: state.sumLiq
	};
};

export default connect(mapStateToProps, { selectPool, deletePool })(PoolsTable);

import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { connect } from 'react-redux';
import history from '../history';
import { fetchPool, selectPool, deletePool, deletePools } from '../actions';
import {
	renderAssets,
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	checkLiquidity,
	renderTotalYield,
	renderAdjLiquidity,
	renderAssetsText,
	renderNumLP,
	renderLifetimeFees,
	numberWithCommas,
	newTotalLiquidity
} from './helpers/balancerHelpers';

class PortfolioView extends React.Component {
	async componentDidMount() {
		const pools = this.props.portfolio.split(',');
		for (let pool of pools) {
			await this.props.fetchPool(pool);
			this.props.selectPool(pool);
		}
	}
	componentWillUnmount() {
		this.props.deletePools();
	}

	renderTable() {
		const pools = this.props.portfolio.split(',');
		return pools.map((pool) => {
			if (this.props.checkPortfolio.indexOf(pool) === -1) return null;
			const selectedPool = this.props.pools[pool];
			if (
				selectedPool &&
				this.props.prices &&
				this.props.portfolio &&
				this.props.sumLiq > 138683236 &&
				this.props.caps[5]
			) {
				const check = parseInt(checkLiquidity(selectedPool, this.props.prices));
				if (check !== 0)
					return (
						<tr key={selectedPool.id}>
							<td className="center aligned" data-label="Pool Address">
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={`https://pools.balancer.exchange/#/pool/${selectedPool.id}`}
								>
									<button className="ui small inverted floating compact centered button">
										...{selectedPool.id.slice(-8)}
									</button>
								</a>
								<button
									onClick={() => this.props.deletePool(selectedPool.id)}
									className="ui small inverted floating compact centered button"
								>
									Remove
								</button>
							</td>

							<td
								className="mini center aligned selectable"
								data-label="Assets"
								onClick={() => history.push(`/pool/${selectedPool.id}`)}
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
										data={renderAssets(selectedPool)}
										onClick={() => history.push(`/pool/${selectedPool.id}`)}
										style={{ padding: '5%' }}
									/>
								</div>
								<div className="ui">&nbsp;&nbsp;{renderAssetsText(selectedPool)}</div>
							</td>
							<td className="center aligned" data-label="Swap Fee">
								{(selectedPool.swapFee * 100).toFixed(2)}%
							</td>
							<td className="center aligned" data-label="Total Liquidity">
								<div className="ui">
									${numberWithCommas(renderTotalLiquidity(selectedPool, this.props.prices))}
								</div>
								<div className="ui" style={{ fontSize: '12px' }}>
									Adj: ${numberWithCommas(
										(newTotalLiquidity(
											selectedPool,
											this.props.prices,
											this.props.caps,
											this.props.balMultiplier
										)[0] +
											newTotalLiquidity(
												selectedPool,
												this.props.prices,
												this.props.caps,
												this.props.balMultiplier
											)[1]).toFixed(2)
									)}
								</div>
							</td>
							<td className="center aligned" data-label="24h Volume">
								${numberWithCommas(renderVolume(selectedPool))}
							</td>
							<td className="center aligned" data-label="24h Fees">
								${numberWithCommas(renderFees(selectedPool))}
							</td>
							<td className="center aligned" data-label="Annual BAL">
								{numberWithCommas(
									renderAdjLiquidity(
										selectedPool,
										this.props.prices,
										this.props.sumLiq,
										this.props.caps,
										1,
										this.props.balMultiplier
									).toFixed(0)
								)}
							</td>
							<td className="center aligned" data-label="Total APY">
								{
									renderTotalYield(
										selectedPool,
										this.props.prices,
										this.props.sumLiq,
										this.props.caps,
										this.props.balMultiplier
									)[2]
								}%
							</td>
							<td className="center aligned" data-label="Lifetime Fees">
								${numberWithCommas(renderLifetimeFees(selectedPool))}
							</td>
							<td className="center aligned" data-label="# of LP's">
								{renderNumLP(selectedPool, this.props.moreShares)}
							</td>
						</tr>
					);
				else
					return (
						<tr key={Math.random()}>
							<td />
							<td>
								<div class="ui active dimmer">
									<div class="ui text loader">
										Gathering data from the balancer subgraph! This may take a few seconds. Data
										will automatically refresh every 5 minutes.
									</div>
								</div>
							</td>
						</tr>
					);
			} else
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
		});
	}

	render() {
		return (
			<div>
				<div className="ui inverted horizontal divider">Your Selected Pools</div>
				<table className="ui selectable inverted striped celled table">
					<thead>
						<tr>
							<th className="center aligned">Pool Address</th>
							<th className="center aligned">Assets</th>
							<th className="center aligned">Swap Fee</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">24h Volume</th>
							<th className="center aligned">24h Fees</th>
							<th className="center aligned">Annual BAL</th>
							<th className="center aligned">Total APY</th>
							<th className="center aligned">Lifetime Fees</th>
							<th className="center aligned"># of LP's</th>
						</tr>
					</thead>
					<tbody>{this.renderTable()}</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		portfolio: ownProps.match.params.portfolio,
		pools: state.poolReducer,
		prices: state.coingecko,
		checkPortfolio: state.portfolio,
		sumLiq: state.sumFinal,
		allPools: state.balancer.pools,
		moreShares: state.moreShares,
		caps: state.caps,
		balMultiplier: state.balMultiplier
	};
};

export default connect(mapStateToProps, {
	fetchPool,
	selectPool,
	deletePool,
	deletePools
})(PortfolioView);

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
	renderAssetsText
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
			if (selectedPool && this.props.prices && this.props.portfolio && this.props.sumLiq > 138683236) {
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
								onClick={() => history.push(`/pool/${selectedPool.id}`)}
								className="center aligned"
								data-label="Assets"
							>
								<PieChart
									className="ui tiny circular image"
									data={renderAssets(selectedPool)}
									onClick={() => history.push(`/pool/${selectedPool.id}`)}
								/>
								<i className="icon long arrow alternate right" />
								{renderAssetsText(selectedPool).join('  ')}
							</td>
							<td className="center aligned" data-label="Swap Fee">
								{(selectedPool.swapFee * 100).toFixed(2)}%
							</td>
							<td className="center aligned" data-label="Total Liquidity">
								${renderTotalLiquidity(selectedPool, this.props.prices)}
							</td>
							<td className="center aligned" data-label="24h Volume">
								${renderVolume(selectedPool)}
							</td>
							<td className="center aligned" data-label="24h Fees">
								${renderFees(selectedPool)}
							</td>
							<td className="center aligned" data-label="Annual BAL">
								{Number(
									renderAdjLiquidity(selectedPool, this.props.prices, this.props.sumLiq).toFixed(0)
								).toLocaleString()}
							</td>
							<td className="center aligned" data-label="APY">
								{renderTotalYield(selectedPool, this.props.prices, this.props.sumLiq)}%
							</td>
						</tr>
					);
				else
					return (
						<tr key={selectedPool.id}>
							<td>Loading!</td>
						</tr>
					);
			} else
				return (
					<tr key={Math.random()}>
						<td>Loading!</td>
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
							<th className="center aligned ten wide">Assets</th>
							<th className="center aligned">Swap Fee</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">24h Volume</th>
							<th className="center aligned">24h Fees</th>
							<th className="center aligned">Annual BAL</th>
							<th className="center aligned">APY</th>
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
		sumLiq: state.sumLiq,
		allPools: state.balancer.pools
	};
};

export default connect(mapStateToProps, {
	fetchPool,
	selectPool,
	deletePool,
	deletePools
})(PortfolioView);

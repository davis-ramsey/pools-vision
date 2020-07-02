import React from 'react';
import { connect } from 'react-redux';
import { fetchPool, fetchPrice, deletePools, selectPool, deletePool } from '../actions';
import {
	renderAssets,
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderYield,
	checkLiquidity
} from './helpers/balancerHelpers';

class PortfolioView extends React.Component {
	async componentDidMount() {
		const pools = this.props.portfolio.split(',');
		for (let pool of pools) {
			await this.props.fetchPool(pool);
			this.props.selectPool(pool);
		}
		const addresses = [];
		for (let pool of pools) {
			if (this.props.pools[pool] !== undefined)
				for (let token of this.props.pools[pool].tokens) {
					if (addresses.indexOf(token.address) === -1) addresses.push(token.address);
				}
		}
		await this.props.fetchPrice(addresses.join(','));
	}
	componentWillUnmount() {
		this.props.deletePools();
	}

	renderTable() {
		const pools = this.props.portfolio.split(',');
		return pools.map((pool) => {
			if (this.props.checkPortfolio.indexOf(pool) === -1) return null;
			const selectedPool = this.props.pools[pool];
			if (selectedPool && this.props.prices && this.props.portfolio) {
				const check = parseInt(checkLiquidity(selectedPool, this.props.prices));
				if (check !== 0)
					return (
						<tr onClick={() => this.props.deletePool(selectedPool.id)} key={selectedPool.id}>
							<td className="center aligned" data-label="Pool Address">
								{selectedPool.id}
							</td>
							<td className="center aligned" data-label="Assets">
								{' '}
								{renderAssets(selectedPool)}
							</td>
							<td className="center aligned" data-label="Swap Fee">
								{(selectedPool.swapFee * 100).toFixed(2)}%
							</td>
							<td className="center aligned" data-label="Total Liquidity">
								${renderTotalLiquidity(selectedPool, this.props.prices)}
							</td>
							<td className="center aligned" data-label="24h Trading Volume">
								{' '}
								${renderVolume(selectedPool)}
							</td>
							<td className="center aligned" data-label="24h Fees">
								${renderFees(selectedPool)}
							</td>
							<td className="center aligned" data-label="24h Yield">
								{' '}
								{renderYield(selectedPool, this.props.prices)}%{' '}
							</td>
						</tr>
					);
				else return null;
			} else return null;
		});
	}

	render() {
		return (
			<div>
				<div className="ui horizontal divider">Show your selected pools here</div>
				<table className="ui inverted striped celled table">
					<thead>
						<tr>
							<th className="center aligned">Pool Address</th>
							<th className="center aligned">Assets</th>
							<th className="center aligned">Swap Fee</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">24h Trading Volume</th>
							<th className="center aligned">24h Fees</th>
							<th className="center aligned">24h Yield</th>
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
		checkPortfolio: state.portfolio
	};
};

export default connect(mapStateToProps, { fetchPool, fetchPrice, selectPool, deletePool, deletePools })(PortfolioView);

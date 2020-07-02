import React from 'react';
import { connect } from 'react-redux';
import { fetchPool, fetchPrice, deletePools } from '../actions';
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
		for (let pool of pools) await this.props.fetchPool(pool);
		const addresses = [];
		for (let pool of pools) {
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
			const selectedPool = this.props.pools[pool];
			if (selectedPool && this.props.prices && this.props.portfolio) {
				const check = parseInt(checkLiquidity(selectedPool, this.props.prices));
				if (check !== 0)
					return (
						<tr key={selectedPool.id}>
							<td data-label="Pool Address">{selectedPool.id}</td>
							{renderAssets(selectedPool)}
							<td data-label="Swap Fee">{(selectedPool.swapFee * 100).toFixed(2)}%</td>
							{renderTotalLiquidity(selectedPool, this.props.prices)}
							{renderVolume(selectedPool)}
							{renderFees(selectedPool)}
							{renderYield(selectedPool, this.props.prices)}
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
				<table className="ui celled table">
					<thead>
						<tr>
							<th>Pool Address</th>
							<th>Assets</th>
							<th>Swap Fee</th>
							<th>Total Liquidity</th>
							<th>24h Trading Volume</th>
							<th>24h Fees</th>
							<th>24h Yield</th>
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
		prices: state.coingecko.prices
	};
};

export default connect(mapStateToProps, { fetchPool, fetchPrice, deletePools })(PortfolioView);

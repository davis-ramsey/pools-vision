import React from 'react';
import { connect } from 'react-redux';
import { fetchPools, fetchPrice, selectPool, deletePool, sumLiquidity, clearLiquidity } from '../actions';
import {
	renderAssets,
	renderTotalLiquidity,
	renderVolume,
	renderFees,
	renderYield,
	checkLiquidity
} from './helpers/balancerHelpers';
import { feeFactor, ratioFactor } from './helpers/factorCalcs';

class PoolsTable extends React.Component {
	async componentDidMount() {
		await this.props.fetchPools();
		const addresses = [];
		for (let pool of this.props.pools) {
			for (let token of pool.tokens) {
				if (addresses.indexOf(token.address) === -1) addresses.push(token.address);
			}
		}
		const a1 = addresses.slice(0, addresses.length / 2);
		const a2 = addresses.slice(addresses.length / 2);
		await this.props.fetchPrice(a1.join(','));
		await this.props.fetchPrice(a2.join(','));
		for (let pool of this.props.pools) this.adjLiquidity(pool);
	}
	componentWillUnmount() {
		this.props.clearLiquidity();
	}
	totalFactor = (pool) => {
		const fee = feeFactor(pool.swapFee);
		const ratio = ratioFactor(pool);
		return fee * ratio;
	};

	adjLiquidity = (pool) => {
		const totalFactor = this.totalFactor(pool);
		const liquidity = renderTotalLiquidity(pool, this.props.prices).split(',').join('');
		this.props.sumLiquidity(liquidity * totalFactor);
	};

	renderAdjLiquidity = (pool) => {
		const totalFactor = this.totalFactor(pool);
		const liquidity = renderTotalLiquidity(pool, this.props.prices).split(',').join('');
		if (isNaN(liquidity / this.props.sumLiq * 14500)) return 0;
		return liquidity * totalFactor / this.props.sumLiq * 145000;
	};

	renderTotalYield = (pool, prices) => {
		const liquidity = renderTotalLiquidity(pool, this.props.prices).split(',').join('');
		if (isNaN(liquidity / this.props.sumLiq * 14500)) return 0;
		const weekBAL = this.renderAdjLiquidity(pool);
		const feeYield = parseFloat(renderYield(pool, prices));
		const priceBAL = this.props.prices['0xba100000625a3754423978a60c9317c58a424e3d'].usd;
		const yieldBAL = parseFloat(weekBAL / 7 * priceBAL / liquidity * 100);
		const totalYield = yieldBAL + feeYield;
		return totalYield.toFixed(4);
	};
	render() {
		if (this.props.pools && this.props.prices && this.props.portfolio && this.props.sumLiq > 138683236)
			return this.props.pools.map((pool) => {
				const check = parseInt(checkLiquidity(pool, this.props.prices));
				if (check !== 0) {
					if (this.props.portfolio.indexOf(pool.id) === -1)
						return (
							<tr onClick={() => this.props.selectPool(pool.id)} key={pool.id}>
								<td className="center aligned" data-label="Pool Address">
									{pool.id}
								</td>
								<td className="center aligned" data-label="Assets">
									{renderAssets(pool)}
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
								<td className="center aligned" data-label="Weekly BAL">
									{this.renderAdjLiquidity(pool).toFixed(0)}
								</td>
								<td className="center aligned" data-label="24h Yield">
									{this.renderTotalYield(pool, this.props.prices)}%
								</td>
							</tr>
						);
					else
						return (
							<tr className="positive" onClick={() => this.props.deletePool(pool.id)} key={pool.id}>
								<td className="center aligned" data-label="Pool Address">
									{pool.id}
								</td>
								<td className="center aligned" data-label="Assets">
									{renderAssets(pool)}
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
								<td className="center aligned" data-label="Weekly BAL">
									{this.renderAdjLiquidity(pool).toFixed(0)}
								</td>
								<td className="center aligned" data-label="24h Yield">
									{this.renderTotalYield(pool, this.props.prices)}%
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

export default connect(mapStateToProps, {
	fetchPools,
	fetchPrice,
	selectPool,
	deletePool,
	sumLiquidity,
	clearLiquidity
})(PoolsTable);

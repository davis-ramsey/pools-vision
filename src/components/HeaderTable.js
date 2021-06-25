import React from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { numberWithCommas } from './helpers/balancerHelpers';

class HeaderTable extends React.Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.balMultiplier !== nextProps.balMultiplier) return true;
		else return false;
	}

	renderHeaderTable() {
		if (this.props.prices['0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3'])
			return (
				<tr key={'first'}>
					<td className="center aligned" data-label="BAL Price">
						${this.props.prices['0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3'].usd.toFixed(2)}
					</td>
					<td className="center aligned" data-label="24h Volume">
						${numberWithCommas(this.props.sumVol.toFixed(0))}
					</td>
					<td className="center aligned" data-label="24h Fees Earned">
						${numberWithCommas(this.props.fees.toFixed(0))}
					</td>
					<td className="center aligned" data-label="Total Liquidity">
						${numberWithCommas(this.props.sumTotalLiq.toFixed(0))}
					</td>
					<td className="center aligned" data-label="Total Adj. Liquidity">
						${numberWithCommas(this.props.sumAdjLiq.toFixed(0))}
					</td>
					<td className="center aligned" data-label="Adj. Liquidity w/Staking">
						${numberWithCommas(this.props.sumFinal.toFixed(0))}
					</td>
					<td className="center aligned" data-label="BAL Multiplier">
						{0}
					</td>
					<td className="center aligned" data-label="Top Tokens & CapFactors">
						<button
							className="ui small inverted floating centered compact primary button"
							onClick={() => history.push('/tokens/')}
						>
							View List
						</button>
					</td>
				</tr>
			);
	}
	render() {
		return (
			<div style={{ width: '100%' }}>
				<table
					className="ui collapsing padded inverted celled table"
					style={{
						margin: 'auto',
						border: '1px solid white',
						boxShadow: '0 0 0.5rem black',
						borderRadius: '10px'
					}}
				>
					<thead>
						<tr>
							<th className="center aligned">BAL Price</th>
							<th className="center aligned">24h Volume</th>
							<th className="center aligned">24h Fees Earned</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">Adj. Liquidity</th>
							<th className="center aligned">Adj. Liquidity w/Staking</th>
							<th className="center aligned">BAL Multiplier</th>
							<th className="center aligned">Top Tokens & CapFactors</th>
						</tr>
					</thead>
					<tbody>{this.renderHeaderTable()}</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		sumAdjLiq: state.sumLiq,
		sumTotalLiq: state.sumTotalLiq,
		sumVol: state.sumVol,
		prices: state.coingecko,
		sumFinal: state.sumFinal,
		fees: state.fees,
		balMultiplier: state.balMultiplier
	};
};

export default connect(mapStateToProps)(HeaderTable);

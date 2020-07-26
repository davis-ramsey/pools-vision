import React from 'react';
import { connect } from 'react-redux';
import history from '../history';
class HeaderTable extends React.Component {
	renderHeaderTable() {
		if (this.props.prices['0xba100000625a3754423978a60c9317c58a424e3d'] && this.props.sumAdjLiq > 140683236)
			return (
				<tr key={'first'}>
					<td className="center aligned" data-label="BAL Price">
						${this.props.prices['0xba100000625a3754423978a60c9317c58a424e3d'].usd.toFixed(2)}
					</td>
					<td className="center aligned" data-label="Total Volume">
						${Number(this.props.sumVol.toFixed(0)).toLocaleString()}
					</td>
					<td className="center aligned" data-label="Total Liquidity">
						${Number(this.props.sumTotalLiq.toFixed(0)).toLocaleString()}
					</td>
					<td className="center aligned" data-label="Total Adj. Liquidity">
						${Number(this.props.sumAdjLiq.toFixed(0)).toLocaleString()}
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
					style={{ margin: 'auto', border: '1px solid white' }}
				>
					<thead>
						<tr>
							<th className="center aligned">BAL Price</th>
							<th className="center aligned">Total Volume</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">Total Adj. Liquidity</th>
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
		prices: state.coingecko
	};
};

export default connect(mapStateToProps)(HeaderTable);

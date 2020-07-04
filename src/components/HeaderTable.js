import React from 'react';
import { connect } from 'react-redux';
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
				</tr>
			);
	}
	render() {
		return (
			<div>
				<br />
				<br />
				<div className="ui grid centered">
					<table className="ui collapsing padded inverted celled table">
						<thead>
							<tr>
								<th className="center aligned">BAL Price</th>
								<th className="center aligned">Total Volume</th>
								<th className="center aligned">Total Liquidity</th>
								<th className="center aligned">Total Adj. Liquidity</th>
							</tr>
						</thead>
						<tbody>{this.renderHeaderTable()}</tbody>
					</table>
					<br />
				</div>
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

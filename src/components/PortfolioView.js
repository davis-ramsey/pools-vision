import React from 'react';
import { connect } from 'react-redux';

class PortfolioView extends React.Component {
	componentDidMount() {
		console.log(this.props);
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
					<tbody>
						<tr>
							<td data-label="Pool Address"> address</td>
							<td data-label="Assets">assets</td>
							<td data-label="Swap Fee">swap fee</td>
							<td data-label="Total Liquidity">liq</td>
							<td data-label="24h Trading Volume">vol</td>
							<td data-label="24h Fees">fees</td>
							<td data-label="24h Yield">yield</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		portfolio: ownProps.match.params.portfolio
	};
};

export default connect(mapStateToProps)(PortfolioView);

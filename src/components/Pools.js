import React from 'react';
import PoolsTable from './PoolsTable';
import UserInput from './UserInput';
import UserTotals from './UserTotals';

class Pools extends React.Component {
	onSubmit = ({ address }) => {};

	render() {
		return (
			<div>
				<UserInput onSubmit={this.onSubmit} />
				<div className="ui inverted horizontal divider">List of All Pools</div>
				<table className="ui selectable padded inverted striped celled table">
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
							<th className="center aligned">User %</th>
							<th className="center aligned"># of LP's</th>
						</tr>
					</thead>
					<tbody>
						<PoolsTable />
						<UserTotals />
					</tbody>
				</table>
			</div>
		);
	}
}

export default Pools;

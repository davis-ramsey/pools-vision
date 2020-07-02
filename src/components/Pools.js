import React from 'react';
import PoolsTable from './PoolsTable';

class Pools extends React.Component {
	render() {
		return (
			<div>
				<div className="ui horizontal divider">List of All Pools</div>
				<table className="ui inverted striped celled table">
					<thead>
						<tr>
							<th className="center aligned">Pool Address</th>
							<th className="center aligned">Assets</th>
							<th className="center aligned">Swap Fee</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">24h Trading Volume</th>
							<th className="center aligned">24h Fees</th>
							<th className="center aligned">Weekly BAL</th>
							<th className="center aligned">24h Yield</th>
						</tr>
					</thead>
					<tbody>
						<PoolsTable />
					</tbody>
				</table>
			</div>
		);
	}
}

export default Pools;

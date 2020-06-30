import React from 'react';
import PoolsTable from './PoolsTable';

class Pools extends React.Component {
	render() {
		return (
			<div>
				<div className="ui horizontal divider header">List of All Pools</div>
				<table className="ui celled table">
					<thead>
						<tr>
							<th>Pool Address</th>
							<th>Assets</th>
							<th>Swap Fee</th>
							<th>Total Liquidity</th>
							<th>24h Trading Volume</th>
							<th>24h Fees</th>
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

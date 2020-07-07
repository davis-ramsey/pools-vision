import React from 'react';
import { connect } from 'react-redux';
import PoolsTable from './PoolsTable';
import UserInput from './UserInput';
import UserTotals from './UserTotals';

class Pools extends React.Component {
	onSubmit = ({ address }) => {};

	renderToggle() {
		if (!this.props.form) return <th className="center aligned">Lifetime Fees</th>;
		if (!this.props.form.values) return <th className="center aligned">Lifetime Fees</th>;
		return <th className="center aligned">User %</th>;
	}

	render() {
		return (
			<div>
				<UserInput onSubmit={this.onSubmit} />
				<div className="ui inverted horizontal divider">List of All Pools</div>
				<table className="ui selectable inverted striped celled table">
					<thead>
						<tr>
							<th className="center aligned">Pool Address</th>
							<th className="center aligned five wide">Assets</th>
							<th className="center aligned">Swap Fee</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">24h Volume</th>
							<th className="center aligned">24h Fees</th>
							<th className="center aligned">Annual BAL</th>
							<th className="center aligned">APY</th>
							{this.renderToggle()}
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

const mapStateToProps = (state) => {
	return {
		form: state.form.UserInput
	};
};

export default connect(mapStateToProps)(Pools);

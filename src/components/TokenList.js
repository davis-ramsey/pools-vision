import React from 'react';
import { connect } from 'react-redux';
import { renderCapFactor, numberWithCommas } from './helpers/balancerHelpers';

class TokenList extends React.Component {
	constructor(props) {
		super(props);
		this.caps = {};
	}

	sortCaps() {
		this.caps = this.props.caps;
		this.caps.sort((a, b) => b.total - a.total);
	}

	renderTable() {
		if (!this.props.caps) return;
		this.sortCaps();
		return this.caps.map((item, index) => {
			if (item.adj)
				return (
					<tr key={index}>
						<td className="center aligned" data-label="Token">
							{item.name}
						</td>
						<td className="center aligned" data-label="Total Liquidity">
							${numberWithCommas(item.total.toFixed(0))}
						</td>
						<td className="center aligned" data-label="Total Adj. Liquidity">
							${numberWithCommas(item.adj.toFixed(0))}
						</td>
						<td className="center aligned" data-label="CapFactor">
							{renderCapFactor(item.addr, item.adj).toFixed(4)}
						</td>
						<td className="center aligned" data-label="Final Liquidity">
							${numberWithCommas((item.adj * renderCapFactor(item.addr, item.adj)).toFixed(0))}
						</td>
					</tr>
				);
			else return null;
		});
	}

	render() {
		return (
			<div>
				<div className="ui inverted horizontal divider">Capped Tokens</div>
				<table className="ui collapsing padded inverted celled table" style={{ margin: 'auto' }}>
					<thead>
						<tr>
							<th className="center aligned">Token</th>
							<th className="center aligned">Total Liquidity</th>
							<th className="center aligned">Total Adj. Liquidity</th>
							<th className="center aligned">CapFactor</th>
							<th className="center aligned">Final Liquidity</th>
						</tr>
					</thead>
					<tbody>{this.renderTable()}</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { caps: state.caps };
};

export default connect(mapStateToProps)(TokenList);

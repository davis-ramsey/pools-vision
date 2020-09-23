import React from 'react';
import { connect } from 'react-redux';
import { renderCapFactor, numberWithCommas } from './helpers/balancerHelpers';

class TokenList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.caps = {};
	}

	sortCaps() {
		this.caps = this.props.caps;
		this.caps.sort((a, b) => {
			return b.adj - a.adj;
		});
	}

	renderTable() {
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
		if (!this.props.caps[5])
			return (
				<tr key={Math.random()}>
					<td />
					<td>
						<div class="ui active dimmer">
							<div class="ui text loader">
								Gathering data from the balancer subgraph! This may take a few seconds. Data will
								automatically refresh every 5 minutes.
							</div>
						</div>
					</td>
				</tr>
			);
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

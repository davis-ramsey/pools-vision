import React from 'react';

class TokenList extends React.Component {
	renderTable() {
		return (
			<tr key={'first'}>
				<td className="center aligned" data-label="Token">
					WETH
				</td>
				<td className="center aligned" data-label="Total Liquidity">
					$50,000,000
				</td>
				<td className="center aligned" data-label="Total Adj. Liquidity">
					$42,000,000
				</td>
				<td className="center aligned" data-label="CapFactor">
					0.7531
				</td>
				<td className="center aligned" data-label="Final Liquidity">
					$25,000,000
				</td>
			</tr>
		);
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
export default TokenList;

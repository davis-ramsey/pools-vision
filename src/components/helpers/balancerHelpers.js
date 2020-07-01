import React from 'react';

export const renderAssets = (pool) => {
	const assets = [];
	for (let token of pool.tokens) {
		const weight = token.denormWeight / pool.totalWeight;
		const percentage = (weight * 100).toFixed(2) + '%';
		assets.push(percentage + ' ' + token.symbol);
	}
	return <td data-label="Assets">{assets.join(' ')}</td>;
};

export const renderTotalLiquidity = (pool, prices) => {
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		if (prices[address] === undefined) return <td data-label="Total Liquidity">No Data</td>;
		const price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	if (isNaN(total)) return <td data-label="Total Liquidity">No Data</td>;
	return <td data-label="Total Liquidity">${Number(total.toFixed(2)).toLocaleString()}</td>;
};

export const renderVolume = (pool) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return <td data-label="24h Trading Volume">$0</td>;
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	return <td data-label="24h Trading Volume">${Number(volume.toFixed(2)).toLocaleString()}</td>;
};

export const renderFees = (pool) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return <td data-label="24h Fees">$0</td>;
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	const fees = volume * pool.swapFee;
	return <td data-label="24h Fees">${Number(fees.toFixed(2)).toLocaleString()}</td>;
};

export const renderYield = (pool, index, prices) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return <td data-label="24h Yield">No Data</td>;
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	const fees = volume * pool.swapFee;
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		if (prices[address] === undefined) return <td data-label="24h Yield">No Data</td>;
		const price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	const feeYield = fees / total * 100;
	if (isNaN(feeYield)) return <td data-label="24h Yield">No Data</td>;
	return <td data-label="24h Yield">{feeYield.toFixed(4)}%</td>; //
};

export const checkLiquidity = (pool, prices) => {
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		if (prices[address] === undefined) return 0;
		const price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	return Number(total.toFixed(2)).toLocaleString();
};

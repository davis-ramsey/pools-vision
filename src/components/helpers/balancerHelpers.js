export const renderAssets = (pool) => {
	const assets = [];
	for (let token of pool.tokens) {
		const weight = token.denormWeight / pool.totalWeight;
		const percentage = (weight * 100).toFixed(2) + '%';
		assets.push(percentage + ' ' + token.symbol);
	}
	return assets.join(' ');
};

export const renderTotalLiquidity = (pool, prices) => {
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		if (prices[address] === undefined) return 'No Data';
		const price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	if (isNaN(total)) return 'No Data';
	return Number(total.toFixed(2)).toLocaleString();
};

export const renderVolume = (pool) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return 0;
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	return Number(volume.toFixed(2)).toLocaleString();
};

export const renderFees = (pool) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return 0;
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	const fees = volume * pool.swapFee;
	return Number(fees.toFixed(2)).toLocaleString();
};

export const renderYield = (pool, prices) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return 'No Data';
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	const fees = volume * pool.swapFee;
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		if (prices === undefined) return 'No Data';
		const price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	const feeYield = fees / total * 100;
	if (isNaN(feeYield)) return 'No Data';
	return feeYield.toFixed(4);
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

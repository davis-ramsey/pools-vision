import { feeFactor, ratioFactor } from './factorCalcs';

const colors = [
	'lightslategray',
	'darkorange',
	'teal',
	'forestgreen',
	'aquamarine',
	'mistyrose',
	'crimson',
	'orchid',
	'steelblue',
	'blue',
	'darkmagenta',
	'goldenrod'
];

export const renderAssetsText = (pool) => {
	const assets = [];
	for (let token of pool.tokens) {
		const weight = token.denormWeight / pool.totalWeight;
		const percentage = (weight * 100).toFixed(2) + '%';
		assets.push(percentage + ' ' + token.symbol);
	}
	return assets;
};

export const renderAssets = (pool) => {
	const assets = [];
	const pickedColors = [];
	pool.tokens.forEach((token, index) => {
		const colorChoices = colors.filter((value) => pickedColors.indexOf(value) === -1);
		const random = Math.floor(Math.random() * colorChoices.length);
		const colorPick = colorChoices[random];
		console.log(colorPick);
		pickedColors.push(colorPick);
		const weight = token.denormWeight / pool.totalWeight;
		const percentage = parseFloat((weight * 100).toFixed(2));
		const entry = { title: token.symbol, value: percentage, color: colorPick };
		assets.push(entry);
	});
	return assets;
};

export const renderTotalLiquidity = (pool, prices) => {
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		if (prices === undefined || prices[address] === undefined) return 'No Data';
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

const totalFactor = (pool) => {
	const fee = feeFactor(pool.swapFee);
	const ratio = ratioFactor(pool);
	return fee * ratio;
};

export const renderAdjLiquidity = (pool, prices, sumLiq) => {
	const tFactor = totalFactor(pool);
	const liquidity = renderTotalLiquidity(pool, prices).split(',').join('');
	if (isNaN(liquidity / sumLiq * 14500)) return 0;
	return liquidity * tFactor / sumLiq * 145000 * 52;
};

export const renderTotalYield = (pool, prices, sumLiq) => {
	const liquidity = renderTotalLiquidity(pool, prices).split(',').join('');
	if (isNaN(liquidity / sumLiq * 14500)) return 0;
	const annualBAL = renderAdjLiquidity(pool, prices, sumLiq);
	const feeYield = parseFloat(renderYield(pool, prices)) * 365;
	const priceBAL = prices['0xba100000625a3754423978a60c9317c58a424e3d'].usd;
	const yieldBAL = parseFloat(annualBAL * priceBAL / liquidity * 100);
	const totalYield = yieldBAL + feeYield;
	return totalYield.toFixed(2);
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
export const renderYield = (pool, prices) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return '0';
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	const fees = volume * pool.swapFee;
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		if (prices === undefined) return '0';
		const price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	const feeYield = fees / total * 100;
	if (isNaN(feeYield)) return '0';
	return feeYield.toFixed(4);
};

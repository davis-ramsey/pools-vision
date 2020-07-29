import { feeFactor } from './factorCalcs';
import React from 'react';
import axios from 'axios';

const colors = [
	'darkorange',
	'teal',
	'forestgreen',
	'crimson',
	'orchid',
	'steelblue',
	'lightslategray',
	'darkmagenta'
];

const softWrap = [
	[
		//stablecoin soft pegs USDC, mUSD, sUSD, DAI, cUSDC, cUSDT,cDAI,yUSD-Sep20,USD++,TUSD
		'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		'0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
		'0x57ab1ec28d129707052df4df418d58a2d46d5f51',
		'0x6b175474e89094c44da98b954eedeac495271d0f',
		'0x39aa39c021dfbae8fac545936693ac917d5e7563',
		'0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
		'0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
		'0x81ab848898b5ffd3354dbbefb333d5d183eedcb5',
		'0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e',
		'0x0000000000085d4780b73119b644ae5ecd22b376'
	], //WETH soft pegs sETH, WETH
	[ '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ],
	//WBTC soft pegs wBTC, renBTC, imBTC,pBTC,sBTC
	[
		'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
		'0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
		'0x3212b29e33587a00fb1c83346f5dbfa69a458923',
		'0x5228a22e72ccc52d415ecfd199f99d0665e7733b',
		'0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6'
	]
];

//WETH, DAI, USDC, WBTC, BAL
const unCapped = [
	[
		'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		'0x6b175474e89094c44da98b954eedeac495271d0f',
		'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
		'0xba100000625a3754423978a60c9317c58a424e3d'
	],
	[]
];

const tokenAddresses = [
	'0xba100000625a3754423978a60c9317c58a424e3d',
	'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	'0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
	'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	'0x39aa39c021dfbae8fac545936693ac917d5e7563',
	'0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
	'0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
	'0x6b175474e89094c44da98b954eedeac495271d0f',
	'0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
	'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
	'0xC11b1268C1A384e55C48c2391d8d480264A3A7F4',
	'0xb4efd85c19999d84251304bda99e90b92300bd93',
	'0x1985365e9f78359a9b6ad760e32412f4a445e862',
	'0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
	'0x57ab1ec28d129707052df4df418d58a2d46d5f51',
	'0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
	'0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
	'0xc00e94cb662c3520282e6f5717214004a7f26888',
	'0x514910771af9ca656af840dff83e8264ecf986ca',
	'0x408e41876cccdc0f92210600ef50372656052a38',
	'0x8a9c67fee641579deba04928c4bc45f66e26343a',
	'0x9cb2f26a23b8d89973f08c957c4d7cdf75cd341c',
	'0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd',
	'0x0d8775f648430679a709e98d2b0cb6250d2887ef',
	'0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'
];
const tokenColors = [
	'white', //BAL
	'pink', //WETH
	'pink', //CETH
	'olive', //USDC
	'olive', //CUSDC
	'goldenrod', //mUSD
	'aquamarine', //MKR
	'yellow', //DAI
	'yellow', //CDAI
	'blue', //WBTC
	'blue', //CWBTC
	'palegreen', //RPL
	'rgb(57%, 39%, 34%)', // REP
	'rgb(4%, 68%, 80%)', //LEND
	'rgb(43%, 52%, 56%)', // sUSD
	'rgb(36%, 38%, 89%)', //sETH
	'rgb(73%, 74%, 6%)', //UMA
	'rgb(81%, 20%, 1%)', //COMP
	'rgb(62%, 62%, 46%)', //LINK
	'rgb(96%, 89%, 64%)', //REN
	'rgb(1%, 51%, 32%)', //JRT
	'rgb(56%, 46%, 71%)', //DZAR
	'rgb(100%, 43%, 34%)', //BTC++
	'rgb(12%, 32%, 10%)', //BAT
	'rgb(86%, 34%, 36%)' //SNX
];

async function fetchWhitelist() {
	const response = await axios.get(
		`https://raw.githubusercontent.com/balancer-labs/pool-management/master/src/deployed.json`,
		{
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}
	);
	const whitelist = response.data.mainnet.tokens.slice(1).flatMap((a) => a.address.toLowerCase());

	return whitelist;
}

export let whiteList = null;

fetchWhitelist().then((whitelist) => (whiteList = whitelist));

export const numberWithCommas = (num) => {
	var parts = ('' + (num < 0 ? -num : num)).split('.'),
		s = parts[0],
		L,
		i = (L = s.length),
		o = '';
	while (i--) {
		o = (i === 0 ? '' : (L - i) % 3 ? '' : ',') + s.charAt(i) + o;
	}
	return (num < 0 ? '-' : '') + o + (parts[1] ? '.' + parts[1] : '');
};

export const renderCapFactor = (address, adjLiq) => {
	if (unCapped[0].includes(address)) return 1;
	if (adjLiq > 10000000) return 10000000 / adjLiq;
	else return 1;
};

export const renderAssetsText = (pool) => {
	const assets = [];
	const colorPick = [];
	pool.tokens.forEach((token, index) => {
		if (tokenAddresses.indexOf(token.address) !== -1)
			colorPick.push(tokenColors[tokenAddresses.findIndex((value) => value === token.address)]);
		else colorPick.push(colors[index]);
		const weight = token.denormWeight / pool.totalWeight;
		let percentage = (weight * 100).toFixed(2);
		percentage = Number(percentage).toString() + '%';
		assets.push(percentage + ' ' + token.symbol);
	});
	return assets.map((asset, index) => {
		return (
			<span key={Math.random()}>
				<i className={'icon tiny circle'} style={{ color: `${colorPick[index]}` }} />
				{asset}&nbsp;&nbsp;
			</span>
		);
	});
};

export const renderAssets = (pool) => {
	const assets = [];
	pool.tokens.forEach((token, index) => {
		let colorPick;
		if (tokenAddresses.indexOf(token.address) !== -1)
			colorPick = tokenColors[tokenAddresses.findIndex((value) => value === token.address)];
		else colorPick = colors[index];
		const weight = token.denormWeight / pool.totalWeight;
		const percentage = parseFloat((weight * 100).toFixed(2));
		const entry = { title: token.symbol, value: percentage, color: colorPick };
		assets.push(entry);
	});
	return assets;
};

export const renderTotalLiquidity = (pool, prices, ownership = 1) => {
	let total = 0;
	for (let token of pool.tokens) {
		const address = token.address;
		let price = 0;
		if (prices !== undefined && prices[address] !== undefined) price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	if (isNaN(total)) return 0;
	total = total * ownership;
	return Number(total.toFixed(2));
};

export const renderVolume = (pool, ownership = 1) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return 0;
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = (totalSwapVolume - swap) * ownership;
	return volume.toFixed(2);
};

export const renderFees = (pool, ownership = 1) => {
	const totalSwapVolume = pool.totalSwapVolume;
	if (pool.swaps[0] === undefined) return 0;
	const swap = pool.swaps[0].poolTotalSwapVolume;
	const volume = totalSwapVolume - swap;
	const fees = volume * pool.swapFee * ownership;
	return fees.toFixed(2);
};

export const totalFactor = (pool) => {
	const fee = feeFactor(pool.swapFee);
	const addresses = [];
	const weights = [];
	for (let token of pool.tokens) {
		if (whiteList.includes(token.address.toLowerCase())) {
			addresses.push(token.address.toLowerCase());
			weights.push(parseFloat(token.denormWeight));
		}
	}
	const balFactor = getBalFactor(addresses, weights, balPair);
	const wrapFactor = getWrapFactor(addresses, weights, isWrapPair, 0.7);
	if (isNaN(balFactor * fee * wrapFactor)) return 'Not Whitelisted';
	return balFactor * fee * wrapFactor;
};

export const wrapFactor = (pool) => {
	const addresses = [];
	const weights = [];
	for (let token of pool.tokens) {
		if (whiteList.includes(token.address.toLowerCase())) {
			addresses.push(token.address.toLowerCase());
			weights.push(parseFloat(token.denormWeight));
		}
	}
	const wrapF = getWrapFactor(addresses, weights, isWrapPair, 0.7);
	if (isNaN(wrapF)) return 'Not Whitelisted';
	return wrapF;
};

export const balFactor = (pool) => {
	const addresses = [];
	const weights = [];
	for (let token of pool.tokens) {
		if (whiteList.includes(token.address.toLowerCase())) {
			addresses.push(token.address.toLowerCase());
			weights.push(parseFloat(token.denormWeight));
		}
	}
	const balFactor = getBalFactor(addresses, weights, balPair);
	if (isNaN(balFactor)) return 'Not Whitelisted';
	return balFactor;
};

function getWrapFactor(tokens, weights, factor, value) {
	let wrapFactorSum = 0;
	let pairWeightSum = 0;
	let n = weights.length;
	for (let x = 0; x < n; x++) {
		for (let y = x + 1; y < n; y++) {
			let pairWeight = weights[x] * weights[y];
			let isWrapped = factor(tokens[x], tokens[y]);
			let wrapFactorPair = isWrapped ? value : 1;
			wrapFactorSum = wrapFactorSum + wrapFactorPair * pairWeight;
			pairWeightSum = pairWeightSum + pairWeight;
		}
	}
	let wrapFactor = wrapFactorSum / pairWeightSum;
	return wrapFactor;
}

function getBalFactor(tokens, weights, factor) {
	let ratioFactorSum = 0;
	let pairWeightSum = 0;
	let n = weights.length;
	for (let x = 0; x < n; x++) {
		for (let y = x + 1; y < n; y++) {
			let pairWeight = weights[x] * weights[y];
			let normalizedWeight1 = weights[x] / (weights[x] + weights[y]);
			let normalizedWeight2 = weights[y] / (weights[x] + weights[y]);
			let balFactor = factor(tokens[x], weights[x], tokens[y], weights[y]);
			ratioFactorSum += balFactor * (4 * normalizedWeight1 * normalizedWeight2) * pairWeight;
			pairWeightSum += pairWeight;
		}
	}
	return ratioFactorSum / pairWeightSum;
}

function balPair(token1, weight1, token2, weight2) {
	if (token1 === '0xba100000625a3754423978a60c9317c58a424e3d' && unCapped[0].includes(token2))
		return (2 * weight1 + weight2) / (weight1 + weight2);
	else if (token2 === '0xba100000625a3754423978a60c9317c58a424e3d' && unCapped[0].includes(token1))
		return (weight1 + 2 * weight2) / (weight1 + weight2);
	else return 1;
}

function isWrapPair(tokenA, tokenB) {
	for (let set in softWrap) {
		if (softWrap[set].includes(tokenA) && softWrap[set].includes(tokenB)) {
			return true;
		}
	}
	return false;
}

export const renderAdjLiquidity = (pool, prices, sumLiq, caps, ownership = 1) => {
	const liquidity = renderRealAdj(pool, prices, caps, ownership);
	if (isNaN(liquidity / sumLiq * 14500)) return 0;
	return liquidity / sumLiq * 145000 * 52 * ownership;
};

export const renderRealAdj = (pool, prices, caps, ownership = 1) => {
	let total = 0;
	const totalFac = totalFactor(pool);
	for (let token of pool.tokens) {
		const address = token.address;
		let price = 0;
		if (prices !== undefined && prices[address] !== undefined) price = prices[address].usd;
		const balance = parseFloat(token.balance);
		const obj = caps.filter((item) => item.addr === address);
		let capFactor = 1;
		if (obj[0]) capFactor = renderCapFactor(address, obj[0].adj);
		total += price * balance * capFactor;
	}
	if (isNaN(total) || isNaN(totalFac)) return 0;
	total = total * totalFac * ownership;
	return Number(total.toFixed(2));
};

export const renderTotalYield = (pool, prices, sumLiq, caps) => {
	const liquidity = renderTotalLiquidity(pool, prices);
	if (isNaN(liquidity / sumLiq * 14500)) return 0;
	const annualBAL = renderAdjLiquidity(pool, prices, sumLiq, caps);
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
		let price = 0;
		if (prices[address] !== undefined) price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	return Number(total.toFixed(2));
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
		let price = 0;
		if (prices !== undefined && prices[address] !== undefined) price = prices[address].usd;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	const feeYield = fees / total * 100;
	if (isNaN(feeYield)) return '0';
	return feeYield.toFixed(4);
};

export const renderOwnership = (ownership) => {
	if (!ownership) return '-';
	else return (ownership * 100).toFixed(2);
};

export const renderNumLP = (pool, moreShares) => {
	let count = 0;
	for (let share of pool.shares) if (parseInt(share.balance) !== 0) count++;
	for (let anotherPool of moreShares)
		if (anotherPool.id === pool.id)
			for (let share of anotherPool.shares) if (parseInt(share.balance) !== 0) count++;
	if (count === 0) return 1;
	else return count;
};

export const renderLifetimeFees = (pool) => {
	const swapFee = pool.swapFee;
	const totalVolume = pool.totalSwapVolume;
	return Number((totalVolume * swapFee).toFixed(2));
};

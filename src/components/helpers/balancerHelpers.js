import { feeFactor } from './factorCalcs';
import React from 'react';
import axios from 'axios';
import { colors, tokenAddresses, tokenColors } from './colors';
import { softWrap } from './softWraps';
import { unCapped } from './unCapped';
import { BLACKLISTED_SHAREHOLDERS } from './shareHolders';
import { cap1, cap2, cap4, cap5 } from './cappedList';

async function fetchWhitelist() {
	const response = await axios.get(
		`https://raw.githubusercontent.com/balancer-labs/assets/master/lists/eligible.json`,
		{
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}
	);

	const whitelist = Object.keys(response.data.homestead).map((item) => item.toLowerCase());
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
	else if (cap1.includes(address)) {
		if (adjLiq > 1000000) return 1000000 / adjLiq;
	} else if (cap2.includes(address)) {
		if (adjLiq > 3000000) return 3000000 / adjLiq;
	} else if (cap4.includes(address)) {
		if (adjLiq > 40000000) return 40000000 / adjLiq;
	} else if (cap5.includes(address)) {
		if (adjLiq > 100000000) return 100000000 / adjLiq;
	} else if (adjLiq > 10000000) return 10000000 / adjLiq;
	else return 1;
	return 1;
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
	let missingPrices = false;
	for (let token of pool.tokens) {
		const address = token.address;
		let price = 0;
		if (prices !== undefined && prices[address] !== undefined && prices[address].usd !== undefined) price = prices[address].usd;
		const balance = parseFloat(token.balance);
		if(price === 0) missingPrices = true;
		total += price * balance;
	}
	if (isNaN(total)) return 0;
	if(missingPrices) total = parseFloat(pool.liquidity)
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

export const totalFactor = (pool, balMultiplier) => {
	const fee = feeFactor(pool.swapFee);
	const addresses = [];
	const weights = [];
	for (let token of pool.tokens) {
		if (whiteList.includes(token.address.toLowerCase())) {
			addresses.push(token.address.toLowerCase());
			weights.push(parseFloat(token.denormWeight));
		}
	}
	const balFactor = getBalFactor(addresses, weights, balPair, balMultiplier);
	const wrapFactor = getWrapFactor(addresses, weights, isWrapPair, 0.2);
	if (isNaN(balFactor * fee * wrapFactor)) return 0;
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
	const wrapF = getWrapFactor(addresses, weights, isWrapPair, 0.2);
	if (isNaN(wrapF)) return 0;
	return wrapF;
};

export const balFactor = (pool, balMultiplier = 2) => {
	const addresses = [];
	const weights = [];
	for (let token of pool.tokens) {
		if (whiteList.includes(token.address.toLowerCase())) {
			addresses.push(token.address.toLowerCase());
			weights.push(parseFloat(token.denormWeight));
		}
	}
	const balFactor = getBalFactor(addresses, weights, balPair, balMultiplier);
	if (isNaN(balFactor)) return 0;
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

function getBalFactor(tokens, weights, factor, balMultiplier) {
	let ratioFactorSum = 0;
	let pairWeightSum = 0;
	let n = weights.length;
	for (let x = 0; x < n; x++) {
		for (let y = x + 1; y < n; y++) {
			let pairWeight = weights[x] * weights[y];
			let normalizedWeight1 = weights[x] / (weights[x] + weights[y]);
			let normalizedWeight2 = weights[y] / (weights[x] + weights[y]);
			let balFactor = factor(tokens[x], weights[x], tokens[y], weights[y], balMultiplier);
			ratioFactorSum += balFactor * (4 * normalizedWeight1 * normalizedWeight2) * pairWeight;
			pairWeightSum += pairWeight;
		}
	}
	return ratioFactorSum / pairWeightSum;
}

export const splitLiquidityProviders = (pool) => {
	let includesBal = null;
	let includesUncappedTokenPair = null;
	for (const token1 of pool.tokens) {
		for (const token2 of pool.tokens) {
			if (token1.address !== token2.address) {
				if (
					token1.address === '0xba100000625a3754423978a60c9317c58a424e3d' ||
					token2.address === '0xba100000625a3754423978a60c9317c58a424e3d'
				) {
					includesBal = true;
				}
				if (
					(token2.address === '0xba100000625a3754423978a60c9317c58a424e3d' &&
						unCapped[0].includes(token1.address)) ||
					(token1.address === '0xba100000625a3754423978a60c9317c58a424e3d' &&
						unCapped[0].includes(token2.address))
				)
					includesUncappedTokenPair = true;
			}
		}
	}
	const poolLiquidityProviders = pool.shares;
	if (includesBal && includesUncappedTokenPair) {
		let shareHolderLiquidityProviders = poolLiquidityProviders.filter((share) =>
			BLACKLISTED_SHAREHOLDERS.includes(share.userAddress.id)
		);
		let nonshareholderLiquidityProviders = poolLiquidityProviders.filter(
			(share) => !BLACKLISTED_SHAREHOLDERS.includes(share.userAddress.id)
		);
		if (shareHolderLiquidityProviders.length > 0 && nonshareholderLiquidityProviders.length > 0)
			return [ nonshareholderLiquidityProviders, shareHolderLiquidityProviders ];
	}
	return [ poolLiquidityProviders ];
};

const lpOwnership = (pool) => {
	let lpOwnership = 0;
	const subpoolLiquidityProviders = splitLiquidityProviders(pool);
	if (subpoolLiquidityProviders.length !== 1) lpOwnership = stakerOwnership(pool, subpoolLiquidityProviders[0]);
	return lpOwnership;
};

export const newTotalLiquidity = (pool, prices, caps, balMultiplier) => {
	let userLiquidity = 0;
	let shareHolderLiquidity = 0;
	let lpOwnership = null;
	const subpoolLiquidityProviders = splitLiquidityProviders(pool);
	if (subpoolLiquidityProviders.length !== 1) {
		lpOwnership = stakerOwnership(pool, subpoolLiquidityProviders[0]);
		userLiquidity += renderRealAdj(pool, prices, caps, lpOwnership, balMultiplier);
		shareHolderLiquidity += renderRealAdj(pool, prices, caps, 1 - lpOwnership, 1);
	} else userLiquidity += renderRealAdj(pool, prices, caps, 1, balMultiplier);
	return [ userLiquidity, shareHolderLiquidity ];
};

export const stakerOwnership = (pool, lps) => {
	let lpShares = 0;
	for (const lp of lps) {
		lpShares += parseFloat(lp.balance);
	}
	const lpOwnership = lpShares / parseFloat(pool.totalShares);
	return lpOwnership;
};

function balPair(token1, weight1, token2, weight2, balMultiplier) {
	if (token1 === '0xba100000625a3754423978a60c9317c58a424e3d' && unCapped[0].includes(token2))
		return (balMultiplier * weight1 + weight2) / (weight1 + weight2);
	else if (token2 === '0xba100000625a3754423978a60c9317c58a424e3d' && unCapped[0].includes(token1))
		return (weight1 + balMultiplier * weight2) / (weight1 + weight2);
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

export const renderAdjLiquidity = (pool, prices, sumLiq, caps, ownership = 1, balMultiplier, user = false) => {
	const liquidity = newTotalLiquidity(pool, prices, caps, balMultiplier);
	const totalLiquidity = liquidity[0] + liquidity[1];
	// renderRealAdj(pool, prices, caps, ownership, balMultiplier);
	if (isNaN(totalLiquidity / sumLiq * 125000)) return 0;
	const lpOwners = lpOwnership(pool);
	if (user === true) return totalLiquidity * lpOwners / sumLiq * 125000 * 52 * ownership;
	return totalLiquidity / sumLiq * 125000 * 52 * ownership;
};

export const renderRealAdj = (pool, prices, caps, ownership = 1, balMultiplier) => {
	let total = 0;
	const totalFac = totalFactor(pool, balMultiplier);
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

export const renderTotalYield = (pool, prices, sumLiq, caps, balMultiplier) => {
	const totalLiquidity = newTotalLiquidity(pool, prices, caps, 1);
	let liquidity = renderTotalLiquidity(pool, prices);
	let annualBAL = renderAdjLiquidity(pool, prices, sumLiq, caps, 1, balMultiplier);
	if (totalLiquidity[1] !== 0) {
		const lpOwners = lpOwnership(pool);
		liquidity = liquidity * lpOwners;
		annualBAL = newTotalLiquidity(pool, prices, caps, balMultiplier)[0] / sumLiq * 125000 * 52;
	}
	if (isNaN(liquidity / sumLiq * 125000)) return 0;

	const feeYield = parseFloat(renderYield(pool, prices)) * 365;
	const priceBAL = prices['0xba100000625a3754423978a60c9317c58a424e3d'].usd;
	const yieldBAL = parseFloat(annualBAL * priceBAL / liquidity * 100);
	const totalYield = yieldBAL + feeYield;
	return [ yieldBAL.toFixed(2), feeYield.toFixed(2), totalYield.toFixed(2) ];
};

export const checkLiquidity = (pool, prices) => {
	let total = 0;
	let missingPrices = false;
	for (let token of pool.tokens) {
		const address = token.address;
		let price = 0;
		if (prices[address] !== undefined) price = prices[address].usd;
		if (price ===0)missingPrices = true;
		const balance = parseFloat(token.balance);
		total += price * balance;
	}
	if(missingPrices) total = parseFloat(pool.liquidity)
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
	if (isNaN(feeYield)) return 0;
	return feeYield.toFixed(4);
};

export const renderOwnership = (ownership) => {
	if (!ownership) return '-';
	else return (ownership * 100).toFixed(2);
};

export const renderNumLP = (pool, moreShares) => {
	let count = 0;
	for (let share of pool.shares) if (parseFloat(share.balance) !== 0) count++;
	for (let anotherPool of moreShares)
		if (anotherPool.id === pool.id)
			for (let share of anotherPool.shares) if (parseFloat(share.balance) !== 0) count++;
	if (count === 0) return 1;
	else return count;
};

export const renderLifetimeFees = (pool) => {
	const swapFee = pool.swapFee;
	const totalVolume = pool.totalSwapVolume;
	return Number((totalVolume * swapFee).toFixed(2));
};

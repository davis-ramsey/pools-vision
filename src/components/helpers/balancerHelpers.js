import { feeFactor } from './factorCalcs';
import React from 'react';
import axios from 'axios';
import { colors, tokenAddresses, tokenColors } from './colors';
import { softWrap } from './softWraps';
import { unCapped } from './unCapped';

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
	const whitelist = response.data.homestead.flatMap((a) => a.toLowerCase());

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
// new calcs start
function getAdjustedLiquidityForPair(rawLiquidityPair, feeFactor, balMultiplier, token1, weight1, token2, weight2) {
	let wrapFactorForPair = isWrapPair(token1, token2) ? 0.2 : 1;
	let balAndRatioFactorForPair = getBalAndRatioFactorForPair(balMultiplier, token1, weight1, token2, weight2);

	return rawLiquidityPair * wrapFactorForPair * balAndRatioFactorForPair * feeFactor;
}

function getAdjustedLiquidity(rawLiquidity, pools, poolOwnershipSharePerLP, tokenCapFactors, balMultiplier) {
	// First adjust the liquidity according to tokenCapFactors
	let poolRawLiquidityAfterTokenCap = {};
	for (const pool of pools) {
		poolRawLiquidityAfterTokenCap[pool.id] = 0;
		for (const token of pool.tokens) {
			poolRawLiquidityAfterTokenCap[pool.id] =
				poolRawLiquidityAfterTokenCap[pool.id] +
				rawLiquidity[pool.address][token.address] * tokenCapFactors[token.address];
		}
	}

	// Now we calculate the adjusted liquidity for each pool after all the factors
	let totalAdjustedLiquidityAfterTokenCapAndFactors = 0;
	let poolAdjustedLiquidityAfterTokenCapAndFactors = {};
	for (const pool of pools) {
		let feeFac = feeFactor(pool.swapFee);
		let wrapFac = wrapFactor(pool);
		const addresses = [];
		const weights = [];
		for (let token of pool.tokens) {
			if (whiteList.includes(token.address.toLowerCase())) {
				addresses.push(token.address.toLowerCase());
				weights.push(parseFloat(token.denormWeight));
			}
		}
		let balAndRatioFactor = getBalAndRatioFactor(balMultiplier, addresses, weights);

		poolAdjustedLiquidityAfterTokenCapAndFactors[pool.address] =
			poolRawLiquidityAfterTokenCap[pool.address] * feeFac * wrapFac * balAndRatioFactor;

		totalAdjustedLiquidityAfterTokenCapAndFactors =
			totalAdjustedLiquidityAfterTokenCapAndFactors + poolAdjustedLiquidityAfterTokenCapAndFactors;
	}

	// Now we calculate the amount of BAL each LP gets
	let balAmountPerLP = {}; // Object with amount of BAL each LP (key) gets
	for (const pool of pools) {
		for (const LP of poolOwnershipSharePerLP[pool.address]) {
			let balForLpInPool =
				poolOwnershipSharePerLP[pool.address][LP] *
				poolAdjustedLiquidityAfterTokenCapAndFactors[pool.address] /
				totalAdjustedLiquidityAfterTokenCapAndFactors *
				145000;
			if (balAmountPerLP[LP]) {
				balAmountPerLP[LP] = balForLpInPool;
			} else {
				balAmountPerLP[LP] = balAmountPerLP[LP] + balForLpInPool;
			}
		}
	}
	return [ totalAdjustedLiquidityAfterTokenCapAndFactors, balAmountPerLP ];
}

export function getTotalTokenAdjustedLiquidity(rawLiquidity, pools, prices) {
	let totalTokenAdjustedLiquidity = {};
	for (const pool of pools) {
		// For each pool we check all pairs that contain token 1
		// and add up its adjusted liquidity
		let feeFac = feeFactor(pool.swapFee);
		for (const token1 of pool.tokens) {
			let sumPairWeightToken1 = 0;
			let sumAdjustedLiquidityToken1 = 0;
			for (const token2 of pool.tokens) {
				if (token1 !== token2) {
					let weight1 = parseFloat(token1.denormWeight) / parseFloat(pool.totalWeight);
					let weight2 = parseFloat(token2.denormWeight) / parseFloat(pool.totalWeight);
					let pairWeight = weight1 * weight2;
					sumPairWeightToken1 = sumPairWeightToken1 + pairWeight;

					let rawLiquidityPair = 0;
					if (prices[token1.address] && prices[token2.address]) {
						rawLiquidityPair =
							prices[token1.address].usd * parseFloat(token1.balance) +
							prices[token2.address].usd * parseFloat(token2.balance);
					}
					let adjustedLiquidityPair = getAdjustedLiquidityForPair(
						rawLiquidityPair,
						feeFac,
						1, // balMultiplier = 1
						token1,
						weight1,
						token2,
						weight2
					);
					// Only add the proportion of this pair that is token1:
					let token1Proportion = weight1 / (weight1 + weight2);
					sumAdjustedLiquidityToken1 =
						sumAdjustedLiquidityToken1 + adjustedLiquidityPair * token1Proportion * pairWeight;
				}
			}
			//	console.log(sumAdjustedLiquidityToken1);
			if (totalTokenAdjustedLiquidity[token1.address]) {
				totalTokenAdjustedLiquidity[token1.address] =
					totalTokenAdjustedLiquidity[token1.address] + sumAdjustedLiquidityToken1 / sumPairWeightToken1;
			} else {
				totalTokenAdjustedLiquidity[token1.address] = sumAdjustedLiquidityToken1 / sumPairWeightToken1;
			}
		}
	}
	return totalTokenAdjustedLiquidity;
}

function getBalAndRatioFactor(balMultiplier, tokens, weights) {
	let balAndRatioFactorSum = 0;
	let pairWeightSum = 0;
	let n = weights.length;
	for (let j = 0; j < n; j++) {
		for (let k = j + 1; k < n; k++) {
			let pairWeight = weights[j] * weights[k];
			pairWeightSum = pairWeightSum + pairWeight;

			let balAndRatioFactorForPair = getBalAndRatioFactorForPair(
				balMultiplier,
				tokens[j],
				weights[j],
				tokens[k],
				weights[k]
			);
			balAndRatioFactorSum = balAndRatioFactorSum + balAndRatioFactorForPair * pairWeight;
		}
	}

	const ratioFactor = balAndRatioFactorSum / pairWeightSum;

	return ratioFactor;
}

function getRatioFactorForPair(token1, weight1, token2, weight2) {
	let normalizedWeight1 = weight1 / (weight1 + weight2);

	let normalizedWeight2 = weight2 / (weight1 + weight2);
	return 4 * normalizedWeight1 * normalizedWeight2;
}

function getBalAndRatioFactorForPair(balMultiplier, token1, weight1, token2, weight2) {
	let balMultiplierForPair = balPair(balMultiplier, token1, weight1, token2, weight2);

	let ratioFactorForPair = getRatioFactorForPair(token1, weight1, token2, weight2);

	return balMultiplierForPair * ratioFactorForPair;
}
// new calcs end
function balPair(token1, weight1, token2, weight2, balMultiplier = 2) {
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

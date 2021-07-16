import coingecko from '../apis/coingecko';
import axios from 'axios';

export const addShares = ({ id }, num) => async (dispatch) => {
	const response = await axios({
		url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
		method: 'post',
		data: {
			query: `{
      pools (where: {id: "${id}"}) {
				id
				swapFee
				totalShares
				totalSwapVolume
				tokensList
				totalWeight
				totalSwapFee
				totalSwapVolume
				createTime
				tokens {
					id
					address
					balance
					decimals
					symbol
					weight
				}
       shares (first: 1000, skip: ${1000 * num}, orderBy: balance, orderDirection: desc, where:{balance_gt:"0"}) {
        id
        userAddress {
          id
        }
        balance
			}
			swaps (first: 1,orderBy: timestamp,orderDirection: desc, where: {timestamp_lt: ${Math.floor(Date.now() / 1000) -
				86400}}) {
					 tokenIn
					 tokenInSym
					 tokenAmountIn
					 tokenOut
					 tokenOutSym
					 tokenAmountOut
				 }
     }
   }`
		}
	});
	dispatch({ type: 'ADD_SHARES', payload: response.data });
};

export const deleteShares = () => (dispatch) => {
	dispatch({ type: 'DELETE_SHARES' });
};

export const fetchPools = (num) => async (dispatch) => {
	const response = await axios({
		url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
		method: 'post',
		data: {
			query: `{
				pools (first: 1000, skip: ${num * 1000}, orderBy: totalLiquidity, orderDirection: desc) {
					id
					totalLiquidity
				 swapFee
				 totalShares
				 totalWeight
				 totalSwapVolume
				 totalSwapFee
				 tokensList
				 createTime
				 tokens {
					 id
					 address
					 balance
					 decimals
					 symbol
					 weight
				 }
				 shares (first: 1000, where:{balance_gt:"0"}, orderBy: balance, orderDirection: desc) {
					id
					userAddress {
						id
					}
					balance
				}
				 swaps (first: 1,orderBy: timestamp,orderDirection: desc, where: {timestamp_lt: ${Math.floor(Date.now() / 1000) -
						86400}}) {
					 tokenIn
					 tokenInSym
					 tokenAmountIn
					 tokenOut
					 tokenOutSym
					 tokenAmountOut
				 }
			 }
balancers {
	totalLiquidity
	totalSwapVolume
	totalSwapFee
}
		 }`
		}
	});
	dispatch({ type: 'FETCH_POOLS', payload: response.data });
};

export const removePools = () => (dispatch) => {
	dispatch({ type: 'REMOVE_POOLS' });
};

export const deletePrices = () => (dispatch) => {
	dispatch({ type: 'DELETE_PRICES' });
};

export const fetchPrice = (address) => async (dispatch) => {
	const response = await coingecko.get(`/polygon-pos?contract_addresses=${address}&vs_currencies=usd`);
	dispatch({ type: 'FETCH_PRICE', payload: response.data });
};

export const selectPool = (pool) => (dispatch) => {
	dispatch({ type: 'SELECT_POOL', payload: pool });
};

export const deletePool = (pool) => (dispatch) => {
	dispatch({ type: 'DELETE_POOL', payload: pool });
};

export const deletePools = () => (dispatch) => {
	dispatch({ type: 'DELETE_POOLS' });
};

export const sumAllLiq = (value) => (dispatch) => {
	dispatch({ type: 'SUM_ALL_LIQ', payload: value });
};
export const deleteAllLiq = () => (dispatch) => {
	dispatch({ type: 'DELETE_ALL_LIQ' });
};
export const sumAllVol = (value) => (dispatch) => {
	dispatch({ type: 'SUM_ALL_VOL', payload: value });
};
export const deleteAllVol = () => (dispatch) => {
	dispatch({ type: 'DELETE_ALL_VOL' });
};

export const sumLiquidity = (value) => (dispatch) => {
	dispatch({ type: 'SUM_LIQUIDITY', payload: value });
};

export const clearLiquidity = () => (dispatch) => {
	dispatch({ type: 'CLEAR_LIQUIDITY' });
};

export const sumFinal = (value) => (dispatch) => {
	dispatch({ type: 'SUM_FINAL', payload: value });
};

export const deleteFinal = (value) => (dispatch) => {
	dispatch({ type: 'DELETE_FINAL', payload: value });
};

export const sumFees = (value) => (dispatch) => {
	dispatch({ type: 'SUM_FEES', payload: value });
};

export const removeFees = () => (dispatch) => {
	dispatch({ type: 'REMOVE_FEES' });
};

export const addCaps = (value) => (dispatch) => {
	dispatch({ type: 'ADD_CAPS', payload: value });
};

export const removeCaps = () => (dispatch) => {
	dispatch({ type: 'REMOVE_CAPS' });
};

export const addBalMultiplier = (value) => (dispatch) => {
	dispatch({ type: 'ADD_BAL_MULTIPLIER', payload: value });
};

export const fetchPool = (id) => async (dispatch) => {
	const response = await axios({
		url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
		method: 'post',
		data: {
			query: `{
          pools (where: {id: "${id.toLowerCase()}"}, orderBy: liquidity, orderDirection: desc) {
            id
					 swapFee
					 totalShares
           totalWeight
           totalSwapVolume
           tokens {
             id
             address
             balance
             decimals
             symbol
             weight
					 }
					 shares (first: 1000, where:{balance_gt:"0"}, orderBy: balance, orderDirection: desc) {
						id
						poolId {
							id
						}
						userAddress {
							id
						}
						balance
					}
           swaps (first: 1,orderBy: timestamp,orderDirection: desc, where: {timestamp_lt: ${Math.floor(
				Date.now() / 1000
			) - 86400}}) {
             poolTotalSwapVolume
           }
         }
       }`
		}
	});
	dispatch({ type: 'FETCH_POOL', payload: response.data });
};

export const errorMessage = (value) => (dispatch) => {
	dispatch({ type: 'ERROR_MESSAGE', payload: value });
};

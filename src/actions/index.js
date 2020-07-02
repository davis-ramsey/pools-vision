import balancerPools from '../apis/balancerPools';
import coingecko from '../apis/coingecko';
import balancerSwaps from '../apis/balancerSwaps';
import axios from 'axios';

export const fetchPools = () => async (dispatch) => {
	const response = await balancerPools;
	dispatch({ type: 'FETCH_POOLS', payload: response.data });
};

export const fetchPrice = (address) => async (dispatch) => {
	const response = await coingecko.get(`/ethereum?contract_addresses=${address}&vs_currencies=usd`);
	dispatch({ type: 'FETCH_PRICE', payload: response.data });
};

export const fetchSwaps = () => async (dispatch) => {
	const response = await balancerSwaps;
	dispatch({ type: 'FETCH_SWAPS', payload: response.data.data.pools });
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

export const sumLiquidity = (value) => (dispatch) => {
	dispatch({ type: 'SUM_LIQUIDITY', payload: value });
};

export const clearLiquidity = () => (dispatch) => {
	dispatch({ type: 'CLEAR_LIQUIDITY' });
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
           totalWeight
           totalSwapVolume
           tokens {
             id
             address
             balance
             decimals
             symbol
             denormWeight
           }
           swaps (first: 1,orderBy: timestamp,orderDirection: desc, where: {timestamp_lt: 1593517968}) {
             poolTotalSwapVolume
           }
         }
       }`
		}
	});
	dispatch({ type: 'FETCH_POOL', payload: response.data });
};

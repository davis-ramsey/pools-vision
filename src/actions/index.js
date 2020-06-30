import balancerPools from '../apis/balancerPools';
import coingecko from '../apis/coingecko';
import balancerSwaps from '../apis/balancerSwaps';

export const fetchPools = () => async (dispatch) => {
	const response = await balancerPools;
	dispatch({ type: 'FETCH_POOLS', payload: response.data });
};

export const fetchPrice = (address) => async (dispatch) => {
	const response = await coingecko.get(`/ethereum?contract_addresses=${address}&vs_currencies=usd`);
	dispatch({ type: 'FETCH_PRICE', payload: response.data });
};

export const fetchSwaps = (pool) => async (dispatch) => {
	const response = await balancerSwaps;
	dispatch({ type: 'FETCH_SWAPS', payload: response.data.data.pools });
};

import balancerSubGraph from '../apis/balancerSubGraph';
import coingecko from '../apis/coingecko';

export const fetchPools = () => async (dispatch) => {
	const response = await balancerSubGraph;
	dispatch({ type: 'FETCH_POOLS', payload: response.data });
};

export const fetchPrice = (address) => async (dispatch) => {
	const response = await coingecko.get(`/ethereum?contract_addresses=${address}&vs_currencies=usd`);
	dispatch({ type: 'FETCH_PRICE', payload: response.data });
};

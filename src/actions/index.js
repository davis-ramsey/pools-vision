import balancerSubGraph from '../apis/balancerSubGraph';
import coingecko from '../apis/coingecko';

export const fetchPools = () => async (dispatch) => {
	const response = await balancerSubGraph;
	dispatch({ type: 'FETCH_POOLS', payload: response.data });
};

export const fetchPrice = (tokenAddress) => async (dispatch) => {
	const response = await coingecko.get(`${tokenAddress.toLowerCase()}`);
	dispatch({ type: 'FETCH_PRICE', payload: response.data });
};

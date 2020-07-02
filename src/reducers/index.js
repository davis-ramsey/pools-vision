import { combineReducers } from 'redux';
import balancerReducer from './balancerReducer';
import coingeckoReducer from './coingeckoReducer';
import portfolioReducer from './portfolioReducer';
import poolReducer from './poolReducer';
import liquidityReducer from './liquidityReducer';

export default combineReducers({
	balancer: balancerReducer,
	coingecko: coingeckoReducer,
	portfolio: portfolioReducer,
	poolReducer,
	sumLiq: liquidityReducer
});

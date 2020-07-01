import { combineReducers } from 'redux';
import balancerReducer from './balancerReducer';
import coingeckoReducer from './coingeckoReducer';
import portfolioReducer from './portfolioReducer';
import poolReducer from './poolReducer';

export default combineReducers({
	balancer: balancerReducer,
	coingecko: coingeckoReducer,
	portfolio: portfolioReducer,
	poolReducer
});

import { combineReducers } from 'redux';
import balancerReducer from './balancerReducer';
import coingeckoReducer from './coingeckoReducer';
import portfolioReducer from './portfolioReducer';

export default combineReducers({ balancer: balancerReducer, coingecko: coingeckoReducer, portfolio: portfolioReducer });

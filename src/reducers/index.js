import { combineReducers } from 'redux';
import balancerReducer from './balancerReducer';
import coingeckoReducer from './coingeckoReducer';

export default combineReducers({ balancer: balancerReducer, coingecko: coingeckoReducer });

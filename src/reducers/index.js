import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import balancerReducer from './balancerReducer';
import coingeckoReducer from './coingeckoReducer';
import portfolioReducer from './portfolioReducer';
import poolReducer from './poolReducer';
import liquidityReducer from './liquidityReducer';
import allLiqReducer from './allLiqReducer';
import sumVolReducer from './sumVolReducer';
import shareReducer from './shareReducer';
import capsReducer from './capsReducer';

export default combineReducers({
	balancer: balancerReducer,
	coingecko: coingeckoReducer,
	portfolio: portfolioReducer,
	poolReducer,
	sumLiq: liquidityReducer,
	sumTotalLiq: allLiqReducer,
	sumVol: sumVolReducer,
	form: formReducer,
	moreShares: shareReducer,
	caps: capsReducer
});

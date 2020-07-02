import axios from 'axios';

export default axios({
	url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
	method: 'post',
	data: {
		query: `{
      pools (first: 1000, skip: 0, where: {finalized: true}, orderBy: liquidity, orderDirection: desc) {
        id
       publicSwap
       finalized
       swapFee
       totalWeight
       totalShares
       totalSwapVolume
       tokensList
       tokens {
         id
         address
         balance
         decimals
         symbol
         denormWeight
       }
       swaps (first: 1,orderBy: timestamp,orderDirection: desc, where: {timestamp_lt: ${Math.floor(Date.now() / 1000) -
			86400}}) {
         tokenIn
         tokenInSym
         tokenAmountIn
         tokenOut
         tokenOutSym
         tokenAmountOut
         poolTotalSwapVolume
       }
     }
   }`
	}
});

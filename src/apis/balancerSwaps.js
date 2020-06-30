import axios from 'axios';

export default axios({
	url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
	method: 'post',
	data: {
		query: `{
  pools(first: 5) {
    swaps(first: 5, skip: 0, orderBy: timestamp, orderDirection: desc) {
        timestamp
        tokenIn
        tokenInSym
        tokenAmountIn
        tokenOut
        tokenOutSym
        tokenAmountOut
    }
  }
}
`
	}
});

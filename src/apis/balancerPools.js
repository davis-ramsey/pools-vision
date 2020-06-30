import axios from 'axios';

export default axios({
	url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
	method: 'post',
	data: {
		query: `{
            pools(first: 50, where: {publicSwap: true}) {
              id
              swapFee
              totalWeight
              tokens {
                id
                address
                balance
                decimals
                symbol
                denormWeight
              }
            }
          }
`
	}
});

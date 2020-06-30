import axios from 'axios';

export default axios({
	url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
	method: 'post',
	data: {
		query: `{
            pools(first: 1000, where: {publicSwap: true}) {
              id
              finalized
              publicSwap
              swapFee
              totalWeight
              tokensList
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

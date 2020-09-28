const INITIAL_STATE =
	'Gathering data from the balancer subgraph! This may take a few seconds. Data will automatically refresh every 5 minutes.';

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'ERROR_MESSAGE': {
			return action.payload;
		}
		default:
			return state;
	}
};

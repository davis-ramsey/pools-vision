const INITIAL_STATE = {
	pools: 0
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_POOLS': {
			let pools = null;
			const check = state['pools'];
			if (check !== 0) pools = [ ...state.pools, ...action.payload.data.pools ];
			else pools = action.payload.data.pools;
			return { ...state, pools };
		}

		case 'REMOVE_POOLS':
			return {
				pools: 0
			};
		default:
			return state;
	}
};

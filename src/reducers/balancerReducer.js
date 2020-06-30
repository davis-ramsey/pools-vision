const INITIAL_STATE = {
	pools: null,
	swaps: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_POOLS':
			return { ...state, pools: action.payload.data.pools };
		case 'FETCH_SWAPS':
			return { ...state, swaps: action.payload };
		default:
			return state;
	}
};

const INITIAL_STATE = {
	pools: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_POOLS':
			return { ...state, pools: action.payload.data.pools };
		default:
			return state;
	}
};

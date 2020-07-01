const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_POOL':
			const pool = action.payload.data.pools;
			return { ...state, pool };
		default:
			return state;
	}
};

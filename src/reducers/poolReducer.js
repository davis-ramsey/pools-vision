const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_POOL':
			const pool = action.payload.data.pools;
			const id = action.payload.data.pools[0].id;
			return { ...state, [id]: pool[0] };
		case 'DELETE_POOLS':
			return {};
		default:
			return state;
	}
};

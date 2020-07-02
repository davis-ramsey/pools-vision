const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_POOL':
			const pool = action.payload.data.pools;
			if (action.payload.data.pools[0] === undefined) return state;
			const id = action.payload.data.pools[0].id;
			return { ...state, [id]: pool[0] };
		case 'DELETE_POOLS':
			return {};
		default:
			return state;
	}
};

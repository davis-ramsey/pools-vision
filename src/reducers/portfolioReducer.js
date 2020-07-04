const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SELECT_POOL':
			const newState = state.map((value) => value);
			if (newState.indexOf(action.payload) === -1) newState.push(action.payload);
			return newState;
		case 'DELETE_POOL':
			const deletedPool = state.filter((value) => value !== action.payload);
			return deletedPool;
		default:
			return state;
	}
};

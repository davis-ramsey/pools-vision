const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SELECT_POOL':
			const newState = state.map((value) => value);
			if (newState.indexOf(action.payload) === -1) newState.push(action.payload);
			return newState;
		case 'DELETE_POOL':
			const deletedPool = state.map((value) => (value !== action.payload ? value : null));
			return deletedPool;
		default:
			return state;
	}
};

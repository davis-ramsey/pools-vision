const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SELECT_POOL':
			const newState = state.map((value) => value);
			newState.push(action.payload);
			return newState;
		default:
			return state;
	}
};

const INITIAL_STATE = {
	portfolio: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SELECT_POOL':
			state.portfolio.push(action.payload);
			return {
				...state
			};
		default:
			return state;
	}
};

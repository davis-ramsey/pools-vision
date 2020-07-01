const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SELECT_POOL':
			return action.payload;
		default:
			return state;
	}
};

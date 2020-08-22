const INITIAL_STATE = 1;

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'ADD_BAL_MULTIPLIER':
			return action.payload;
		default:
			return state;
	}
};

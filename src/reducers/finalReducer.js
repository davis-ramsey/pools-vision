const INITIAL_STATE = 0;

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SUM_FINAL':
			let newState = parseFloat(state);
			const number = parseFloat(action.payload);
			if (isNaN(newState + number)) return state;
			return newState + number;
		case 'DELETE_FINAL':
			return 0;
		default:
			return state;
	}
};

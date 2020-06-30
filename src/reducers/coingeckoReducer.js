const INITIAL_STATE = {
	prices: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_PRICE':
			return {
				...state,
				prices: action.payload
			};
		default:
			return state;
	}
};

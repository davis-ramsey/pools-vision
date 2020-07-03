const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'FETCH_PRICE':
			return {
				...state,
				...action.payload
			};
		case 'DELETE_PRICES':
			return {};
		default:
			return state;
	}
};

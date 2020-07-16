const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'ADD_SHARES':
			const id = action.payload.data.pools[0];
			return [ ...state, id ];
		case 'DELETE_SHARES':
			return [];
		default:
			return state;
	}
};

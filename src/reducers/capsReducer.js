const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'ADD_CAPS':
			return [ ...action.payload ];
		case 'REMOVE_CAPS':
			return [];
		default:
			return state;
	}
};

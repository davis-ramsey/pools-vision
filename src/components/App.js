import React from 'react';

import Header from './Header';
import PortfolioView from './PortfolioView';
import Pools from './Pools';

const App = () => {
	return (
		<div className="ui container">
			<Header />
			<PortfolioView />
			<Pools />
		</div>
	);
};

export default App;

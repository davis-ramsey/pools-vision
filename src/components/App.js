import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import Header from './Header';
import PortfolioView from './PortfolioView';
import Pools from './Pools';

const App = () => {
	return (
		<div className="ui container">
			<Router history={history}>
				<div>
					<Header />
					<Switch>
						<Route path="/portfolio/:portfolio" component={PortfolioView} />
						<Route path="/" component={Pools} />
					</Switch>
				</div>
			</Router>
		</div>
	);
};

export default App;

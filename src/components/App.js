import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import Footer from './Footer';
import Header from './Header';
import PortfolioView from './PortfolioView';
import Pools from './Pools';
import PoolViewer from './PoolViewer';
import Data from './Data';

const App = () => {
	return (
		<div className="ui container">
			<Data />
			<Router history={history}>
				<div>
					<Header />
					<Switch>
						<Route path="/pool/:viewPool" component={PoolViewer} />
						<Route path="/portfolio/:portfolio" component={PortfolioView} />
						<Route path="/" component={Pools} />
					</Switch>
				</div>
				<Footer />
			</Router>
		</div>
	);
};

export default App;

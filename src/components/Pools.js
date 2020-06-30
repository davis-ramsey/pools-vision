import React from 'react';
import { connect } from 'react-redux';
import { fetchPools, fetchPrice } from '../actions';

class Pools extends React.Component {
	componentDidMount() {
		this.props.fetchPrice('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
		this.props.fetchPools();
	}

	render() {
		return <div className="ui horizontal divider header">List of All Pools</div>;
	}
}

export default connect(null, { fetchPools, fetchPrice })(Pools);

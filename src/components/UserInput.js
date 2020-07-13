import React from 'react';
import { Field, reduxForm } from 'redux-form';

class UserInput extends React.Component {
	renderError({ error, touched }) {
		if (touched && error)
			return (
				<div className="ui error message">
					<div className="header">{error}</div>
				</div>
			);
	}

	renderInput = ({ input, label, meta }) => {
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		return (
			<div className={className} style={{ flex: '1 1 40%', marginLeft: '3%', marginTop: '1%' }}>
				<label>{label}</label>
				<input {...input} autoComplete="off" />
				{this.renderError(meta)}
			</div>
		);
	};

	renderSmallInput = ({ input, label, meta }) => {
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		return (
			<div className={className} style={{ flex: '1 1 10%', marginLeft: '3%', marginTop: '1%' }}>
				<label>{label}</label>
				<input {...input} autoComplete="off" />
				{this.renderError(meta)}
			</div>
		);
	};

	onSubmit = (formValues) => {
		this.props.onSubmit(formValues);
	};

	render() {
		return (
			<form
				onSubmit={this.props.handleSubmit(this.onSubmit)}
				className="ui inverted form error"
				style={{ display: 'flex' }}
			>
				<Field name="address" component={this.renderInput} type="text" label="Filter by wallet address" />
				<Field name="token" component={this.renderSmallInput} type="text" label="Filter by token" />
				<Field name="apy" component={this.renderSmallInput} type="text" label="Filter by APY" />
			</form>
		);
	}
}

const validate = (formValues) => {
	const errors = {};
	//if (!formValues.address) errors.address = 'You must enter a valid wallet address';
	return errors;
};

export default reduxForm({ form: 'UserInput', validate })(UserInput);

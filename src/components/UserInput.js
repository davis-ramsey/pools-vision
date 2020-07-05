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
			<div className={className}>
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
			<form onSubmit={this.props.handleSubmit(this.onSubmit)} className="ui inverted form error">
				<Field name="address" component={this.renderInput} type="text" label="Filter by wallet address" />
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

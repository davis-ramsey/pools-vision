import React from 'react';
import { Field, reduxForm } from 'redux-form';
import history from '../history';

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
		let location = '';
		if (history.location.pathname.includes('/user/')) location = history.location.pathname.slice(6).toLowerCase();
		let button1,
			button2 = null;
		if (input.value !== '')
			button1 = (
				<button
					style={{ width: '25%', padding: '1%' }}
					className="ui inverted primary button"
					onClick={() => {
						if (!location.includes(input.value.toLowerCase()))
							location.includes('0x')
								? history.push(`/user/${location + ',' + input.value}`)
								: history.push(`/user/${input.value}`);
					}}
				>
					Add Address
				</button>
			);
		if (location.includes('0x'))
			button2 = (
				<button
					style={{ width: '30%', padding: '1%' }}
					className="ui inverted primary button"
					onClick={() => {
						history.push(`/`);
						this.props.reset();
					}}
				>
					Remove All Addresses
				</button>
			);

		return (
			<div
				className={className}
				style={{
					flex: '1 1 40%',
					marginLeft: '3%',
					marginTop: '1%',
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'space-between'
				}}
			>
				<label style={{ width: '33%' }}>{label}</label>
				{button1}
				{button2}
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
		formValues.address = '1';
		formValues.address = '';
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

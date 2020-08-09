import React from 'react';
import { Field, reduxForm } from 'redux-form';
import history from '../history';
import ENS from 'ethereum-ens';
import Web3 from 'web3';
import DebounceField from 'redux-form-debounce-field';
import { infura } from './helpers/keys';

const provider = new Web3.providers.HttpProvider(infura);
const ens = new ENS(provider);

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
					onClick={async () => {
						if (!location.includes(input.value.toLowerCase())) {
							if (input.value.includes('.eth')) {
								try {
									const address = await ens.resolver(input.value).addr();
									location.includes('0x') && !location.includes(address.toLowerCase())
										? history.push(`/user/${location + ',' + address.toLowerCase()}`)
										: history.push(`/user/${address.toLowerCase()}`);
								} catch (error) {
									console.log(error);
								}
							} else {
								location.includes('0x')
									? history.push(`/user/${location + ',' + input.value}`)
									: history.push(`/user/${input.value}`);
							}
						}
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
					Remove Addresses
				</button>
			);

		return (
			<div
				className={className}
				style={{
					flex: '1 1 40%',
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
			<div className={className} style={{ flex: '1 1 10%', marginTop: '1%', marginLeft: '1%' }}>
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
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					boxShadow: '0 0 0.5rem black',
					paddingLeft: '2%',
					paddingRight: '2%',
					marginTop: '1%',
					borderRadius: '10px'
				}}
			>
				<DebounceField
					name="address"
					wait={250}
					component={this.renderInput}
					type="text"
					label="Filter by wallet address"
				/>
				<div style={{ flex: '1 1 10%', marginTop: '1.4%', marginLeft: '1%' }}>
					<label>Sort Columns by</label>
					<div>
						<Field name="sortby" component="select">
							<option />
							<option value="totalLiq">Total Liquidity</option>
							<option value="finalAdj">Adjusted Liquidity</option>
							<option value="volume">24h Volume</option>
							<option value="fees">24h Fees</option>
							<option value="swapFee">Swap Fee</option>
							<option value="annualBAL">Annual BAL</option>
							<option value="apy">APY</option>
							<option value="numLP">Number of LP's</option>
						</Field>
					</div>
				</div>
				<DebounceField
					wait={250}
					name="token"
					component={this.renderSmallInput}
					type="text"
					label="Filter by token"
				/>
				<DebounceField
					wait={250}
					name="totalLiq"
					component={this.renderSmallInput}
					type="text"
					label="Filter by Liquidity"
				/>
				<DebounceField
					wait={250}
					name="apy"
					component={this.renderSmallInput}
					type="text"
					label="Filter by APY"
				/>
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

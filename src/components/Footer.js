import React from 'react';

class Footer extends React.Component {
	render() {
		return (
			<div className="ui center aligned inverted bottom attached header">
				<a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/DavisRamsey`}>
					<i className="right twitter icon" />
				</a>
				<a target="_blank" rel="noopener noreferrer" href={`https://github.com/davis-ramsey`}>
					<i className="github icon" />
				</a>
				<a target="_blank" rel="noopener noreferrer" href={`mailto:davis.ramsey@gmail.com`}>
					<i className="at icon" />
				</a>
			</div>
		);
	}
}

export default Footer;

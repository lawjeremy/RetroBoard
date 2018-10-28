import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	background-color: #420039;
	color: white;
`;

const SettingsWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const IconWrapper = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
`;

const SettingButton = styled.button`
    padding: 5px 10px;
	border: none;
	margin: 0 0.5em 0 1em;
	font-size: 1.2em;
`;

export default class Header extends React.PureComponent {
	
	constructor(props){
		super(props);
		this.state ={
			query: '',
		}
	}
	static propTypes = {
		userName: PropTypes.string,
		sendQuery: PropTypes.func,
	}
	
	handleInputChange = (event) => {
		const value =  event.target.value;
		this.props.sendQuery(value);
		this.setState({
			query: value.substr(0,30)
		})
	}

	render() {
		const { userName, search } = this.props;
		return (			
			<Wrapper>
				<IconWrapper>
					<div>Welcome</div>
					<form>
						<input
							type='text'
							placeholder="Search for..."
							ref={input => this.search = input}
							onChange={this.handleInputChange}
							value={this.state.query}
						/>
					</form>
				</IconWrapper>
				<SettingsWrapper>
					<div>{userName}</div>
					<SettingButton className='btn btn-outline-light material-icons'>settings</SettingButton>
				</SettingsWrapper>
			</Wrapper>
		)
	}
};



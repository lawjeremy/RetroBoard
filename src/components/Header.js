import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 40px;
	background-color: #420039;
	color: white;
`;

const SettingButton = styled.button`
    padding: 5px 10px;
	border: none;
	margin: 0 0.5em 0 1em;
	font-size: 1.2em;
`;

const Header = ({ userName }) => {
	return (		
		<Wrapper>
			<div>{userName}</div>
			<SettingButton className='btn btn-outline-light material-icons'>settings</SettingButton>
		</Wrapper>
	);
};

export default Header;
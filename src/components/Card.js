import React from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
	position: relative;	
	min-height: 200px;
  background:#FFF;
	width: 300px;
	marign: 40px auto;
	z-index: 0;

	-webkit-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	-moz-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
`;

const Card = ({children}) => {
	return (
		<Draggable bounds="body" >
				<Wrapper>
						{children}
				</Wrapper>
		</Draggable>
	)

};

export default Card;
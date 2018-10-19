import React from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
	position: relative;	
	min-height: 100px;
 	background:#FFF;
	width: 100%;
	margin-bottom: 10px;
	z-index: 0;

	-webkit-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	-moz-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
`;

const Card = ({children, id, handleStop}) => {
	console.log('I am sparta');
	return (
		<Draggable id={id} onDrag={handleStop} bounds="body" >
				<Wrapper>
						{children}
				</Wrapper>
		</Draggable>
	)

};

export default Card;
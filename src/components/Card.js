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
	opacity: 0.8;

	-webkit-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	-moz-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
`;

const Remove = styled.button`
	position: absolute;
	top: 0px;
	right: 0px;
	border: none;
`;

const Card = ({children, id, handleStop, handleDrag, removeCard}) => {
	console.log('I am sparta');
	return (
		<Draggable id={id} onStop={handleStop} onDrag={handleDrag} bounds="body" >
			
				<Wrapper>
					<Remove className='btn btn-outline-dark material-icons' onClick={removeCard}>clear</Remove>
					{children}
				</Wrapper>
		</Draggable>
	)

};

export default Card;
import React from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
	position: relative;	
	min-height: 150px;
 	background:#FFF;
	width: 100%;
	margin-bottom: 10px;
	z-index: 0;
	opacity: 0.8;

	-webkit-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	-moz-box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
	box-shadow: 7px 6px 26px -3px rgba(0,0,0,0.43);
`;

const ButtonGroup = styled.div`
	display: inline-flex;
	position: absolute;
	top: 0px;
	right: 0px;
	border: none;
	line-height: 38px;
	vertical-align: top;

	& > button {
		border: none;
	};
`;

const HeaderBar = styled.div`
	display: block;
	line-height: 38px;
	background-color: #DCDCDC;
`;

const DragHandle = styled.strong`
	cursor: move !important;
`;


const Card = ({children, id, handleStop, handleDrag, removeCard}) => {
	return (
		<Draggable id={id} onStop={handleStop} onDrag={handleDrag} bounds="body" handle="strong" >			
				<Wrapper>
					<HeaderBar>
						<DragHandle className="cursor"><div>Card # {id}</div></DragHandle>
						<ButtonGroup>
							<button className='btn btn-outline-dark material-icons'>thumb_up</button>
							<button className='btn btn-outline-dark material-icons'>thumb_down</button>
							<button className='btn btn-outline-dark material-icons' onClick={removeCard}>clear</button>
						</ButtonGroup>						
					</HeaderBar>					
					{children}
				</Wrapper>
		</Draggable>
	)

};

export default Card;
import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
	position: relative;	
	min-height: 140px;
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

const VoteResult = styled.div`
	color: ${({ negative }) => negative ? 'red': 'inherit'}; 
	margin: 0px 3px;
`;

const InputTextArea = styled.textarea`
	margin: 10px;
	width: 90%;
`;

const Card = (props) => {
	const {id, removeCard, toggleFavourite, favourite, vote = 0, addVote, handleChange, value} = props;

	return (
		<Wrapper>
			<HeaderBar>
				<ButtonGroup style={{ left: '0px' }}>
					<button className='btn btn-outline-dark material-icons'
						onClick={toggleFavourite}
					>
						{favourite === true ? 'favorite' : 'favorite_border'}
					</button>
				</ButtonGroup>
				<DragHandle className="cursor"><div>Card # {id}</div></DragHandle>
				<ButtonGroup style={{ right: '0px' }}>
					<button className='btn btn-outline-dark material-icons' onClick={() => addVote(1)}>thumb_up</button>
					<VoteResult negative={vote < 0}>{vote}</VoteResult>
					<button className='btn btn-outline-dark material-icons' onClick={() => addVote(-1)}>thumb_down</button>
					<button className='btn btn-outline-dark material-icons' onClick={removeCard}>clear</button>
				</ButtonGroup>						
			</HeaderBar>					
			<InputTextArea value={value} onChange={handleChange} rows={3} />
		</Wrapper>
	)
};

export default Card;
import React, { Component } from 'react';
import styled from 'styled-components';
import sanitize from '../utils/ftfy_profanity';

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

class Card extends Component {

	constructor(props){
		super(props);
		this.state = {
			text: props.value || '',
		}
	}

	handleChange = (e) => {
		const newValue = sanitize(e.target.value);
		this.props.socket.emit('message', newValue);
		this.setState({
			text: newValue,
		});

		//TODO: Debounce and save
	}	

	render() {

		const {id, removeCard, toggleFavourite, favourite, vote = 0, addVote} = this.props;

		const { text } = this.state;

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
						<button className='btn btn-outline-dark material-icons' onClick={() => addVote(-1)}>thumb_down</button>
						<VoteResult negative={Math.sign(vote) < 0}>{vote}</VoteResult>
						<button className='btn btn-outline-dark material-icons' onClick={removeCard}>clear</button>
					</ButtonGroup>						
				</HeaderBar>					
				<InputTextArea value={text} onChange={this.handleChange} rows={3} />
			</Wrapper>
		);
	}
	
}

export default Card;
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import sanitize from '../utils/ftfy_profanity';
import CommentsSlideOut from './CommentsSlideOut';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;	
	min-height: 160px;
 	background: ${({ bkgColor }) => bkgColor};
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
	border: none;
	line-height: 38px;
	vertical-align: top;

	& > button {
		border: none;
	};
`;

const HeaderBar = styled.div`
	display: flex;
	justify-content: space-between;
	line-height: 38px;
	background-color: transparent;
	color: #fff;
	padding: 5px;
`;

const DragHandle = styled.strong`
	cursor: move !important;
`;

const VoteResult = styled.div`
	color: ${({ negative }) => negative ? 'red': 'inherit'}; 
	margin: 0px 3px;
`;

const InputTextArea = styled.textarea`
	padding: 0.5em;
	opacity: 0.8;
`;

const CardBottom = styled.div`
	position: relative;
	padding: 5px;
`;

const BottomToggle = styled.div`
	display: flex;
	line-height: 24px;
	justify-content: space-between;
	vertical-align: middle;
	font-size: 16px;

	& > button {
		border: none;
	};
`;

const CommentsBubbleIcon = styled.i`
	font-size: 16px;
	margin-right: 0.5em;
`;

const CardTextWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-grow: 1;
`;

const CardTextDiv = styled.div`
	padding: 0.5em;
	text-align: left;
	flex-grow: 1;
	padding-right: 3em;
	background: rgba(0,0,0,0.1);
	min-height: 90px;
	color: #fff;
`;

const CardSaveButton = styled.button`
	border: none;
`;

const EditLink = styled.a`
	font-size: 21px;
	color: #fff;
	position: absolute;
	top: 10px;
	right: 10px;

	&:hover {
		color: rgba(0,0,0,0.5);
		text-decoration: none;
	};

	&:focus {
		color: rgba(0,0,0,0.5);
		text-decoration: none;
	};
`;

class Card extends Component {

	constructor(props){
		super(props);
		this.state = {
			text: props.value || '',
			isShowComments: false,
			isEditable: props.value ? false : true,
		}
	}

	static propTypes = {
		id: PropTypes.string,
		bkgColor: PropTypes.string,
		favourite: PropTypes.bool,
		vote: PropTypes.number,
		toggleFavourite: PropTypes.func,
		addVote: PropTypes.func,
		comments: PropTypes.arrayOf(PropTypes.object),
		createComment: PropTypes.func,
		deleteComment: PropTypes.func,
		removeCard: PropTypes.func,
		isEditable: PropTypes.bool,
	}

	static defaultProps = {
		vote: 0,
		comments: [],
		favourite: false,
		isEditable: true,
	};

	/*
	static getDerivedStateFromProps(nextProps, prevState) {
		console.log('in dervied', nextProps);
		if (prevState.isEditable !== nextProps.isEditable) {
			return {
				isEditable: nextProps.isEditable
			};
		}
	
		// Return null to indicate no change to state.
		return null;
	}*/

	handleChange = (e) => {

		const { id } = this.props;

		const newValue = sanitize(e.target.value);
		
		this.props.socket.emit('message', {
			text: newValue,
			id
		});
		this.setState({
			text: newValue,
		});

		//TODO: Debounce and save
	}	

	handleSaveCard = (e) => {
		const { id, listId } = this.props;
		const { text } = this.state;

		this.props.finalizeCard(text);
		this.props.socket.emit('save', {
			text,
			id,
			listId
		});
		this.setState({
			isEditable: false,
		});
	}

	toggleShowComments = () => {
		this.setState( prevState => ({
			isShowComments: !prevState.isShowComments,
		}));
	}

	handleEditLinkClick = e => {
		e.preventDefault();
		this.setState({
			isEditable: true,
		});
	}

	render() {

		const {id, title, bkgColor, removeCard, toggleFavourite, favourite, vote = 0, addVote, comments = [], createComment, deleteComment} = this.props;

		const { text, isShowComments, isEditable } = this.state;
		console.log(title);
		return (
			<Wrapper bkgColor={bkgColor}>
				<HeaderBar>
					<ButtonGroup>
						<button className='btn btn-outline-light material-icons'
							onClick={toggleFavourite}
						>
							{favourite === true ? 'favorite' : 'favorite_border'}
						</button>
					</ButtonGroup>
					<DragHandle className="cursor"><div>{title}</div></DragHandle>
					<ButtonGroup>
						<button className='btn btn-outline-light material-icons' onClick={() => addVote(1)}>thumb_up</button>
						<button className='btn btn-outline-light material-icons' onClick={() => addVote(-1)}>thumb_down</button>
						<VoteResult negative={Math.sign(vote) < 0}>{vote}</VoteResult>
						<button className='btn btn-outline-light material-icons' onClick={removeCard}>clear</button>
					</ButtonGroup>						
				</HeaderBar>	
				<CardTextWrapper>		
					{isEditable ? <InputTextArea value={text} onChange={this.handleChange} rows={3} /> 
						: 
					<CardTextDiv>
						{text}
						<EditLink 
							href='' 
							className='material-icons'
							onClick={this.handleEditLinkClick}
						>
							edit
						</EditLink>
					</CardTextDiv>}						
					<CardBottom>
						<BottomToggle>
							{isEditable ? <CardSaveButton className='btn btn-outline-light material-icons' onClick={this.handleSaveCard}>save</CardSaveButton> : <div></div>	}
							{!isEditable ? <button onClick={this.toggleShowComments} className='btn btn-outline-light'>
								<CommentsBubbleIcon className='material-icons'>{isShowComments ? 'chat_bubble' : 'chat_bubble_outline'}</CommentsBubbleIcon> 
								<span>{comments.length}</span>
							</button> : <div></div>}
						</BottomToggle>
						{isShowComments && <CommentsSlideOut comments={comments} createComment={createComment} deleteComment={deleteComment} />}
					</CardBottom>
				</CardTextWrapper>					
			</Wrapper>
		);
	}
	
}

export default Card;
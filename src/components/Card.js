import React, { Component } from 'react';
import styled from 'styled-components';
import sanitize from '../utils/ftfy_profanity';
import CommentsSlideOut from './CommentsSlideOut';

const Wrapper = styled.div`
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
	width: 98%;
	margin: 5px;
	margin-bottom: 30px;
`;

const CommentsBlock = styled.div`
	position: relative;
	padding: 5px;
	padding-top: 0px;
`;

const CommentsShowToggle = styled.div`
	display: flex;
	align-items: center;
	line-height: 24px;
	justify-content: flex-end;
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
`;

const CardTextDiv = styled.div`
	padding: 10px;
	text-align: left;
	height: 100%;
`;

const CardSaveButton = styled.button`
	position: absolute;
	bottom: 0px;
	left: 0px;
	border: none;
`;

class Card extends Component {

	constructor(props){
		super(props);
		this.state = {
			text: props.value || '',
			isShowComments: false,
		}
	}

	handleChange = (e) => {
		const newValue = sanitize(e.target.value);
		this.setState({
			text: newValue,
		});

		//TODO: Debounce and save
	}	

	handleSaveCard = (e) => {
		this.props.finalizeCard(this.state.text);
	}

	toggleShowComments = () => {
		this.setState( prevState => ({
			isShowComments: !prevState.isShowComments,
		}));
	}

	render() {

		const {id, removeCard, toggleFavourite, favourite, vote = 0, addVote, bkgColor, comments = [], createComment, deleteComment} = this.props;

		const { text, isShowComments } = this.state;

		return (
			<Wrapper bkgColor={bkgColor}>
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
				<CardTextWrapper>		
				{ !this.props.value ?
					<React.Fragment>
						<InputTextArea value={text} onChange={this.handleChange} rows={3} />
						
					</React.Fragment>
				:
					<React.Fragment>
						<CardTextDiv>{text}</CardTextDiv>
						<CommentsBlock>
							<CommentsShowToggle>
								<button onClick={this.toggleShowComments} className='btn btn-outline-dark'>
									<CommentsBubbleIcon className='material-icons'>{isShowComments ? 'chat_bubble' : 'chat_bubble_outline'}</CommentsBubbleIcon> 
									<span>{comments.length}</span>
								</button>
							</CommentsShowToggle>
							{isShowComments && <CommentsSlideOut comments={comments} createComment={createComment} deleteComment={deleteComment} />}
						</CommentsBlock>
					</React.Fragment>	
				}				
				</CardTextWrapper>	
				{!this.props.value && <CardSaveButton className='btn btn-outline-dark material-icons' onClick={this.handleSaveCard}>save</CardSaveButton>}		
			</Wrapper>
		);
	}
	
}

export default Card;
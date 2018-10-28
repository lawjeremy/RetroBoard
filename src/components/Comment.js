import React from 'react';
import styled from 'styled-components';
import uniqid from 'uniqid';
import PropTypes from 'prop-types';

const CommentDiv = styled.div`
	position: relative;
	margin-bottom: 5px;
	width: 100%;
	background: rgba(0, 0, 0, 0.2);
	text-align: left;
	padding: 3px;
	color: #fff;

	&:nth-child(2n) {
		background: rgba(0, 0, 0, 0.4);
	}
`;

const DeleteLink = styled.a`
	font-size: 21px;
	color: #fff;
	position: absolute;
	top: 5px;
	right: 5px;

	&:hover {
		color: rgba(0,0,0,0.5);
		text-decoration: none;

		&+div {
			text-decoration: underline;
		}
	};

	&:focus {
		color: rgba(0,0,0,0.5);
		text-decoration: none;
	};	
`;

const CommentInput = styled.input`	
	margin-bottom: 5px;
	width: 100%;
	padding: 3px;
	opacity: 0.6;
	outline: none;
	border: none;
`;

const genUid = () => {
	return uniqid();
}

class Comment extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
		};
	}

	static propTypes = {
		id: PropTypes.string,
		value: PropTypes.string,
		isEditable: PropTypes.bool,
		createComment: PropTypes.func,
		deleteComment: PropTypes.func,
	}

	static defaultProps = {
		isEditable: false,
	}

	keyPress = (e) => {
		if(e.keyCode === 13){
		   this.props.createComment(genUid(), this.state.value);
		   this.setState({
			   value: '',
		   });
		}
	}

	handleChange = e => {
		this.setState({
			value: e.target.value,
		});
	}

	handleDeleteLink = e => {
		e.preventDefault();
		console.log(this.props);
		this.props.deleteComment(this.props.id)
	}

	render() {
		const { isEditable } = this.props;
		const { value } = this.state;
		if (isEditable) {
			return (
				<CommentInput 
					value={value} 
					placeholder='Write something...'
					onKeyDown={this.keyPress}
					onChange={this.handleChange}
				/>
			)
		} else {
			// comment has been created
			return (
				<CommentDiv>					
					<DeleteLink 
						href='' 
						className='material-icons'
						onClick={this.handleDeleteLink}
					>
						delete_forever
					</DeleteLink>
					<div>{value}</div>
				</CommentDiv>
			)
		}
	}
	
}

export default Comment;
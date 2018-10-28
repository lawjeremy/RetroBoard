import React from 'react';
import styled from 'styled-components';

const LegendPullOut = styled.div`
	font-family: "Lato", sans-serif;
	position: fixed;
	left: 0px;
	top: 0px;
	border: 1px solid #000;
	padding: 5px 0px;
	height: 100vh;
	transition: 0.5s;
	background: #000;	
	width: ${({ focusLegend }) => focusLegend ? '300px' : '0px'};
	overflow-x: hidden;
	z-index: 1;
	color: #F5E9E2;
	opacity: 0.9;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 0px;
	right: 0px;
`;

const Ul = styled.ul`
	list-style-type: none;
	padding-left: 10px;
	text-align: left;	
	width: 300px;	
`;

const Li = styled.li`
	vertical-align: top;
	display: flex;
	align-items: center;
	transition: 0.3s;
	line-height: 44px;
	& > span {
		margin-left: 10px;
	}
`;

const LegendButton = styled.button`
	position: fixed;
	top: 50%;
	left: ${({ focusLegend }) => focusLegend ? '300px' : '0px'};
	height: 100px;
	border: none;
	outline: none !important;
	transition: 0.5s;
	background: #000;
	color: #F5E9E2;
	opacity: 0.9;
	border-radius: 0px 10px 10px 0px;
`;

const Content = styled.div`
	display: ${({ focusLegend }) => focusLegend ? 'block' : 'none'};
	transition: 0.3s;	
`;

export default class LegendSlideOut extends React.PureComponent {
	
	constructor(props) {
		super(props);
		this.state = {
			focusLegend: false,
		};
	}
	
	handleLegendFocus = () => {
		this.setState(prevState => ({
			focusLegend: true,
		}));
	}

	handleLegendBlur = () => {
		this.setState(prevState => ({
			focusLegend: false,
		}));
	}

	render() {
		const {focusLegend} = this.state;
		return (
			<React.Fragment>
				<LegendPullOut focusLegend={focusLegend}>	
					<CloseButton className='btn btn-outline-light material-icons'>close</CloseButton>			
					<Content focusLegend={focusLegend}>
					<h2>Legend</h2>
					<hr></hr>
					<Ul>
						<Li><i className='material-icons'>star</i><span> pin card (not draggable)</span></Li>
						<Li><i className='material-icons'>thumb_up</i><span> upvote</span></Li>
						<Li><i className='material-icons'>thumb_down</i><span> downvote</span></Li>
						<Li><i className='material-icons'>edit</i><span> edit card [or double click]</span></Li>
						<Li><i className='material-icons'>close</i><span> delete card</span></Li>
						<Li><i className='material-icons'>chat_bubble_outline</i><span> toggle comments</span></Li>
					</Ul>
					</Content>
				</LegendPullOut>
				<LegendButton focusLegend={focusLegend} className='material-icons' onFocus={this.handleLegendFocus} onBlur={this.handleLegendBlur}>arrow_forward_ios</LegendButton>
			</React.Fragment>
		)
	}


}
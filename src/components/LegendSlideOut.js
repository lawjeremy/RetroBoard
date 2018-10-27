import React from 'react';
import styled from 'styled-components';

const LegendPullOut = styled.div`
	position: absolute;
	top: 50%;
	left: ${({ focusLegend }) => focusLegend ? '0px' : '-200px'};
	border: 1px solid #000;
	padding: 5px 20px;
	width: 200px;
	height: 300px;
	transition: all 1s;
	background: lightgrey;
`;

const Ul = styled.ul`
	list-style-type: none;
	padding-left: 0px;
	text-align: left;
`;

const Li = styled.li`
	vertical-align: top;
`;

const LegendButton = styled.button`
	/* Safari */
	-webkit-transform: rotate(-90deg);

	/* Firefox */
	-moz-transform: rotate(-90deg);

	/* IE */
	-ms-transform: rotate(-90deg);

	/* Opera */
	-o-transform: rotate(-90deg);
	position: absolute;
	right: -50px;
	top: 50%;

	border: 1px solid;
	border-top: none;
	outline: none !important;
	background: lightgrey;
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
			focusLegend: !prevState.focusLegend,
		}));
	}
	render() {
		const {focusLegend} = this.state;
		return (
			<LegendPullOut focusLegend={focusLegend}>
				<LegendButton onClick={this.handleLegendFocus}>Legend</LegendButton>
				<Ul>
					<Li><i className='material-icons'>star</i> pin card (not draggable)</Li>
					<Li><i className='material-icons'>thumb_up</i> upvote</Li>
					<Li><i className='material-icons'>thumb_down</i> downvote</Li>
				</Ul>
			</LegendPullOut>
		)
	}


}
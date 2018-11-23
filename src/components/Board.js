import React from 'react';
import { socketConnect } from 'socket.io-react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';
import sanitize from '../utils/ftfy_profanity';
import { fetch, save } from '../data/comment';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import LegendSlideOut from './LegendSlideOut';
import ColorPicker from './ColorPicker';
import ChangeableText from './ChangeableText';

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: row;
	position: relative;
	margin-top: 80px;
`;

const Ruler = styled.hr`
    width: 100%;
`;

const AddCardButton = styled.button`
	margin: 0px auto;
	margin-bottom: 20px;
	display: inline-flex;
	vertical-align: middle;
  	align-items: center;
	
	& > i {
		vertical-align: middle;
		font-size: 18px;
		margin-left: 5px;
	}
`;

const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour if dragging
	opacity: isDragging ? 0.5 : 1,

	// styles we need to apply on draggables
	marginBottom: 10,
    ...draggableStyle
});

const getListStyle = (bkgColor, isDraggingOver) => ({
	border: `2px solid ${isDraggingOver ? 'black' : 'transparent'}`,
	// background: '#FFF',
	width: 500,
	padding: 5,
});

// refactor
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

// refactor
/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

/**
 * Returns a default card object
 */
const genBlankCard = (author) => {
	return {
		id: uniqid(),
		text: '',
		author,
		votes: 0,
		isFavourite: false,
		comments: [],
	};
}

class Board extends React.PureComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			lists: [
				{
					droppableId: 'droppable1',
					listId: 'list1',
					title: 'Went Well', 
					bkgColor: "#111D13",
				},
				{
					droppableId: 'droppable2',
					listId: 'list2',
					title: 'To Improve',
					bkgColor: '#744253',
				},
				{
					droppableId: 'droppable3',
					listId: 'list3',
					title: 'Action Items',
					bkgColor: '#465775',
				},
				{
					droppableId: 'droppable4',
					listId: 'list4',
					title: 'List 4',
					bkgColor: '#465775',
				},
			],
			query: this.props.searchContent ? this.props.searchContent : '',
		}
	}	

	static propTypes = {

		searchContent: PropTypes.string,

		/* describes the board and its vertical columns */
		meta: PropTypes.shape({
			board_id: PropTypes.string.isRequired,	// unique-id of board
			board_name: PropTypes.string,
			lists: PropTypes.arrayOf(
				PropTypes.shape({
					droppableId: PropTypes.string,	// local id to assign to "column"
					listId: PropTypes.string,		// name of list in state
					title: PropTypes.string.isRequired,	// title of "column"
					bkgColor: PropTypes.string,		// hex colour for background of "column"
				})
			)
		}),
		/* describes the list of Card contents */
		content: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string.isRequired,	// unique-id of content (card) item
				text: PropTypes.string,				// card text
				votes: PropTypes.number,			// vote score
				isFavourite: PropTypes.bool,		// is favourite?
				commentsRef: PropTypes.arrayOf({	// an array of comments refs
					id: PropTypes.string,
				}),
				createDate: PropTypes.instanceOf(Date),
			})
		),
		/* describes the list of comments that are attached to Cards */
		comments: PropTypes.arrayOf(				// array of comments objects
			PropTypes.shape({
				id: PropTypes.string.isRequired,
				text: PropTypes.string,
				createDate: PropTypes.instanceOf(Date),
			})
		),											
	}

	async componentDidMount(){

		const { socket, searchContent } = this.props;
		// for live data:
		/*
		props.content filtered into 3 lists and then pushed on state as list1, list2, list3, etc.
		*/
		let newState = {}

		socket.on('connected', (cards) => {
			
			cards.forEach(card => {
				if (card.id) {
					if (!newState[card.listId]) {
						newState[card.listId] = [];
					}
					newState[card.listId].push(card);
				}
			});
			this.setState(newState);
		});

		socket.on('message return', (msg) => {
			console.log(msg);
		});
		const cards = JSON.parse(localStorage.getItem('card')) || [];
   		this.setState({ cards: cards, allCards: cards})

	}

	componentDidUpdate = (props) => {
		this.handleSearch(props.searchContent);
	}	
	
	onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
		}
		
		const { lists } = this.state;

        if (source.droppableId === destination.droppableId) {
			// move in same column
			const items = reorder(
                this.getList(this.state, source.droppableId),
                source.index,
                destination.index
			);
			let copiedState = Object.assign({}, this.state);						
			copiedState[lists.filter( item => item.droppableId === source.droppableId ).pop()['listId']] = items;
            this.setState(copiedState);
        } else {
			// move from one column to another
            const result = move(
                this.getList(this.state, source.droppableId),
                this.getList(this.state, destination.droppableId),
                source,
                destination
			);
			const newState = {}
			lists.forEach(listItem => {
				if (result[listItem.droppableId]) {
					newState[listItem.listId] = result[listItem.droppableId]
				}
			});
			this.setState(newState);
        }
	};

	// pushes a comment onto a Card
	// existing state & comment list is cloned, with comment added.
	createComment = card_id => (id, text) => {
		this.setState(prevState => ({
			list1: prevState.list1.map(item => ({ ...item, comments: item.id === card_id ? [...item.comments, { id, text }] : item.comments.slice() })),
			list2: prevState.list2.map(item => ({ ...item, comments: item.id === card_id ? [...item.comments, { id, text }] : item.comments.slice() })),
			list3: prevState.list3.map(item => ({ ...item, comments: item.id === card_id ? [...item.comments, { id, text }] : item.comments.slice() })),
		}));
	}
	deleteComment = card_id => id => {
		this.setState(prevState => ({
			list1: prevState.list1.map(item => ({ ...item, comments: item.id === card_id ? item.comments.filter(elem => elem.id !== id) : item.comments.slice() })),
			list2: prevState.list2.map(item => ({ ...item, comments: item.id === card_id ? item.comments.filter(elem => elem.id !== id) : item.comments.slice() })),
			list3: prevState.list3.map(item => ({ ...item, comments: item.id === card_id ? item.comments.filter(elem => elem.id !== id) : item.comments.slice() })),
		}));
	}
	
	// pushes a card onto state
	addCard = (droppableId, author) => {
		
		const newCard = genBlankCard(author);

		this.setState(prevState => {
			const contentCol = this.getList(prevState, droppableId).slice();
			contentCol.push(newCard);
			return {
				[this.droppableIds[droppableId]]: contentCol,
			}
		});
	}

	// returns new state that has Card with id removed.
	// todo: dynamic lists/ columns?
	removeCard = id => () => {
		const { socket } = this.props;
		socket.emit('remove', id);
		this.removeCardById(id);
	}

	finalizeCard = id => text => {
		this.updateCardById(id, 'text', text);
	}

	toggleFavourite = id => value => {
		this.updateCardById(id, 'favourite', value);
	}

	addVote = id => value => {
		this.updateCardById(id, 'vote', value);
	}

	// finds the content card by id,
	// updates the field to the given value
	updateCardById = (id, field, value) => {
		this.setState(prevState => {
			const { lists = [] } = prevState;
			// iterate through each list, and each item in list, build new state
			const newState = lists.reduce( (accum, listItem) =>
				accum[listItem.listId] = prevState[listItem.listId].map( contentItem => 
					({ ...contentItem, [field]: contentItem.id === id ? value : contentItem[field] })
				), {}
			)
			return newState;
		});
	}

	removeCardById = id => {
		this.setState(prevState => {
			const { lists = [] } = prevState;
			// iterate through each list, and each item in list, build new state
			const newState = lists.reduce( (accum, listItem) =>
				accum[listItem.listId] = prevState[listItem.listId].filter( contentItem => contentItem.id !== id )
				, {}
			)
			return newState;
		});
	}

	handleSearch = (data) => {
		// console.log("Our App knows the query: " + data);
		// let cards = this.state.lists.filter((list) => {
		// 	return list.title.includes(query) || list.body.includes(query)
		// });
		// this.setState({lists: cards});
	}

	handleChangeBkgColor = listId => bkgColor => {
		this.setState(prevState => ({
			lists: prevState.lists.map(item => ({ ...item, bkgColor: item.listId === listId ? bkgColor.hex : item.bkgColor  })),
		}));
	}

	handleTitleChange = listId => title => {
		this.setState(prevState => ({
			lists: prevState.lists.map(item => ({ ...item, title: item.listId === listId ? title : item.title  })),
		}));
	}

	droppableIds = {
        droppable1: 'list1',
        droppable2: 'list2',
        droppable3: 'list3'
    };

	getList = (state, id) => state[state.lists.filter(item => item.droppableId === id).pop()['listId']];
	
	render() {

		const { lists } = this.state; 
		const { socket, userName } = this.props;
		
		return (
			<Wrapper>
			<DragDropContext onDragEnd={this.onDragEnd}>
				{lists.map((list, listIndex) => (
					<Droppable
						key={'list-droppable-' + listIndex}
						droppableId={list.droppableId}>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								style={getListStyle(
									list.bkgColor,
									snapshot.isDraggingOver
								)}>
								<h2 className="display-4">
									<ChangeableText 
										value={list.title} 
										handleChange={this.handleTitleChange(list.listId)} 
									/>
									<ColorPicker 
										bkgColor={list.bkgColor} 
										handleChangeBkgColor={this.handleChangeBkgColor(list.listId)} 
									/>
								</h2>
								
								
           						<Ruler className="my-4" />
								<AddCardButton className="btn btn-outline-secondary btn-lg" onClick={() => this.addCard(list.droppableId, userName)}>
									Add card <i className="material-icons">add_circle_outline</i>					
								</AddCardButton>
								{this.state[list.listId] && this.state[list.listId].map(
									(item, index) => (
										<Draggable
											key={item.id}
											draggableId={item.id}
											index={index}
											isDragDisabled={item.favourite}>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}														
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													style={getItemStyle(
														snapshot.isDragging,
														provided.draggableProps.style
													)}
												>
													<Card 
														id={item.id}
														listId={list.listId}
														value={item.text}
														removeCard={this.removeCard(item.id)}
														finalizeCard={this.finalizeCard(item.id)}
														toggleFavourite={this.toggleFavourite(item.id)}
														favourite={item.favourite}
														vote={item.vote}
														socket={socket}
														addVote={this.addVote(item.id)}
														bkgColor={list.bkgColor}
														createComment={this.createComment(item.id)}
														deleteComment={this.deleteComment(item.id)}
														comments={item.comments}
														author={item.author}
													/>
												</div>
											)}
										</Draggable>
									)
								)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				))}
			</DragDropContext>
			<LegendSlideOut />
			</Wrapper>
		);
	}
};

export default socketConnect(Board);


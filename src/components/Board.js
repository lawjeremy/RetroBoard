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

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: row;
	background: #FBF5F3;
	position: relative;
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
const default_Card = () => {
	return {
		id: uniqid(),
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
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
					bkgColor: "#111D13"
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
			],
			list1: [],
			list2: [],
			list3: [],
			counter: 6,
			query: props.search,
			focusLegend: false,
		}

	}	

	static propTypes = {

		search: PropTypes.string,

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

		const { socket } = this.props;

		// stub: test data!
		// this.addCard(this.state.lists[0].droppableId);
		// this.addCard(this.state.lists[0].droppableId);
		// this.addCard(this.state.lists[1].droppableId);
		// this.addCard(this.state.lists[1].droppableId);
		// this.addCard(this.state.lists[2].droppableId);
		// this.addCard(this.state.lists[2].droppableId);		

		// for live data:
		/*
		props.content filtered into 3 lists and then pushed on state as list1, list2, list3, etc.
		*/
		let lists = {list1: [], list2: [], list3: []};

		socket.on('connected', (cards) => {
			cards.map((card) => {
				if(card.id){
					lists[card.listId].push(card);
					console.log(card);
				}
			});
			this.setState({
				list1: lists.list1,
				list2: lists.list2,
				list3: lists.list3
			});
		});

		socket.on('message return', (msg) => {
			console.log(msg);
		});

		const cards = JSON.parse(localStorage.getItem('card')) || [];
   		this.setState({ cards: cards, allCards: cards})

	}

	componentDidUpdate = (props) => {
		this.handleSearch(props.query);
	}

	syncBoard = async () => {
		// tood
		// pseudo code:
		// 1. fetch content (Cards) from back-end
		// 		does ui and server keep track of last delta date, hash of data to do compare?
		// 2. merge content on state with content from fetch
		// 3. re-remder 
	}
	
	onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(this.state, source.droppableId),
                source.index,
                destination.index
            );

            let copiedState = Object.assign({}, this.state);

            if (source.droppableId === 'droppable1') {
                copiedState.list1 = items;
            } else if (source.droppableId === 'droppable2') {
                copiedState.list2 = items;
            } else if (source.droppableId === 'droppable3') {
                copiedState.list3 = items;
            }

            this.setState(copiedState);
        } else {
            const result = move(
                this.getList(this.state, source.droppableId),
                this.getList(this.state, destination.droppableId),
                source,
                destination
            );

            console.warn('result', result);
            this.setState({
                list1: result.droppable1 ? result.droppable1 : this.state.list1,
                list2: result.droppable2 ? result.droppable2 : this.state.list2,
                list3: result.droppable3 ? result.droppable3 : this.state.list3
            });
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
	addCard = (droppableId, card = default_Card()) => {
		
		this.setState(prevState => {
			const contentCol = this.getList(prevState, droppableId).slice();
			contentCol.push(card);
			return {
				[this.droppableIds[droppableId]]: contentCol,
				counter: prevState.counter+1,
			}
		});
	}

	// returns new state that has Card with id removed.
	// todo: dynamic lists/ columns?
	removeCard = id => () => {

		const { socket } = this.props;

		socket.emit('remove', id);

		this.setState(prevState => ({
			list1: prevState.list1.filter(item => item.id !== id),
			list2: prevState.list2.filter(item => item.id !== id),
			list3: prevState.list3.filter(item => item.id !== id),
		}));
	}

	finalizeCard = id => text => {
		this.setState(prevState => ({
			list1: prevState.list1.map(item => ({ ...item, text: item.id === id ? text : item.text })),
			list2: prevState.list2.map(item => ({ ...item, text: item.id === id ? text : item.text })),
			list3: prevState.list3.map(item => ({ ...item, text: item.id === id ? text : item.text })),
		}));
	}

	toggleFavourite = id => () => {
		this.setState(prevState => ({
			list1: prevState.list1.map(item => ({ ...item, favourite: item.id === id ? !item.favourite : item.favourite })),
			list2: prevState.list2.map(item => ({ ...item, favourite: item.id === id ? !item.favourite : item.favourite })),
			list3: prevState.list3.map(item => ({ ...item, favourite: item.id === id ? !item.favourite : item.favourite })),
		}));
	}

	// todo: refactor
	// Card should be converted to be a stateful component with a handleChange func, a debounce call should update the persistent store
	handleChange = id => e => {
		const newValue = sanitize(e.target.value);
		this.setState(prevState => ({
			list1: prevState.list1.map(item => ({ ...item, text: item.id === id ? newValue : item.text })),
			list2: prevState.list2.map(item => ({ ...item, text: item.id === id ? newValue : item.text })),
			list3: prevState.list3.map(item => ({ ...item, text: item.id === id ? newValue : item.text })),
		}));
	}	

	addVote = id => inc => {
		this.setState(prevState => ({
			list1: prevState.list1.map(item => ({ ...item, vote: item.id === id ? (item.vote ? item.vote : 0) + inc : item.vote })),
			list2: prevState.list2.map(item => ({ ...item, vote: item.id === id ? (item.vote ? item.vote : 0) + inc : item.vote })),
			list3: prevState.list3.map(item => ({ ...item, vote: item.id === id ? (item.vote ? item.vote : 0) + inc : item.vote })),
		}));
	}

	handleSearch = query => () => {
		console.log("Our App knows the query: " + query);
		let cards = this.state.lists.filter((list) => {
			return list.title.includes(query) || list.body.includes(query)
		  });
		  this.setState({lists: cards});
	}

	droppableIds = {
        droppable1: 'list1',
        droppable2: 'list2',
        droppable3: 'list3'
    };

	getList = (state, id) => state[this.droppableIds[id]];
	
	render() {

		const { lists, focusLegend } = this.state; 
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
								<h2 className="display-4">{list.title}</h2>
           						<Ruler className="my-4" />
								<AddCardButton className="btn btn-outline-secondary btn-lg" onClick={() => this.addCard(list.droppableId)}>
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
														handleChange={this.handleChange(item.id)} 
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
														title={`${userName} says:`}
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


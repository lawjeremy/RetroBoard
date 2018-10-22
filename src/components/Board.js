import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';
import sanitize from '../utils/ftfy_profanity';
import { fetch, save } from '../data/comment';

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: row;
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
	background: bkgColor ? bkgColor : 'transparent',
	width: 500,
	padding: 5,
	height: '100vh',
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

export default class Board extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			lists: [
				{
					droppableId: 'droppable1',
					listId: 'list1',
					title: 'To Do', 
					bkgColor: "#EFD0CA"
				},
				{
					droppableId: 'droppable2',
					listId: 'list2',
					title: 'In Progress',
					bkgColor: '#C1BCAC',
				},
				{
					droppableId: 'droppable3',
					listId: 'list3',
					title: 'Done',
					bkgColor: '#979B8D',
				},
			],
			list1: [
				{ id: 0, text: "Test A"},
				{ id: 1, text: "Test B"}		
			],
			list2: [
				{ id: 2, text: "Test C"},
				{ id: 3, text: "Test D"},		
			],
			list3: [
				{ id: 4, text: "Test E"},
				{ id: 5, text: "Test F"},		
			],
			counter: 6,
		}
	}	

	async componentDidMount(){
		const comments = await fetch();
		comments.map((comment) => {
			this.addCard(1, comment.text)();
		});
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
	
	// pushes a card onto state
	addCard = (droppableId) => {
		this.setState(prevState => {
			const contentCol = this.getList(prevState, droppableId).slice();
			contentCol.push(
				{
					id: prevState.counter,
					text: '',
				}
			);
			return {
				[this.droppableIds[droppableId]]: contentCol,
				counter: prevState.counter+1,
			}
		});
	}

	// returns new state that has Card with id removed.
	// todo: dynamic lists/ columns?
	removeCard = id => () => {		
		this.setState(prevState => ({
			list1: prevState.list1.filter(item => item.id !== id),
			list2: prevState.list2.filter(item => item.id !== id),
			list3: prevState.list3.filter(item => item.id !== id),
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

	droppableIds = {
        droppable1: 'list1',
        droppable2: 'list2',
        droppable3: 'list3'
    };

	getList = (state, id) => state[this.droppableIds[id]];
	
	render() {

		const { lists } = this.state; 

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
											index={index}>
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
														value={item.text}
														removeCard={this.removeCard(item.id)}
														handleChange={this.handleChange(item.id)} 
														toggleFavourite={this.toggleFavourite(item.id)}
														favourite={item.favourite}
														vote={item.vote}
														addVote={this.addVote(item.id)}
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
			</Wrapper>
		);
	}
};


import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Board from './components/Board';
import Card from './components/Card';
import CardColumn from './components/CardColumn';
import arrayMove from 'array-move';
import sanitize from './utils/ftfy_profanity';
import { CARD_HEIGHT } from './constants'

const Wrapper = styled.div`
	min-height: 100vh;
	margin: 0px auto;
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

// refactor - move somewhere else
const calcNewCol = (x, col) => {
	const sign = Math.sign(x);
	const abs = Math.abs(x)
	// how many cards up or down are we moving?
	const inc = abs > 800 ? sign*2 : abs > 300 ? sign*1 : 0;	
	return col + inc;
}

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			content0: [
				{ id: 0, pos: 0, text: "Test A"},
				{ id: 1, pos: 1, text: "Test B"}		
			],
			content1: [
				{ id: 2, pos: 0, text: "Test C"},
				{ id: 3, pos: 1, text: "Test D"},		
			],
			content2: [
				{ id: 4, pos: 0, text: "Test E"},
				{ id: 5, pos: 1, text: "Test F"},		
			],
			columns: [
				{ id: 0, label: "To Do", bkgColor: "#EFD0CA", contentRef: 'content0' },
				{ id: 1, label: "In Progress", bkgColor: "#C1BCAC", contentRef: 'content1' },
				{ id: 2, label: "Done", bkgColor: "#979B8D", contentRef: 'content2' },
			],
			highlight: -1,
			rand: Math.random(),
			counter: 6,
		}
	}

	// index = pos in array, col = col index
	handleStop = (index, col) => (e, ui) => {		
		console.log(ui);
		const newCol = calcNewCol(ui.x, col);
		const fromColKey = `content${col}`;
		const toColKey = `content${newCol}`;

		this.setState(prevState => {			
			
			// some array surgery
			let fromContent = prevState[fromColKey].slice();
			let toContent = prevState[toColKey].slice();
			const contentItem = col !== newCol ? fromContent.splice(index,1).pop() : null;
			if (contentItem)
				toContent.push(contentItem)

			return {
				rand: Math.random(),	
				[fromColKey]: fromContent,
				[toColKey]: toContent,
				highlight: -1,
			};
		});
	}	

	// index = pos in array, col = col index
	// used to do border highlight
	handleDrag = (index, col) => (e, ui) => {			
		const newCol = calcNewCol(ui.x, col);
		this.setState(prevState => {		
			return {
				highlight: newCol !== col ? newCol : -1,
			};
		});
	}
	
	// pushes a card onto state
	addCard = (col) => () => {
		const contentCol = `content${col}`;
		this.setState(prevState => ({
			[contentCol]: [...prevState[contentCol],
				{
					id: prevState.counter,
					text: '',
				}
			],
			counter: prevState.counter+1,
		}));
	}

	removeCard = (index, col) => () => {
		const contentCol = `content${col}`;		
		this.setState(prevState => {
			const content = prevState[contentCol].slice();
			content.splice(index, 1);
			return {
				[contentCol]: content,
			};
		});
	}

	toggleFavourite = (index, col) => () => {
		const contentCol = `content${col}`;
		this.setState(prevState => {
			const content = prevState[contentCol].slice();
			content[index].favourite = !prevState[contentCol][index].favourite;
			return {
				[contentCol]: content,
			};
		});
	}

	// todo: refactor
	// Card should be converted to be a stateful component with a handleChange func, a debounce call should update the persistent store
	handleChange = (index, col) => (e) => {
		const newValue = sanitize(e.target.value);
		const contentCol = `content${col}`;
		this.setState(prevState => {
			const content = prevState[contentCol].slice();
			content[index].text = newValue;
			return {
				[contentCol]: content,
			};
		});
	}	

	addVote = (index, col) => (inc) => {
		const contentCol = `content${col}`;
		this.setState(prevState => {
			const content = prevState[contentCol].slice();
			content[index].vote = (content[index].vote ? content[index].vote : 0) + inc;
			return {
				[contentCol]: content,
			};
		});
	}

	render() {
		const { columns, rand, highlight } = this.state;
		// const sortedContent = content.sort( (a,b) => {
		// 	return a.pos - b.pos;
		// });

		return (
			<Wrapper className="App" key={rand}>   
				<Board>
					{columns.map( col => (
						<CardColumn key={col.id} id={col.id} label={col.label}  bkgColor={col.bkgColor} highlight={highlight === col.id}>    
						<AddCardButton className="btn btn-outline-secondary btn-lg" onClick={this.addCard(col.id)}>
							Add card <i className="material-icons">add_circle_outline</i>					
						</AddCardButton>
						{this.state[col.contentRef].map( (e, index) => (
							<Card 
								id={e.id}
								handleChange={this.handleChange(index, col.id)} 
								value={e.text}
								handleStop={this.handleStop(index, col.id)} 
								handleDrag={this.handleDrag(index, col.id)}
								removeCard={this.removeCard(index, col.id)}
								toggleFavourite={this.toggleFavourite(index, col.id)}
								favourite={e.favourite}
								vote={e.vote}
								addVote={this.addVote(index, col.id)}
							/>
						))}          
						</CardColumn>		
					))}					
				</Board>
			</Wrapper>
		);
	}
}

export default App;

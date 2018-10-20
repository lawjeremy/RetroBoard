import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Board from './components/Board';
import Card from './components/Card';
import CardColumn from './components/CardColumn';
import arrayMove from 'array-move';

const Wrapper = styled.div`
	min-height: 100vh;
`;

const AddCardButton = styled.button`
	margin-bottom: 10px;
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
			highlight: -1,
			rand: Math.random(),
		}
	}

	// index = pos in array, col = col index
	handleStop = (index, col) => (e, ui) => {		
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
					id: prevState.content.length,
					text: "Test"
				}
			]
		}));
	}

	render() {
		const { content0, content1, content2, rand, highlight } = this.state;
		// const sortedContent = content.sort( (a,b) => {
		// 	return a.pos - b.pos;
		// });

		return (
			<Wrapper className="App" key={rand}>    
				<Board>
					<CardColumn label="To Do" id={0} bkgColor='#444140' highlight={highlight === 0}>    
						<AddCardButton onClick={this.addCard(0)}>add Card</AddCardButton>
						{content0.map( (e, index) => (
							<Card 
								handleStop={this.handleStop(index, 0)} 
								handleDrag={this.handleDrag(index, 0)}
								id={e.id}>
									{e.text} #{e.id}
							</Card>
						))}          
					</CardColumn>
					<CardColumn label="In Progress" id={1} bkgColor='#FFA987' highlight={highlight === 1}>    
						<AddCardButton onClick={this.addCard(1)}>add Card</AddCardButton>
						{content1.map( (e, index) => (
							<Card 
								handleStop={this.handleStop(index, 1)} 
								handleDrag={this.handleDrag(index, 1)}
								id={e.id}>
									{e.text} #{e.id}
							</Card>
						))}          
					</CardColumn>
					<CardColumn label="Done" id={2} bkgColor='#E54B4B' highlight={highlight === 2}>    
						<AddCardButton onClick={this.addCard(2)}>add Card</AddCardButton>
						{content2.map( (e, index) => (
							<Card 
								handleStop={this.handleStop(index, 2)} 
								handleDrag={this.handleDrag(index, 2)}
								id={e.id}>
									{e.text} #{e.id}
							</Card>
						))}          
					</CardColumn>
				</Board>
			</Wrapper>
		);
	}
}

export default App;

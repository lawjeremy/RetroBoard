import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Card from './components/Card';
import CardColumn from './components/CardColumn';

const Wrapper = styled.div`
	min-height: 100vh;
`;

const AddCardButton = styled.button`
	margin-bottom: 10px;
`;


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			content: [{ id: 0, text: "Test"}],
			number: '',
		}
	}

	handleStop = (e, ui) => {
		console.log(ui);
	
	}
	
	
	// pushes a card onto state
	addCard = () => {
		this.setState(prevState => ({
			content: [...prevState.content,
				{
					id: prevState.content.length,
					text: "Test"
				}
			]
		}));
	}

	render() {
		console.log('im am reborn');
		const { content } = this.state;
		const sortedContent = content.sort( (a,b) => {
			return a.id - b.id;
		});

		return (
			<Wrapper className="App">    
				<CardColumn label="To Do" id={1}>    
				<AddCardButton onClick={this.addCard}>add Card</AddCardButton>
					{sortedContent.map( i => (
						<Card handleStop={this.handleStop} id={i.id}>{i.text} #{i.id}</Card>
					))}          
				</CardColumn>
			</Wrapper>
		);
	}
}

export default App;

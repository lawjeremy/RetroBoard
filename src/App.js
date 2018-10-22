import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Board from './components/Board';

const Wrapper = styled.div`
	min-height: 100vh;
	margin: 0px auto;
`;

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

	render() {
		const { columns, rand, highlight } = this.state;
		// const sortedContent = content.sort( (a,b) => {
		// 	return a.pos - b.pos;
		// });

		return (
			<Wrapper className="App" key={rand}>   
				<Board/>
			</Wrapper>
		);
	}
}

export default App;

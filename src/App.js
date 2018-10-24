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

	render() {
		return (
			<Wrapper className="App">   
				<Board />
			</Wrapper>
		);
	}
}

export default App;

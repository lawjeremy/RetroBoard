import React, { Component } from 'react';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Board from './components/Board';
import Header from './components/Header';
import Footer from './components/Footer';

const Wrapper = styled.div`
	min-height: 100vh;
	margin: 0px auto;
`;

const socket = io.connect('35.182.139.132:3000');
socket.on('connected', msg => console.log(msg));

class App extends Component {

	render() {
		return (
			<SocketProvider socket={socket}>
				<Wrapper className="App">   
					<Header/>
					<Board />
					<Footer/>
				</Wrapper>
			</SocketProvider>
		);
	}
}

export default App;

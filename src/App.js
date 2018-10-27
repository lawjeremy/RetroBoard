import React, { Component } from 'react';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Board from './components/Board';
import Header from './components/Header';
import Footer from './components/Footer';
import randomName from 'random-name';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 0px auto;
	min-height: 100vh;
`;

const socket = io.connect('35.182.139.132:3000');

const genTitle = () => {
	const titles = ['DJ', 'Señor', 'Sir', 'Sire', 'Your Grace', 'Master', 'The Honorable', 'Doctor', 'Captain', 'Colonel', 'Madam', 'Princess', 'Prince', 'Humperdink', 'Mayor']
	const rand = Math.floor( Math.random() * 15 );
	return titles[rand];
};

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			userName: ''
		};
	}
	componentDidMount(){
		this.setState({
			userName: `${genTitle()} ${randomName.last()}`
		});
	}

	render() {
		const { userName } = this.state
		return (
			<SocketProvider socket={socket}>
				<Wrapper className="App">   
					<Header userName={userName}/>
					<Board userName={userName} style={{ flexGrow: 1 }} />
					<Footer/>
				</Wrapper>
			</SocketProvider>
		);
	}
}

export default App;

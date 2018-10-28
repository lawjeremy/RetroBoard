import React, { Component } from 'react';
import { SocketProvider } from 'socket.io-react';
import PropTypes from 'prop-types';

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
	const titles = ['DJ', 'Señor', 'Sir', 'Sire', 'Your Grace', 'Master', 'The Honorable', 'Doctor', 'Captain', 'Colonel', 'Madam', 'Princess', 'Prince', 'Humperdink', 'Mayor', 'Security Chief', 'Darth', 'First Officer', 'Sheriff', 'Coach']
	const rand = Math.floor( Math.random() * 20 );
	return titles[rand];
};

export default class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			userName: '',
			query: '',
		};
	}

	static propTypes = {
		searchQuery: PropTypes.func,
	}

	componentDidMount(){
		this.setState({
			userName: `${genTitle()} ${randomName.last()}`
		});
	}

	// getQuery(data){
	// 	console.log(data);
	// 	this.setState({
	// 		query: data
	// 	});
	// }

	render() {
		const { userName, query } = this.state
		const { search } = this.props
		return (
			<SocketProvider socket={socket}>
				<Wrapper className="App">   
					<Header sendQuery={this.getQuery} userName={userName}/>
					<Board search={query} userName={userName} style={{ flexGrow: 1 }} />
					<Footer/>
				</Wrapper>
			</SocketProvider>
		);
	}
}


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
	margin-top: 100px;	
`;

const socket = io.connect('35.182.139.132:3000');

const genTitle = () => {
	const titles = ['DJ', 'Señor', 'Sir', 'Sire', 'Your Grace', 'Master', 'The Honorable', 'Doctor', 'Captain', 'Colonel', 'Madam', 'Princess', 'Prince', 'Humperdink', 'Mayor', 'Security Chief', 'Darth', 'First Officer', 'Sheriff', 'Coach']
	const rand = Math.floor( Math.random() * titles.length);
	return titles[rand];
};

export default class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			userName: '',
			query: '',
			show: false,
		};
	}

	componentDidMount(){
		this.setState({
			userName: `${genTitle()} ${randomName.last()}`
		});
	}

	handleClose = () => {
		this.setState({ show: false });
	}
	
	getQuery = (data) => {
		this.setState({
			query: data
		});
	}

	exportData = (cards) => {
		console.log('Im Here');
		// socket.on('connected', (cards) => {
		//Jeremy Note: this is the place we need dthe card data to filter through.
			// console.log('inside socket');
		const ArrayCards = cards.reduce((accum, e)=>{ 
			const cardText = `\n## Card Title (${e.vote})\n${e.text}\n`;
			return accum + cardText;
		}, '');

		this.setState({ 
			show: false,
			exportedData: ArrayCards,

		})
		// console.log(ArrayCards);
		window.prompt('test', ArrayCards);
		// });
	} 
	

	render() {
		const { userName, query, show, exportedData } = this.state
		console.log('App data: ', query);

		return (
			<SocketProvider socket={socket}>
				<Header handleExport={this.exportData} sendQuery={this.getQuery} userName={userName}/>
				<Wrapper className="App">  								
					<Board searchContent={query} userName={userName} style={{ flexGrow: 1 }} />					
					<Footer/>
				</Wrapper>
				{/* {show && (
					<div className="static-modal">
					<Modal.Dialog backdrop='static'>
						<Modal.Header>
						<Modal.Title>Modal title</Modal.Title>
						</Modal.Header>

						<Modal.Body>{exportedData}</Modal.Body>

						<Modal.Footer>
							<button onClick={this.handleClose}>Close</button>
						</Modal.Footer>
					</Modal.Dialog>
					</div>
				)} */}
			</SocketProvider>
		);
	}
}


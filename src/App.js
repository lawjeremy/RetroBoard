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

import { Modal } from 'react-bootstrap';
import randomName from 'random-name';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 0px auto;
	min-height: 100vh;
	margin-top: 100px;	
`;

const ModalWrap = styled.div`
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

	exportData = () => {
		const ActionItems = [
			{
				text: 'Hi',
				id: 1,
				comments:['Boo you suck'],
				vote: 3,
				isFavourite: true,
				user: 'DJ Joe Blow'
			},
			{
				text: 'MP rocks',
				id: 2,
				comments:['Yay me'],
				vote: 3,
				isFavourite: true,
				user: 'Captian Jim Blow'
			},
			{
				text: 'Transactional Logging Blows',
				id: 3,
				comments:['This comment is invalid'],
				vote: 3,
				isFavourite: true,
				user: 'Micheal'
			},
		]

		const ArrayCards = ActionItems.reduce((accum, e)=>{ 
			const cardText = `
				### Card Title
				${e.text}
				votes: ${e.vote}
			`;
			return accum + cardText;
		 }, '');

		this.setState({ show: true })
		//  const blob = new Blob([ArrayCards], {type: 'text/markdown'});
		//  const uri = URL.createObjectURL(blob);
		//  window.open(uri);
		// socket.emit('Export Data', )
	} 

	render() {
		const { userName, query, show } = this.state
		console.log('App data: ', query);

		return (
			<SocketProvider socket={socket}>
				<Header handleExport={this.exportData} sendQuery={this.getQuery} userName={userName}/>
				<Wrapper className="App">  					
					<Board searchContent={query} userName={userName} style={{ flexGrow: 1 }} />
					<ModalWrap className="static-modal">
						<Modal.Dialog show={show}>
							<Modal.Header>
								<Modal.Title>Modal title</Modal.Title>
							</Modal.Header>
							<Modal.Footer>
								<button onClick={this.handleClose}>Close</button>
							</Modal.Footer>
						</Modal.Dialog>	
					</ModalWrap>					
					<Footer/>
				</Wrapper>
			</SocketProvider>
		);
	}
}


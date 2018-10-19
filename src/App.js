import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import Card from './components/Card';

const Wrapper = styled.div`
  min-height: 100vh;
`;

const AddCardButton = styled.button`
  position: fixed;
  top: 5px;
  left: 5px;
`;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: [{ id: 0, text: "Test"}],
    }
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

    const { content } = this.state;
    const sortedContent = content.sort( (a,b) => {
      return a.id - b.id;
    });

    return (
      <Wrapper className="App">        
        {sortedContent.map( i => (
          <Card key={i.id}>{i.text} #{i.id}</Card>
        ))}
        <AddCardButton onClick={this.addCard}>add Card</AddCardButton>
      </Wrapper>
    );
  }
}

export default App;

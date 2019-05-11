import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import Board from './Components/Board';
import { buildBoard } from './store';

class DisconnectedApp extends React.Component {
  render() {
    return (
      <div>
        <h1>HELLO WORLD</h1>
        <h2>{this.props.text}</h2>
        <Board />
      </div>
    );
  }
  componentDidMount() {
    this.props.loadBoard();
  }
}

const mapStateToProps = state => ({
  text: 'hey',
})

const mapDispatchToProps = dispatch => ({
  loadBoard: () => dispatch(buildBoard()),
})


export default connect(mapStateToProps, mapDispatchToProps)(DisconnectedApp);

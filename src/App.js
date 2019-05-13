import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import Board from './Components/Board';
import Status from './Components/Status';
import { buildBoard } from './store';

class DisconnectedApp extends React.Component {
  render() {
    return (
      <div>
        <h1>HELLO WORLD</h1>
        <Status />
        <Board />
      </div>
    );
  }
  componentDidMount() {
    this.props.loadBoard();
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  loadBoard: () => dispatch(buildBoard()),
})


export default connect(mapStateToProps, mapDispatchToProps)(DisconnectedApp);

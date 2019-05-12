import React from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';

const DisconnectedBoard = props => (
  <div className='board'>
    {props.grid.map((row, rowIdx) => (
      <div className='row'>
        {row.map((cell, colIdx) => (
          <Cell col={colIdx} row={rowIdx} cell={cell}></Cell>
        ))}
      </div>
    ))}
  </div>
)

const mapStateToProps = state => ({
  grid: state.board.grid,
})

export default connect(mapStateToProps)(DisconnectedBoard);

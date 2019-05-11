import React from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';

const DisconnectedBoard = props => (
  <table>
    <tbody>
      {props.grid.map((row, rowIdx) => (
        <tr>
          {row.map((cell, colIdx) => (
            <Cell col={colIdx} row={rowIdx} cell={cell}></Cell>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

const mapStateToProps = state => ({
  grid: state.board.grid,
})

export default connect(mapStateToProps)(DisconnectedBoard);

import React from 'react';
import { connect } from 'react-redux';
import { COVERED_BOMB_CELL, leftClickCell, rightClickCell } from '../store';
import './styles/Cell.css';
const DisconnectedCell = props => {

  let className = 'cell';
  if (props.cell.state === COVERED_BOMB_CELL) {
    className = 'bomb ' + className
  }

  return (
    <td className={className}
      onClick={(e) => { e.preventDefault(); props.leftClick(props.row, props.col) }}
      onContextMenu={(e) => { e.preventDefault(); props.rightClick(props.row, props.col) }}
    ></td >
  )
}

const mapDispatchToProps = dispatch => ({
  leftClick: (row, col) => dispatch(leftClickCell(row, col)),
  rightClick: (row, col) => dispatch(rightClickCell(row, col)),
})

export default connect(null, mapDispatchToProps)(DisconnectedCell);

import React from 'react';
import { connect } from 'react-redux';
import { CLICKED_BOMB_CELL, COVERED_CELL, leftClickCell, QUESTION_MARK_CELL, RED_FLAG_CELL, rightClickCell, UNCOVERED_CELL } from '../store';
import './styles/Cell.css';
const DisconnectedCell = props => {

  let className = 'cell';
  if (props.cell.isBomb) {
    className = 'bomb ' + className
  }
  switch (props.cell.state) {
    case UNCOVERED_CELL:
      className += ' uncovered'
      if (!props.cell.isBomb) {
        className += ` num${props.cell.bombNeighbors}`
      }
      break;
    case COVERED_CELL:
      className += ' covered'; break;
    case RED_FLAG_CELL:
      className += ' flagged'; break;
    case QUESTION_MARK_CELL:
      className += ' questioned'; break;
    case CLICKED_BOMB_CELL:
      className += ' clicked'; break;
    default:
      break;
  }


  return (
    <div className={className}
      onClick={(e) => { e.preventDefault(); props.leftClick(props.row, props.col) }}
      onContextMenu={(e) => { e.preventDefault(); props.rightClick(props.row, props.col) }}
    >{props.cell.bombNeighbors > 0 ? '' : ''}</div >
  )
}

const mapDispatchToProps = dispatch => ({
  leftClick: (row, col) => dispatch(leftClickCell(row, col)),
  rightClick: (row, col) => dispatch(rightClickCell(row, col)),
})

export default connect(null, mapDispatchToProps)(DisconnectedCell);

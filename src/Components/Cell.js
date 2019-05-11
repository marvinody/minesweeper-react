import React from 'react';
import { connect } from 'react-redux';
import { leftClickCell, rightClickCell } from '../store';
import './styles/Cell.css';
const DisconnectedCell = props => (
  <td
    onClick={(e) => { e.preventDefault(); props.leftClick(props.row, props.col) }}
    onContextMenu={(e) => { e.preventDefault(); props.leftClick(props.row, props.col) }}
  ></td >
)

const mapDispatchToProps = dispatch => ({
  leftClick: (row, col) => dispatch(leftClickCell(row, col)),
  rightClick: (row, col) => dispatch(rightClickCell(row, col)),
})

export default connect(null, mapDispatchToProps)(DisconnectedCell);

import React from 'react';
import { connect } from 'react-redux';
import { RED_FLAG_CELL } from '../store';

export default connect(
  state => ({
    totalBombs: Math.max(0, state.initialBombs - state.board.grid
      .flat()
      .filter(cell => cell.state === RED_FLAG_CELL)
      .length),
  }),
  dispatch => ({

  })
)(class MineCounter extends React.Component {
  render() {
    const onesDigit = this.props.totalBombs % 10;
    const tensDigit = this.props.totalBombs % 100 / 10 | 0;
    return (
      <div className='bomb-count'>
        <div className={digitToClass(tensDigit)}></div>
        <div className={digitToClass(onesDigit)}></div>
      </div>
    )
  }
})

const digitToClass = d => `seven-seg num${d}`

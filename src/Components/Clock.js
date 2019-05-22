import React from 'react';
import { connect } from 'react-redux';
import { IS_PLAYING } from '../store';

export default connect(
  state => ({
    gameStatus: state.gameStatus,
  }),
  dispatch => ({

  })
)(class Clock extends React.Component {
  constructor() {
    super();
    this.state = {
      startTime: Date.now(),
      endTime: Date.now(),
    }
    const looper = () => {
      if (this.props.gameStatus === IS_PLAYING) {
        this.setState({
          endTime: Date.now(),
        });
        setTimeout(looper, 1000);
      }
    }
    setTimeout(looper, 1000);
  }
  render() {
    const elapsedTime = this.state.endTime - this.state.startTime
    const timeInSeconds = elapsedTime / 1000 | 0;
    const secondsDigit = timeInSeconds % 10;
    const tensDigit = timeInSeconds % 100 / 10 | 0;
    const hundredsDigit = timeInSeconds % 1000 / 100 | 0;
    return (
      <div className='clock'>
        <div className={digitToClass(hundredsDigit)}></div>
        <div className={digitToClass(tensDigit)}></div>
        <div className={digitToClass(secondsDigit)}></div>
      </div>
    )
  }
})

const digitToClass = d => `seven-seg num${d}`

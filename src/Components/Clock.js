import React from 'react';
import { connect } from 'react-redux';
import { IS_PLAYING, tickTimer } from '../store';

export default connect(
  state => ({
    gameStatus: state.gameStatus,
    time: state.time,
  }),
  dispatch => ({
    tick: () => dispatch(tickTimer()),
  })
)(class Clock extends React.Component {
  constructor() {
    super();
    this.state = {
      intervalHandle: null,
    }
  }
  componentDidMount() {
    this.setState({
      intervalHandle: setTimeout(this.tick, 1000),
    })
  }
  tick = () => {
    // we only want to update the clock if game is playing
    // otherwise, next loop we'll get it
    if (this.props.gameStatus === IS_PLAYING) {
      this.props.tick(); // this actually updates the timer to current time
    }
    // so we have to call our function again in 1s
    //
    this.setState({
      intervalHandle: setTimeout(this.tick, 1000),
    })
  }
  componentWillUnmount = () => {
    this.setState(prev => {
      clearInterval(prev.intervalHandle);
    })
    return {
      intervalHandle: null,
    }
  }
  render() {
    const timeInSeconds = this.props.time;
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

import React from 'react';

export default class Clock extends React.Component {
  constructor() {
    super();
    this.state = {
      startTime: Date.now(),
    }
    this.forcer = this.forceUpdate.bind(this);
  }
  render() {
    const elapsedTime = Date.now() - this.state.startTime
    const timeInSeconds = elapsedTime / 1000 | 0;
    const secondsDigit = timeInSeconds % 10;
    const tensDigit = timeInSeconds % 100 / 10 | 0;
    const hundredsDigit = timeInSeconds % 1000 / 100 | 0;
    setTimeout(this.forcer, 1000);
    return (
      <div className='clock'>
        <div className={digitToClass(hundredsDigit)}></div>
        <div className={digitToClass(tensDigit)}></div>
        <div className={digitToClass(secondsDigit)}></div>
      </div>
    )
  }
}

const digitToClass = d => `seven-seg time${d}`

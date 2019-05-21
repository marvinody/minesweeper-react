import React from 'react';
import Clock from './Clock';
import MineCounter from './MineCounter';
import './styles/Status.css';

const Status = () => (
  <div className='status'>
    <Clock />
    <MineCounter />
  </div>
)

export default Status;

import React from 'react';
import Clock from './Clock';
import Emote from './Emote';
import MineCounter from './MineCounter';
import './styles/Status.css';

const Status = () => (
  <div className='status'>
    <Clock />
    <Emote />
    <MineCounter />
  </div>
)

export default Status;

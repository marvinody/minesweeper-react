import React from 'react';
import { connect } from 'react-redux';
import { IS_GAME_OVER_LOSS, IS_GAME_OVER_WIN, IS_PLAYING } from '../store';

export default connect(
  state => ({
    status: state.gameStatus,
  }),
  dispatch => ({

  })
)(class Emote extends React.Component {
  render() {
    let className = 'emote ';
    switch (this.props.status) {
      case IS_PLAYING:
        className += 'happy'; break;
      case IS_GAME_OVER_LOSS:
        className += 'lost'; break;
      case IS_GAME_OVER_WIN:
        className += 'won'; break;
      default:
        ;
    }
    return (
      <div className={className}>

      </div>
    )
  }
})

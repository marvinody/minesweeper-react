import React from 'react';
import { connect } from 'react-redux';
import './App.css';

function DisconnectedApp(props) {
  return (
    <div>
      <h1>HELLO WORLD</h1>
      <h2>{props.text}</h2>
    </div>
  );
}

const mapStateToProps = state => ({
  text: state.text,
})


export default connect(mapStateToProps)(DisconnectedApp);

import { applyMiddleware, createStore } from "redux";
import logger from 'redux-logger';

const initialState = {
  'text': 'hi world',
}

const reducer = (state = initialState, action) => {
  return initialState;
}


export default createStore(reducer, applyMiddleware(logger));

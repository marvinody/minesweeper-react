import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';

const initialBoardState = {
  grid: [],
  width: 10,
  height: 10,
}

const BUILD_BOARD = 'BUILD_BOARD';
export const buildBoard = () => ({
  type: BUILD_BOARD,
})

const LEFT_CLICK_CELL = 'LEFT_CLICK_CELL';
export const leftClickCell = (row, col) => ({
  type: LEFT_CLICK_CELL,
  row, col,
})

const RIGHT_CLICK_CELL = 'RIGHT_CLICK_CELL';
export const rightClickCell = (row, col) => ({
  type: RIGHT_CLICK_CELL,
  row, col,
})


const boardReducer = (state = initialBoardState, action) => {
  console.log(state);
  switch (action.type) {
    case BUILD_BOARD:
      return { ...state, grid: newArray(state.height).map(row => newArray(state.width)) };
    case LEFT_CLICK_CELL:
      return {
        ...state, grid: state.grid.map((row, rowIdx) => row.map((cell, colIdx) => {
          if (rowIdx === action.row && colIdx === action.col) {
            if (cell === 0) {
              return 1;
            }
          }
          return cell;
        }))
      }
    default:
      return state;
  }
}

const newArray = n => Array(n).fill(0);

const superReducer = combineReducers({
  board: boardReducer,
})

export default createStore(superReducer,
  composeWithDevTools(
    applyMiddleware(
      logger
    )));

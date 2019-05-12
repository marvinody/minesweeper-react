import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from 'redux-logger';

const initialBoardState = {
  grid: [],
  width: 3,
  height: 5,
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

export const
  COVERED_NORMAL_CELL = 1,
  COVERED_BOMB_CELL = 2,
  NORMAL_UNCOVERED_CELL = 3;


const cellCycler = (cell, type) => {
  console.log('cycler', cell, type);
  switch (cell.state) {
    case COVERED_NORMAL_CELL:
      return { state: NORMAL_UNCOVERED_CELL };
    default:
      return cell;
  }
}


const boardReducer = (state = initialBoardState, action) => {
  switch (action.type) {
    case BUILD_BOARD:
      return { ...state, grid: createBoardWithBombs(state.width, state.height, 10) };
    case LEFT_CLICK_CELL:
    case RIGHT_CLICK_CELL:
      return {
        ...state, grid: state.grid.map((row, rowIdx) => row.map((cell, colIdx) => {
          if (rowIdx === action.row && colIdx === action.col) {
            return cellCycler(cell, action.type);
          }
          return cell;
        }))
      }
    default:
      return state;
  }
}

// create all the rows
// gen random locations
// if bomb, skip. otherwise place bomb and update neighbors
const createBoardWithBombs = (width, height, bombCount) => {
  // make initial grid with all covered normal cells
  const grid = newArray(height).map(row => newArray(width));
  // while we have bombs to place
  while (bombCount > 0) {
    const
      // get some random coords
      col = Math.random() * width | 0,
      row = Math.random() * height | 0
    const cell = grid[row][col];
    // if it's already a bomb, loop again
    if (cell.state === COVERED_BOMB_CELL) {
      continue;
    }
    // place and make sure we decrement
    cell.state = COVERED_BOMB_CELL;
    bombCount--;
    // then let's update all the neighbors as long as normal cell
    getValidNeighborArray(row, col, width, height)
      .map(pair => grid[pair[0]][pair[1]])
      .filter(cell => cell.state === COVERED_NORMAL_CELL)
      .forEach(cell => cell.bombNeighbors++);
  }
  return grid;
}

const getValidNeighborArray = (row, col, width, height) => {
  const offsets = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
  ];
  return offsets
    .map(pair => [row + pair[1], col + pair[0]])
    .filter(pair => pair[0] >= 0 && pair[1] >= 0 && pair[0] < height && pair[1] < width);
}

const newArray = n => Array(n).fill(0).map(() => (
  {
    state: COVERED_NORMAL_CELL,
    bombNeighbors: 0,
  }
))

const superReducer = combineReducers({
  board: boardReducer,
})

export default createStore(superReducer,
  // composeWithDevTools(
  applyMiddleware(
    logger
  )
  // )
);

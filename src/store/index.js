import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
const initialState = {
  board: {
    grid: [],
    width: 10,
    height: 10,
  },
  gameOver: false,
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
  COVERED_CELL = 1,
  UNCOVERED_CELL = 3,
  CLICKED_BOMB_CELL = 5,
  RED_FLAG_CELL = 6,
  QUESTION_MARK_CELL = 7;


const cellCycler = (cell, type) => {
  // can assume they didn't left click the
  if (type === LEFT_CLICK_CELL) {
    switch (cell.state) {
      case COVERED_CELL:
        return { ...cell, state: UNCOVERED_CELL };
      default:
        return cell;
    }
  } else { // right click
    switch (cell.state) {
      case COVERED_CELL:
        return { ...cell, state: RED_FLAG_CELL }
      case RED_FLAG_CELL:
        return { ...cell, state: QUESTION_MARK_CELL }
      case QUESTION_MARK_CELL:
        return { ...cell, state: COVERED_CELL }
      default:
        return cell;
    }

  }

}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case BUILD_BOARD:
      return {
        ...state, board: {
          ...state.board,
          grid: createBoardWithBombs(state.board.width, state.board.height, 20)
        },
      }
    case LEFT_CLICK_CELL:
    case RIGHT_CLICK_CELL:
      {
        const clickedCell = state.board.grid[action.row][action.col];
        if (clickedCell.isBomb && clickedCell.state === COVERED_CELL && action.type === LEFT_CLICK_CELL) {
          // GAME OVER
          clickedCell.state = CLICKED_BOMB_CELL;
          return {
            ...state, gameOver: true, board: {
              ...state.board, grid: state.board.grid.map((row, rowIdx) => row.map((cell, colIdx) => {
                if (cell.isBomb && cell.state === COVERED_CELL) {
                  return { ...cell, state: UNCOVERED_CELL }
                }
                return { ...cell };
              }))
            }
          }
        }
        return {
          ...state, board: {
            ...state.board, grid: state.board.grid.map((row, rowIdx) => row.map((cell, colIdx) => {
              if (rowIdx === action.row && colIdx === action.col) {
                return cellCycler(cell, action.type);
              }
              return { ...cell };
            }))
          }
        }

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
    if (cell.isBomb) {
      continue;
    }
    // place and make sure we decrement
    cell.isBomb = true;
    cell.bombNeighbors = 0;
    bombCount--;
    // then let's update all the neighbors as long as normal cell
    getValidNeighborArray(row, col, width, height)
      .map(pair => grid[pair[0]][pair[1]])
      .filter(cell => !cell.isBomb)
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
    state: COVERED_CELL,
    bombNeighbors: 0,
    isBomb: false,
  }
))

console.log(createBoardWithBombs(10, 10, 5));

export default createStore(reducer,
  composeWithDevTools(
    applyMiddleware(
      logger
    )
  )
);

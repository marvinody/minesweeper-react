import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';


export const
  IS_PLAYING = 0,
  IS_GAME_OVER_LOSS = 1,
  IS_GAME_OVER_WIN = 2;

const initialState = {
  board: {
    grid: [],
    width: 10,
    height: 10,
  },
  initialBombs: 10,
  gameStatus: IS_PLAYING,
  time: 0,
}

const TICK_TIMER = 'TICK_TIMER';
export const tickTimer = () => ({
  type: TICK_TIMER,
})

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

//lesson learned, do not use numbers manually. make iota fn that does this
export const
  COVERED_CELL = 1,
  UNCOVERED_CELL = 3,
  CLICKED_BOMB_CELL = 5,
  RED_FLAG_CELL = 6,
  QUESTION_MARK_CELL = 7;


const cellCycler = (cell, type) => {
  // can assume they didn't left click the bomb cell cause it would be game over
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
    case TICK_TIMER:
      if (state.gameStatus === IS_PLAYING) {
        return {
          ...state,
          time: state.time + 1,
        }
      }
      return state;

    case BUILD_BOARD:
      return {
        ...state, board: {
          ...state.board,
          grid: createBoardWithBombs(state.board.width, state.board.height, state.initialBombs)
        },
        gameStatus: IS_PLAYING,
        time: 0,
      }
    case LEFT_CLICK_CELL:
    case RIGHT_CLICK_CELL:
      if (state.gameStatus !== IS_PLAYING) {
        return state;
      }
      {
        const clickedCell = state.board.grid[action.row][action.col];
        // if we left click a covered bomb
        if (clickedCell.isBomb
          && clickedCell.state === COVERED_CELL
          && action.type === LEFT_CLICK_CELL) {
          // GAME OVER
          // make this one clicked so it'll display differently
          clickedCell.state = CLICKED_BOMB_CELL;
          return {
            ...state, gameStatus: IS_GAME_OVER_LOSS, board: {
              ...state.board, grid: state.board.grid.map((row, rowIdx) => row.map((cell, colIdx) => {
                // make any bomb cells uncovered
                if (cell.isBomb && cell.state === COVERED_CELL) {
                  return { ...cell, state: UNCOVERED_CELL }
                }
                return { ...cell };
              }))
            }
          }
        }
        // otherwise let's just cycle the cell and update the grid
        const newGrid = copyGrid(state.board.grid);
        const oldCell = state.board.grid[action.row][action.col];
        // now if we clicked on "empty" cell, floodfill outwards
        if (action.type === LEFT_CLICK_CELL
          && oldCell.state === COVERED_CELL
          && oldCell.bombNeighbors === 0) {
          floodfill(newGrid, action.row, action.col);
        } else {
          newGrid[action.row][action.col] = cellCycler(oldCell, action.type);
        }
        return {
          ...state, board: {
            ...state.board, grid: newGrid,
          },
          // was this the last click?
          gameStatus: isGameDone(newGrid, state.initialBombs) ? IS_GAME_OVER_WIN : state.gameStatus,
        }
      }
    default:
      return state;
  }
}

const isGameDone = (grid, totalBombs) => grid
  .flat()
  .filter(cell => cell.state !== UNCOVERED_CELL)
  .length === totalBombs;


const floodfill = (grid, row, col) => {
  const
    height = grid.length,
    width = grid[0].length,
    queue = [];
  queue.push([row, col]);
  while (queue.length > 0) {
    const [curRow, curCol] = queue.shift();
    const cell = grid[curRow][curCol];
    if (cell.state === COVERED_CELL) {
      cell.state = UNCOVERED_CELL;
      if (cell.bombNeighbors === 0) {
        getValidNeighborArray(curRow, curCol, width, height).forEach(
          pair => queue.push(pair)
        )
      }
    }
  }
}

const copyGrid = grid => grid.map(row => row.map(cell => ({ ...cell })))

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


export default createStore(reducer,
  composeWithDevTools(
    applyMiddleware(
      thunk,
      logger
    )
  )
);

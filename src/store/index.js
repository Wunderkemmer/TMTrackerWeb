import { applyMiddleware, combineReducers, createStore } from 'redux';

import thunk from 'redux-thunk';

import game from 'store/game/gameReducer';
import gameMiddleware from 'store/game/gameMiddleware';
import ui from 'store/ui/uiReducer';
import uiMiddleware from 'store/ui/uiMiddleware';

const rootReducer = combineReducers({
  game,
  ui
});

const middleWares = [
  thunk,
  gameMiddleware,
  uiMiddleware
];

export default createStore(rootReducer, applyMiddleware(...middleWares))

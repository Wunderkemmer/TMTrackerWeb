import If from 'components/If';
import Tracker from 'components/Tracker';

import onsenui, { notification } from 'onsenui';
import 'onsenui/css/onsen-css-components.css';
import 'onsenui/css/onsenui.css';

import React, { Component } from 'react';
import withStyles from 'react-jss';
import { Provider } from 'react-redux';

import store from 'store';

import { RESOURCE_INFOS, RESOURCE_TYPES } from 'store/game/gameConstants';
import GameState from 'store/game/gameState';
import { setHistory, startGame } from 'store/ui/uiActions';

onsenui.disableAutoStyling();

// window.oncontextmenu = function(event) {
//   event.preventDefault();
//   event.stopPropagation();
//
//   return false;
// };

type Props = {};

class App extends Component<Props> {

  state = {
    isLoading: true
  };

  componentDidMount () {
    let history = localStorage.getItem('gameHistory');

    if (history) {
      history = JSON.parse(history);

      const { event, gameState } = history[history.length - 1];
      const { oceans, oxygen, temperature } = gameState.resourceCounts;

      const isGameInProgress = event !== 'newGame' &&
        (oceans < RESOURCE_INFOS[RESOURCE_TYPES.OCEANS].maximumCount ||
         oxygen < RESOURCE_INFOS[RESOURCE_TYPES.OXYGEN].maximumCount ||
         temperature < RESOURCE_INFOS[RESOURCE_TYPES.TEMPERATURE].maximumCount);

      if (isGameInProgress) {
        notification.alert('An in-progress game was found, do you want to restore it?', {
          buttonLabels: [ 'No', 'Yes' ],
          callback: (index) => index ? this.onSetHistory(history) : this.onStartGame(),
          title: 'Load last game?'
        });

        return;
      }
    }

    this.onStartGame();
  }

  onSetHistory = (history) => {
    store.dispatch(setHistory(history));

    this.setState({ isLoading: false });
  };

  onStartGame = () => {
    store.dispatch(startGame(new GameState()));

    this.setState({ isLoading: false });
  };

  render () {
    const { classes } = this.props;
    const { isLoading } = this.state;

    return (
      <Provider store={ store }>
        <div className={ classes.app }>
          <If condition={ !isLoading }>
            <div className={ classes.resourceRow }>
              <Tracker type={ RESOURCE_TYPES.MEGACREDITS } />
              <Tracker type={ RESOURCE_TYPES.STEEL } />
              <Tracker type={ RESOURCE_TYPES.TITANIUM } />
            </div>
            <div className={ classes.resourceRow }>
              <Tracker type={ RESOURCE_TYPES.PLANTS } />
              <Tracker type={ RESOURCE_TYPES.ENERGY } />
              <Tracker type={ RESOURCE_TYPES.HEAT } />
            </div>
          </If>
        </div>
      </Provider>
    );
  }

}

const styles = {

  app: {
    backgroundColor: '#282c34',
    color: 'white',
    fontSize: 'calc(10px + 2vmin)',
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },

  resourceRow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  }

};

export default withStyles(styles)(App);

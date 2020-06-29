import If from 'components/If';
import Interface from 'components/Interface';
import Modals from 'components/modals/Modals';

import ImageBackgroundMars from 'images/background_mars.jpg';

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

window.oncontextmenu = function(event) {

event.preventDefault();
event.stopPropagation();
  return false;
};

class App extends Component {

  state = {
    isLoading: true
  };

  componentDidMount () {
    let history = localStorage.getItem('gameHistory');

    if (history) {
      history = JSON.parse(history);

      const {
        gameState: { resourceCounts: { oceans, oxygen, temperature } },
        transaction: { event }
      } = history[history.length - 1];

      const isGameInProgress = event !== 'New Game' &&
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
          <img className={ classes.background } alt='' src={ ImageBackgroundMars } />
          <If condition={ !isLoading }>
            <Interface />
            <Modals />
          </If>
        </div>
      </Provider>
    );
  }

}

const styles = {

  app: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex'
  },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0
  }

};

export default withStyles(styles)(App);

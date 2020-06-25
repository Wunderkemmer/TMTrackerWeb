import Button from 'components/Button';
import If from 'components/If';
// import Tracker from 'components/Tracker';
import logo from 'logo.svg';

import onsenui, { notification } from 'onsenui';
import 'onsenui/css/onsen-css-components.css';
import 'onsenui/css/onsenui.css';

import React, { Component } from 'react';
import withStyles from 'react-jss';
import { Provider } from 'react-redux';

import store from 'store';

// import { RESOURCE_INFOS, RESOURCE_TYPES } from 'store/game/gameConstants';
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
      // history = JSON.parse(history);
      //
      // const { event, gameState } = history[history.length - 1];
      // const { oceans, oxygen, temperature } = gameState.resourceCounts;

      // const isGameInProgress = event !== 'newGame' &&
      //   (oceans < RESOURCE_INFOS[RESOURCE_TYPES.OCEANS].maximumCount ||
      //    oxygen < RESOURCE_INFOS[RESOURCE_TYPES.OXYGEN].maximumCount ||
      //    temperature < RESOURCE_INFOS[RESOURCE_TYPES.TEMPERATURE].maximumCount);
      //
      // if (isGameInProgress) {
      //   notification.alert('An in-progress game was found, do you want to restore it?', {
      //     buttonLabels: [ 'No', 'Yes' ],
      //     callback: (index) => index ? this.onSetHistory(history) : this.onStartGame(),
      //     title: 'Load last game?'
      //   });
      //
      //   return;
      // }
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

  onClick = (text) => {
    notification.alert(`You clicked ${ text }!`, {
      buttonLabels: [ 'Ok' ],
      title: 'Click!'
    });
  };

  render () {
    const { classes } = this.props;
    const { isLoading } = this.state;

    return (
      <Provider store={ store }>
        <div className={ classes.app }>
          <header className={ classes.appHeader }>
            <If condition={ !isLoading }>
              <img src={logo} className={ classes.appLogo } alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className={ classes.appLink }
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </If>
            <Button
              className={ classes.heyButton }
              icon="500px"
              onClick={ () => this.onClick('Hey') }
              text="Hey"
            >
              <Button
                icon="ad"
                onClick={ () => this.onClick('Yo') }
                text="Yo"
              />
            </Button>
            {/*<Tracker type="energy" />*/}
          </header>
        </div>
      </Provider>
    );
  }

}

const styles = {

  '@keyframes appLogoSpin': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },

  app: {
    textAlign: 'center'
  },

  appHeader: {
    backgroundColor: '#282c34',
    color: 'white',
    fontSize: 'calc(10px + 2vmin)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  appLink: {
    color: '#61dafb'
  },

  appLogo: {
    height: '40vmin',
    animation: '$appLogoSpin 5s alternate ease-in-out infinite',
    pointerEvents: 'none'
  },

  heyButton: {
    marginTop: '1rem'
  },

  gray: {
    color: '#cccccc'
  }

};

export default withStyles(styles)(App);

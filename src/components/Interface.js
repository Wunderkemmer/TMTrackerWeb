import Button from 'components/Button';
import ProjectButton from 'components/ProjectButton';
// import If from "components/If";
// import ProjectButton from 'components/ProjectButton';
import Tracker from 'components/Tracker';

import { notification } from 'onsenui';

import React, { Component } from 'react';
import withStyles from "react-jss";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { runProject } from 'store/game/gameActions';
import { PROJECT_TYPES, RESOURCE_INFOS, RESOURCE_TYPES } from 'store/game/gameConstants';
import GameState from 'store/game/gameState';
import { redo, showModal, startGame, undo } from 'store/ui/uiActions';
import { MODAL_TYPES } from 'store/ui/uiConstants';

class Interface extends Component {

  onNewGame = () => {
    notification.alert('Do you really want to start a new game?', {
      buttonLabels: [ 'No', 'Yes' ],
      callback: (index) => index && this.props.actions.startGame(new GameState()),
      title: 'Start new game?'
    });
  };

  onOcean = () => {
    this.props.actions.runProject(PROJECT_TYPES.ADD_OCEAN);
  };

  onOxygen = () => {
    this.props.actions.runProject(PROJECT_TYPES.ADD_OXYGEN);
  };

  onTemperature = () => {
    this.props.actions.runProject(PROJECT_TYPES.ADD_TEMPERATURE);
  };

  render () {
    const {
      actions: { redo, showModal, undo },
      capOceans,
      capOxygen,
      capTemperature,
      classes,
      isRedoDisabled,
      isUndoDisabled,
      oceans,
      oxygen,
      temperature
    } = this.props;

    const oceanTextClass = capOceans ?
      classes.statusBottomTextComplete :
      classes.statusBottomText;

    const oxygenTextClass = capOxygen ?
      classes.statusBottomTextComplete :
      classes.statusBottomText;

    const temperatureTextClass = capTemperature ?
      classes.statusTopTextComplete :
      classes.statusTopText;

    const oxygenText = oxygen + '%';
    const temperatureText = (temperature > 0 ? '+' + temperature : temperature) + '°';

    return (
      <div className={ classes.container }>
        <div className={ classes.panel1 }>
          <Tracker className={ classes.sideTracker } type={ RESOURCE_TYPES.TERRAFORMING_RATING } />
          <div className={ classes.panelButtons }>
            <div className={ classes.panelButtonsRow }>
              <Button
                className={ classes.panelButton }
                icon="undo-alt"
                isDisabled={ isUndoDisabled }
                onClick={ undo }
              />
              <Button
                className={ classes.panelButton }
                icon="redo-alt"
                isDisabled={ isRedoDisabled }
                onClick={ redo }
              />
            </div>
            <div className={ classes.panelButtonsRow }>
              <Button
                className={ classes.panelButton }
                icon="info-circle"
                onClick={ () => showModal(MODAL_TYPES.INFO) }
              />
              <Button
                className={ classes.panelButton }
                icon="file"
                onClick={ this.onNewGame }
              />
            </div>
          </div>
          <div className={ classes.flex } />
          <div className={ classes.statusButtons }>
            <Button
              contentClass={ classes.statusContent }
              isDisabled={ capOceans }
              isBackgroundVisible={ false }
              onClick={ this.onOcean }
            >
              <img className={ classes.statusOcean } alt='' src={ RESOURCE_INFOS[RESOURCE_TYPES.OCEANS].image } />
              <div className={ oceanTextClass }>{ oceans }</div>
            </Button>
            <Button
              contentClass={ classes.statusContent }
              isDisabled={ capTemperature }
              isBackgroundVisible={ false }
              onClick={ this.onTemperature }
            >
              <div className={ temperatureTextClass }>{ temperatureText }</div>
              <img className={ classes.statusTemperature } alt='' src={ RESOURCE_INFOS[RESOURCE_TYPES.TEMPERATURE].image } />
            </Button>
            <Button
              contentClass={ classes.statusContent }
              isDisabled={ capOxygen }
              isBackgroundVisible={ false }
              onClick={ this.onOxygen }
            >
              <img className={ classes.statusOxygen } alt='' src={ RESOURCE_INFOS[RESOURCE_TYPES.OXYGEN].image } />
              <div className={ oxygenTextClass }>{ oxygenText }</div>
            </Button>
          </div>
        </div>
        <div className={ classes.panel2 }>
          <div className={ classes.panel2Row }>
            <Tracker type={ RESOURCE_TYPES.MEGACREDITS } />
            <Tracker type={ RESOURCE_TYPES.STEEL } />
            <Tracker type={ RESOURCE_TYPES.TITANIUM } />
          </div>
          <div className={ classes.panel2Row }>
            <Tracker type={ RESOURCE_TYPES.PLANTS } />
            <Tracker type={ RESOURCE_TYPES.ENERGY } />
            <Tracker type={ RESOURCE_TYPES.HEAT } />
          </div>
        </div>
        <div className={ classes.panel3 }>
          <Tracker className={ classes.sideTracker } type={ RESOURCE_TYPES.GENERATION } />
          <div className={ classes.panelButtons }>
            <ProjectButton
              className={ classes.projectButton }
              backgroundColor="#5FB365"
              projectType={ PROJECT_TYPES.TRADE_PLANTS }
            />
            <ProjectButton
              className={ classes.projectButton }
              backgroundColor="#ED4E44"
              projectType={ PROJECT_TYPES.TRADE_HEAT }
            />
            <Button
              className={ classes.panelButton }
              text="Projects"
              onClick={ () => showModal(MODAL_TYPES.PROJECTS) }
            />
          </div>
        </div>
      </div>
    );
  }

}

const styles = {

  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
  },

  flex: {
    flex: 1
  },

  panelButton: {
    minHeight: '2.5rem',
    margin: '0.25rem',
    padding: 0,
    flex: 1
  },

  panelButtons: {
    display: 'flex',
    flexDirection: 'column'
  },

  panelButtonsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  panel1: {
    margin: '0.25rem 0 0.25rem 0.25rem',
    zIndex: 1,
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },

  panel2: {
    margin: '0.25rem 0',
    zIndex: 1,
    display: 'flex',
    flex: 4,
    flexDirection: 'column'
  },

  panel2Row: {
    display: 'flex',
    flex: 1
  },

  panel3: {
    margin: '0.25rem 0.25rem 0.25rem 0',
    zIndex: 1,
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },

  projectButton: {
    minHeight: '2.5rem',
    margin: '0.25rem',
    padding: 0,
    flex: 1
  },

  sideTracker: {
    minWidth: '9rem',
    maxHeight: '12rem',
    flex: 1
  },

  statusButtons: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0.25rem'
  },

  statusContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  statusOcean: {
    height: '3rem',
    marginTop: '1rem'
  },

  statusOxygen: {
    height: '3rem',
    marginTop: '1rem'
  },

  statusTemperature: {
    height: '3.5rem',
    marginTop: '0.4rem'
  },

  statusTopText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginHorizontal: '-1rem'
  },

  statusTopTextComplete: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00FF00',
    marginHorizontal: '-1rem'
  },

  statusBottomText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '0.4rem'
  },

  statusBottomTextComplete: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00FF00',
    marginTop: '0.4rem'
  }

};

const mapStateToProps = (state) => {
  const { future, history } = state.ui;
  const { oceans, oxygen, temperature } = state.game.resourceCounts;

  return {
    isRedoDisabled: future.size < 1,
    isUndoDisabled: history.size < 2,
    oceans,
    oxygen,
    temperature,
    capOceans: oceans >= RESOURCE_INFOS[RESOURCE_TYPES.OCEANS].maximumCount,
    capOxygen: oxygen >= RESOURCE_INFOS[RESOURCE_TYPES.OXYGEN].maximumCount,
    capTemperature: temperature >= RESOURCE_INFOS[RESOURCE_TYPES.TEMPERATURE].maximumCount
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    runProject,
    redo,
    showModal,
    startGame,
    undo
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Interface));
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

// const ImageIconOcean = 'images/icon_ocean.png';
// const ImageIconOxygen = 'images/icon_oxygen.png';
// const ImageIconTemperature = 'images/icon_temperature.png';

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
      classes,
      isRedoDisabled,
      isUndoDisabled,
      // oceans,
      // oxygen,
      // temperature
    } = this.props;

    // const capOceans = oceans >= RESOURCE_INFOS[RESOURCE_TYPES.OCEANS].maximumCount;
    // const capOxygen = oxygen >= RESOURCE_INFOS[RESOURCE_TYPES.OXYGEN].maximumCount;
    // const capTemperature = temperature >= RESOURCE_INFOS[RESOURCE_TYPES.TEMPERATURE].maximumCount;

    // const oceanTextStyle = capOceans ?
    //   styles.toggleBottomTextComplete :
    //   styles.toggleBottomText;
    //
    // const oxygenTextStyle = capOxygen ?
    //   styles.toggleBottomTextComplete :
    //   styles.toggleBottomText;
    //
    // const temperatureTextStyle = capTemperature ?
    //   styles.toggleTopTextComplete :
    //   styles.toggleTopText;
    //
    // const oxygenText = oxygen + '%';
    // const temperatureText = (temperature > 0 ? '+' + temperature : temperature) + '°';

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
            {/*<div style={ styles.panelButtonsRow }>*/}
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
          {/*</div>*/}
        </div>
      </div>
    );

    //       <View style={ styles.sidebarButtonsLeft }>
    //         <View style={ styles.sidebarToggleRow }>
    //           <View style={ styles.sidebarToggleColumn }>
    //             <TouchableOpacity onClick={ this.onOcean } disabled={ capOceans }>
    //               <Image style={ styles.toggleOcean } source={ ImageIconOcean } />
    //             </TouchableOpacity>
    //             <TouchableOpacity onClick={ this.onOcean } disabled={ capOceans }>
    //               <Text style={ oceanTextStyle }>{ oceans }</Text>
    //             </TouchableOpacity>
    //           </View>
    //           <View style={ styles.sidebarToggleColumn }>
    //             <TouchableOpacity onClick={ this.onTemperature } disabled={ capTemperature }>
    //               <Text style={ temperatureTextStyle }>{ temperatureText }</Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity onClick={ this.onTemperature } disabled={ capTemperature }>
    //               <Image style={ styles.toggleTemperature } source={ ImageIconTemperature } />
    //             </TouchableOpacity>
    //           </View>
    //           <View style={ styles.sidebarToggleColumn }>
    //             <TouchableOpacity onClick={ this.onOxygen } disabled={ capOxygen }>
    //               <Image style={ styles.toggleOxygen } source={ ImageIconOxygen } />
    //             </TouchableOpacity>
    //             <TouchableOpacity onClick={ this.onOxygen } disabled={ capOxygen }>
    //               <Text style={ oxygenTextStyle }>{ oxygenText }</Text>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       </View>
  }

}

const styles = {

  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
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
    minWidth: '7rem',
    maxHeight: '12rem',
    flex: 1
  }

};

//   flex: {
//     flex: 1
//   },

//   sidebarToggleColumn: {
//     alignItems: 'center'
//   },
//
//   sidebarToggleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: '0.2rem',
//     marginBottom: '0.25rem',
//     marginHorizontal: '0.35rem'
//   },
//
//   sideTracker: {
//     flex: 1,
//     maxHeight: '10rem'
//   },
//
//   toggleOcean: {
//     width: '2.35rem',
//     height: '2.35rem',
//     marginTop: '1rem'
//   },
//
//   toggleOxygen: {
//     width: '2.35rem',
//     height: '2.35rem',
//     marginTop: '1rem'
//   },
//
//   toggleTemperature: {
//     width: '1.5rem',
//     height: '3rem',
//     marginTop: '0.4rem'
//   },
//
//   toggleTopText: {
//     fontSize: '1rem',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#FFFFFF',
//     marginHorizontal: '-1rem'
//   },
//
//   toggleTopTextComplete: {
//     fontSize: '1rem',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#00FF00',
//     marginHorizontal: '-1rem'
//   },
//
//   toggleBottomText: {
//     fontSize: '1rem',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#FFFFFF',
//     marginTop: '0.4rem'
//   },
//
//   toggleBottomTextComplete: {
//     fontSize: '1rem',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#00FF00',
//     marginTop: '0.4rem'
//   }

const mapStateToProps = (state) => {
  const { future, history } = state.ui;
  const { oceans, oxygen, temperature } = state.game.resourceCounts;

  return {
    isRedoDisabled: future.size < 1,
    isUndoDisabled: history.size < 2,
    oceans,
    oxygen,
    temperature
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
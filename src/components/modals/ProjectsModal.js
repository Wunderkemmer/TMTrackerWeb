import ProjectButton from 'components/ProjectButton';

import React, { Component } from 'react';
import withStyles from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { runProject } from 'store/game/gameActions';
import { PROJECT_TYPES } from 'store/game/gameConstants';

class ProjectsModal extends Component {

  static publicStyles = {
    popup: {
      maxHeight: '24rem'
    }
  };

  renderProjectButton = (projectType) => {
    const { classes } = this.props;

    return (
      <ProjectButton
        className={ classes.button }
        onClick={ this.props.hide }
        projectType={ projectType }
        showEvent="true"
      />
    );
  };

  render () {
    const { classes } = this.props;

    return (
      <div className={ classes.container }>
        <div className={ classes.buttonColumn }>
          { this.renderProjectButton(PROJECT_TYPES.SELL_PATENT) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_ASTEROID) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_GREENERY) }
        </div>
        <div className={ classes.buttonColumn }>
          { this.renderProjectButton(PROJECT_TYPES.BUY_POWER_PLANT) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_AQUIFER) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_CITY) }
        </div>
      </div>
    );
  }

}

const styles = {

  button: {
    margin: '0.2rem'
  },

  buttonColumn: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },

  container: {
    display: 'flex',
    padding: '1rem'
  }

};

const mapStateToProps = (state) => {
  const { game } = state;

  return {
    game
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    runProject
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectsModal));
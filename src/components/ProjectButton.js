import Button from 'components/Button';
import If from 'components/If';
import Ingredient from 'components/Ingredient';

import { getTransactionData } from 'lib/utils';

import React, { Component } from 'react';
import withStyles from 'react-jss';
import { Icon } from 'react-onsenui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { runProject } from 'store/game/gameActions';
import { PROJECT_INFOS } from 'store/game/gameConstants';

class ProjectButton extends Component {

  onClick = () => {
    const { onClick, projectType } = this.props;

    this.props.actions.runProject(projectType);

    onClick && onClick();
  };

  render () {
    const {
      backgroundColor,
      classes,
      className,
      eventClass,
      projectType,
      resourceCounts,
      resourceProductions,
      showEvent
    } = this.props;

    const {
      canAfford,
      costs,
      event,
      isCapped,
      results
    } = getTransactionData(PROJECT_INFOS[projectType], resourceCounts, resourceProductions);

    const isDisabled = isCapped || !canAfford;

    return (
      <Button
        className={ className ? `${ classes.button } ${ className }` : classes.button }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onClick={ this.onClick }
        useDebounce={ true }
      >
        <If condition={ showEvent }>
          <div className={ eventClass ? `${ classes.event }, ${ eventClass }` : classes.event }>{ event }</div>
        </If>
        <div className={ classes.row } >
          { costs.map((cost, index) => <Ingredient key={ index } ingredient={ cost }/>) }
          <Icon className={ classes.icon } icon="arrow-right" />
          { results.map((result, index) => <Ingredient key={ index } ingredient={ result }/>) }
        </div>
      </Button>
    );
  }

}

const styles = {

  button: {
    padding: '0.5rem'
  },

  event: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '-0.1rem',
    marginBottom: '0.4rem',
  },

  icon: {
    fontSize: '1.4rem',
    color: '#FFFFFF',
    margin: '0 0.3rem'
  },

  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.8rem',
    height: '1.8rem'
  },

  imageProduction: {
    width: '1.3rem',
    height: '1.3rem'
  },

  production: {
    backgroundColor: '#B37D43',
    borderColor: '#222222',
    borderWidth: 1,
    margin: '0 0.2rem',
    padding: '0.2rem'
  },

  resource: {
    margin: '0 0.2rem'
  },

  row: {
    padding: '0 0.4rem',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  value: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 2.5
  }

};

const mapStateToProps = (state) => {
  const { resourceCounts, resourceProductions } = state.game;

  return {
    resourceCounts,
    resourceProductions
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    runProject
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectButton));
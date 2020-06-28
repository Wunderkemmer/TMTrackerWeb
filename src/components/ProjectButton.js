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
      isDisabled,
      showEvent,
      transactionData: {
        costs,
        event,
        results
      }
    } = this.props;

    return (
      <Button
        className={ className }
        contentClass={ classes.projectContent }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onClick={ this.onClick }
        useDebounce={ true }
      >
        <If condition={ showEvent }>
          <div className={ eventClass ? `${ classes.event } ${ eventClass }` : classes.event }>{ event }</div>
        </If>
        <div className={ classes.equation } >
          { costs.map((cost, index) => <Ingredient key={ index } ingredient={ cost }/>) }
          <Icon className={ classes.icon } icon="arrow-right" />
          { results.map((result, index) => <Ingredient key={ index } ingredient={ result }/>) }
        </div>
      </Button>
    );
  }

}

const styles = {

  projectContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },

  equation: {
    opacity: (props) => props.isDisabled ? 0.5 : 1,
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: (props) => props.showEvent ? 'center' : 'space-between',
    padding: '0.25rem'
  },

  event: {
    color: '#FFFFFF',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '0.4rem'
  },

  icon: {
    fontSize: '1.4rem',
    color: '#FFFFFF',
    margin: '0 0.3rem'
  }

};

const mapStateToProps = ({ game: { resourceCounts, resourceProductions } }, { projectType }) => {
  const transactionData = getTransactionData(PROJECT_INFOS[projectType], resourceCounts, resourceProductions);
  const { canAfford, isCapped } = transactionData;

  return {
    isDisabled: isCapped || !canAfford,
    transactionData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    runProject
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectButton));
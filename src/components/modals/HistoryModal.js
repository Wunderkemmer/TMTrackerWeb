import If from "components/If";
import Ingredient from 'components/Ingredient';

import { getTransactionData } from 'lib/utils';

import moment from 'moment';

import React, { Component } from 'react';
import withStyles from 'react-jss';
import {Icon} from "react-onsenui";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HistoryModal extends Component {

  renderHistoryItem = (item, index) => {
    const { classes, resourceCounts, resourceProductions } = this.props;

    const {
      costs,
      event,
      results,
    } = getTransactionData(item.transaction, resourceCounts, resourceProductions, true);

    return (
      <div key={ index } className={ classes.item }>
        <div className={ classes.headerRow }>
          <div className={ classes.event }>{ event }</div>
          <div className={ classes.time }>{ moment(item.time).format('LL LTS') }</div>
        </div>
        <If condition={ costs.length }>
          <div className={ classes.statusRow }>
            <Icon className={ `${ classes.icon } ${ classes.iconDecrease }` } icon={ "minus" } />
            { costs.map((cost, index) => <Ingredient key={ index } ingredient={ cost } isVerbose="true" />) }
          </div>
        </If>
        <If condition={ results.length }>
          <div className={ classes.statusRow }>
            <Icon className={ `${ classes.icon } ${ classes.iconIncrease }` } icon={ "plus" } />
            { results.map((result, index) => <Ingredient key={ index } ingredient={ result } isVerbose="true" />) }
          </div>
        </If>
      </div>
    );
  };

  render () {
    const { classes, history } = this.props;
    const reverseHistory = [ ...history ].reverse();

    return (
      <div className={ classes.list }>
        { reverseHistory.map((item, index) => this.renderHistoryItem(item, index)) }
      </div>
    );
  }

}

const styles = {

  event: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '0.25rem'
  },

  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  icon: {
    fontSize: '1rem',
    marginRight: '0.25rem',
    marginLeft: '0.5rem'
  },

  iconDecrease: {
    color: '#AA2222'
  },

  iconIncrease: {
    color: '#22AA22'
  },

  item: {
    alignItems: 'stretch',
    padding: '0 0.5rem 0.5rem 0.5rem'
  },

  list: {
    margin: '0.5rem 0',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflowY: 'scroll',
    overflowX: 'hidden',

    '& > :last-child': {
      paddingBottom: 0
    }
  },

  statusRow: {
    display: 'flex',
    alignItems: 'center'
  },

  time: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#999999'
  }

};

const mapStateToProps = ({
 game: { resourceCounts, resourceProductions },
 ui: { future, history }
}, { projectType }) => ({
  future,
  history,
  resourceCounts,
  resourceProductions
});


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    /* ... */
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HistoryModal));
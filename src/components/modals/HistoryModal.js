import Ingredient from 'components/Ingredient';

import { getTransactionData } from 'lib/utils';

import React, { Component } from 'react';
import withStyles from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PROJECT_INFOS } from 'store/game/gameConstants';

class HistoryModal extends Component {

  renderHistoryItem = (item, index) => {
    const { classes, resourceCounts, resourceProductions } = this.props;

    const {
      costs,
      event,
      results,
    } = getTransactionData(item.transaction, resourceCounts, resourceProductions, true);

    return (
      <div key={ index } className={ classes.container }>
        <div style={ classes.event }>{ event }</div>
        <div style={ classes.row }>
          { costs.map((cost, index) => <Ingredient key={ index } ingredient={ cost } isVerbose="true" />) }
        </div>
        <div style={ classes.row }>
          { results.map((result, index) => <Ingredient key={ index } ingredient={ result } isVerbose="true" />) }
        </div>
      </div>
    );
  };

  render () {
    const { history } = this.props;
    const reverseHistory = [ ...history ].reverse();

    return reverseHistory.map((item, index) => this.renderHistoryItem(item, index))

    // return (
    //   <FlatList
    //     contentContainerStyle={ styles.container }
    //     data={ reverseHistory }
    //     keyExtractor={ this.keyExtractor }
    //     renderItem={ this.renderHistoryItem }
    //   />
    // );
  }

}

const styles = {

  container: {
    alignItems: 'stretch',
    paddingHorizontal: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '1rem'
  },

  event: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333333',
    marginTop: '-0.175rem'
  },

  row: {
    flexDirection: 'row'
  },

  // textDecrease: {
  //   color: '#AA2222'
  // },
  //
  // textIncrease: {
  //   color: '#22AA22'
  // },
  //
  // textTime: {
  //   fontSize: '0.8rem',
  //   color: '#222222'
  // }

};

const mapStateToProps = ({
 game: { resourceCounts, resourceProductions },
 ui: { future, history }
}, { projectType }) => {
  const transactionData = getTransactionData(PROJECT_INFOS[projectType], resourceCounts, resourceProductions);
  const { canAfford, isCapped } = transactionData;

  return {
    future,
    history,
    resourceCounts,
    resourceProductions,
    transactionData,
  };
}
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    /* ... */
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HistoryModal));
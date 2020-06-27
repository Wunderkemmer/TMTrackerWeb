import If from 'components/If';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import withStyles from 'react-jss';

import { bindActionCreators } from 'redux';

import { changeCount, changeProduction, nextGeneration } from 'store/game/gameActions';
import { RESOURCE_TYPES, RESOURCE_INFOS } from 'store/game/gameConstants';
import { showModal } from 'store/ui/uiActions';
import { MODAL_TYPES } from 'store/ui/uiConstants';

import Button from 'components/Button';

class Tracker extends Component {

  static defaultOpts = {
    showTitle: true
  };

  static getTrackerInfo = (type) => {
    return RESOURCE_INFOS[type]
  };

  onButton1 = () => {
    const { type } = this.props;

    switch (type) {
      case RESOURCE_TYPES.TERRAFORMING_RATING:
        this.props.actions.changeCount(type, -1, 'Decrement Count');
        break;

      case RESOURCE_TYPES.GENERATION:
        this.props.actions.showModal(MODAL_TYPES.HISTORY);
        break;

      default:
        this.props.actions.changeProduction(type, -1, 'Decrement Production');
    }
  };

  onButton2 = () => {
    const { type } = this.props;

    switch (type) {
      case RESOURCE_TYPES.TERRAFORMING_RATING:
        this.props.actions.changeCount(type, 1, 'Increment Count');
        break;

      case RESOURCE_TYPES.GENERATION:
        this.props.actions.nextGeneration();
        break;

      default:
        this.props.actions.changeProduction(type, 1, 'Increment Production');
    }
  };

  onTracker = () => {
    const { type } = this.props;

    if (type === RESOURCE_TYPES.GENERATION) {
      this.props.actions.showModal(MODAL_TYPES.HISTORY);

      return;
    }

    this.props.actions.showModal(MODAL_TYPES.CALCULATOR, { type });
  };

  render () {
    const { classes, className, count, production, type } = this.props;

    const {
      color,
      button1Icon,
      button2Icon,
      image,
      hideTitleInTracker,
      title,
      useDebounce,
      useSmallTracker
    } = RESOURCE_INFOS[type];

    const headerTextClass = useSmallTracker ? classes.headerTextSmall : classes.headerTextLarge;
    let countTextStyle = useSmallTracker ? styles.countTextSmall : styles.countTextLarge;

    if (useSmallTracker) {
      countTextStyle = Object.assign(countTextStyle, { color });
    }

    return (
      <Button
        className={ `${ classes.frame } ${ className }` }
        contentClass={ classes.content }
        backgroundColor={ color }
        onClick={ this.onTracker }
      >
        <div className={ classes.header }>
          <If condition={ image }>
            <img className={ classes.headerImage } alt='' src={ image } />
          </If>
          <If condition={ !hideTitleInTracker }>
            <div className={ headerTextClass }>{ title }</div>
          </If>
        </div>
        <div className={ classes.count }>
          <div style={ countTextStyle }>{ count }</div>
        </div>
        <div className={ classes.footer }>
          <Button
            className={ classes.productionButton }
            backgroundColor="#FFFFFF"
            icon={ button1Icon || 'minus' }
            iconColor="#222222"
            onClick={ this.onButton1 }
            useDebounce={ useDebounce }
          />
          <If condition={ production !== undefined }>
            <div className={ classes.productionText }>{ production }</div>
          </If>
          <Button
            className={ classes.productionButton }
            backgroundColor="#FFFFFF"
            icon={ button2Icon || 'plus' }
            iconColor="#222222"
            onClick={ this.onButton2 }
            useDebounce={ useDebounce }
          />
        </div>
      </Button>
    );
  }

}

const styles = {

  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },

  count: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  countTextLarge: {
    fontSize: '4rem',
    textAlign: 'center',
    color: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1.5
    },
    shadowRadius: 1,
    shadowOpacity: 0.4
  },

  countTextSmall: {
    fontSize: '3rem',
    textAlign: 'center',
    color: '#333333'
  },

  frame: {
    display: 'flex',
    flex: 1
  },

  footer: {
    borderBottomRightRadius: '0.7rem',
    borderBottomLeftRadius: '0.7rem',
    padding: '0.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  header: {
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    padding: '0.45rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },

  headerImage: {
    height: '1.6rem',
    marginRight: '0.4rem'
  },

  headerTextLarge: {
    flex: 4,
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#222222'
  },

  headerTextSmall: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#FFFFFF'
  },

  productionButton: {
    width: '2.3rem',
    height: '2.3rem',
    padding: 0
  },

  productionText: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: '-1rem'
  }

};

const mapStateToProps = (state, props) => {
  const { game } = state;

  return {
    count: game.resourceCounts[props.type],
    production: game.resourceProductions[props.type],
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    changeCount,
    changeProduction,
    nextGeneration,
    showModal
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Tracker));
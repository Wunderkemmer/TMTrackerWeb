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


const BottomButton = (props) => {
  const { icon, onPress, useDebounce } = props;

  return (
    <Button
      style={ styles.button }
      backgroundColor="#FFFFFF"
      color="#222222"
      icon={ icon }
      onPress={ onPress }
      useDebounce={ useDebounce }
    />
  );
};

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
    const { count, production, style, type } = this.props;

    const {
      color,
      button1Icon,
      button2Icon,
      image,
      showTitle,
      title,
      useDebounce,
      useSmallTracker
    } = RESOURCE_INFOS[type];

    const colorStyle = useSmallTracker ? { color } : null;
    const countTextStyle = useSmallTracker ? styles.countTextSmall : styles.countTextLarge;
    const headerTextStyle = useSmallTracker ? styles.headerTextSmall : styles.headerTextLarge;

    return (
      <Button
        style={ style }
        backgroundColor={ color }
        onPress={ this.onTracker }
      >
        <div style={ styles.header }>
          <If condition={ image }>
            <img style={ styles.headerImage } alt='' src={ image } />
          </If>
          <If condition={ showTitle }>
            <div style={ headerTextStyle }>{ title }</div>
          </If>
        </div>
        <div style={ styles.count }>
          <div style={ [ countTextStyle, colorStyle ] }>{ count }</div>
        </div>
        <Button>
          <div style={ styles.footer }>
            <div style={ styles.production }>
              <BottomButton
                icon={ button1Icon || 'minus' }
                onPress={ this.onButton1 }
                useDebounce={ useDebounce }
              />
              <If condition={ production !== undefined }>
                <div style={ styles.productionText }>{ production }</div>
              </If>
              <BottomButton
                icon={ button2Icon || 'plus' }
                onPress={ this.onButton2 }
                useDebounce={ useDebounce }
              />
            </div>
          </div>
        </Button>
      </Button>
    );
  }

}

const styles = {

  button: {
    borderRadius: '0.5rem',
    maxWidth: '2.3rem',
    height: '2.3rem',
    margin: '0.1rem'
  },

  count: {
    backgroundColor: '#FFFFFF',
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
    shadowOpacity: 0.4,
    marginTop: '-1.1rem',
    marginBottom: '-1rem'
  },

  countTextSmall: {
    fontSize: '3rem',
    textAlign: 'center',
    color: '#333333',
    marginTop: '-1.05rem',
    marginBottom: '-1rem'
  },

  footer: {
    borderBottomRightRadius: '0.7rem',
    borderBottomLeftRadius: '0.7rem',
    paddingHorizontal: '0.1rem',
    paddingTop: '0.35rem',
    paddingBottom: '0.3rem'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '2.5rem',
    paddingHorizontal: '0.45rem'
  },

  headerImage: {
    flex: 1,
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
    textAlign: 'center',
    color: '#FFFFFF'
  },

  production: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '0.2rem'
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
import Color from 'color';

import Button from 'components/Button';
import Ingredient from "components/Ingredient";

import React, { Component } from 'react';
import withStyles from 'react-jss';
import { Icon } from 'react-onsenui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeCounts } from 'store/game/gameActions';
import { RESOURCE_INFOS, RESOURCE_TYPES } from 'store/game/gameConstants';

class CalculatorModal extends Component {

  static publicStyles = {
    popup: {
      width: '75%',
      height: 'auto',
      minHeight: '24rem'
    }
  };

  static defaultProps = {
    type: RESOURCE_TYPES.MEGACREDITS
  };

  state = {
    change: 0,
    isNegativeZero: !RESOURCE_INFOS[this.props.type].usePositiveCalculator,

    resourceChanges: {
      heat: 0,
      steel: 0,
      titanium: 0
    },

    useResources: {
      heat: false,
      steel: false,
      titanium: false
    }
  };

  capResourceValues () {
    const { change, resourceChanges, useResources } = this.state;

    if (useResources.heat) {
      while (resourceChanges.heat > 0 && this.getResourcesValue() > -change) {
        resourceChanges.heat--;
      }
    }

    if (useResources.steel) {
      while (resourceChanges.steel > 0 && this.getResourcesValue() > -change) {
        resourceChanges.steel--;
      }
    }

    if (useResources.titanium) {
      while (resourceChanges.titanium > 0 && this.getResourcesValue() > -change) {
        resourceChanges.titanium--;
      }
    }
  }

  getResourcesValue () {
    const { change, resourceChanges, useResources } = this.state;

    return change > 0 ?
      0 :
      (useResources.heat ? resourceChanges.heat * RESOURCE_INFOS[RESOURCE_TYPES.HEAT].multiplier : 0) +
      (useResources.steel ? resourceChanges.steel * RESOURCE_INFOS[RESOURCE_TYPES.STEEL].multiplier : 0) +
      (useResources.titanium ? resourceChanges.titanium * RESOURCE_INFOS[RESOURCE_TYPES.TITANIUM].multiplier : 0);
  }

  onAdjustResource (type, value) {
    const { state } = this;

    const newCount = state.resourceChanges[type] + value;
    const resourceInfo = RESOURCE_INFOS[type];
    const total = newCount * resourceInfo.multiplier;

    if (total > -state.change) {
      return;
    }

    state.resourceChanges[type] += value;

    this.setState(state);
  }

  onChange = () => {
    const { change, resourceChanges, useResources } = this.state;
    const { hide, type } = this.props;

    const countChanges = {
      [type]: change + this.getResourcesValue()
    };

    if (useResources.heat) {
      countChanges[RESOURCE_TYPES.HEAT] = -resourceChanges.heat;
    }

    if (useResources.steel) {
      countChanges[RESOURCE_TYPES.STEEL] = -resourceChanges.steel;
    }

    if (useResources.titanium) {
      countChanges[RESOURCE_TYPES.TITANIUM] = -resourceChanges.titanium;
    }

    this.props.actions.changeCounts(countChanges, 'Calculator Adjustment');

    hide();
  };

  onFastForwardResource = (type) => {
    const { change, resourceChanges } = this.state;
    const { resourceCounts } = this.props;

    // Calculate the max number of resources we can add

    const value = Math.min(
      Math.floor(-(change + this.getResourcesValue()) / RESOURCE_INFOS[type].multiplier),
      resourceCounts[type] - resourceChanges[type]
    );

    this.onAdjustResource(type, value);
  };

  onKeyPad = (value) => {
    const { state } = this;
    const { type } = this.props;

    if (value === 'C') {
      state.change = 0;
      state.isNegativeZero = !RESOURCE_INFOS[type].usePositiveCalculator;

      state.resourceChanges.heat = 0;
      state.resourceChanges.steel = 0;
      state.resourceChanges.titanium = 0;
    } else if (value === '±') {
      if (state.change === 0) {
        state.isNegativeZero = !state.isNegativeZero;
      } else {
        state.change = state.change * -1;
      }
    } else if (typeof value === 'string') {
      if (state.isNegativeZero) {
        state.change = -value;
      } else {
        state.change = Number.parseInt(state.change + value);
      }
    } else {
      state.change = state.change + value;
    }

    state.change = Math.min(Math.max(state.change, -999), 999);

    if (state.change !== 0) {
      state.isNegativeZero = false;
    }

    this.capResourceValues();
    this.setState(state);
  };

  onToggle = (type) => {
    const { state } = this;

    state.useResources[type] = !state.useResources[type];

    if (type === RESOURCE_TYPES.STEEL) {
      state.useResources.titanium = false;
    } else if (type === RESOURCE_TYPES.TITANIUM) {
      state.useResources.steel = false;
    }

    this.capResourceValues();
    this.setState(state);
  };

  renderActionButton = () => {
    const { classes, type, resourceCounts } = this.props;
    const { change } = this.state;

    const total = resourceCounts[type] + change + this.getResourcesValue();
    const isDisabled = change === 0 || total < 0;
    const threshold = RESOURCE_INFOS[type].usePositiveCalculator ? -1 : 0;
    const backgroundColor = change <= threshold ? '#ED4E44' : '#5FB365';

    return (
      <Button
        className={ classes.actionButton }
        contentClass={ classes.actionButtonContent }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onClick={ this.onChange }
      >
        <div className={ classes.actionText }>New Total:</div>
        <div className={ classes.actionChangeText }>{ total }</div>
      </Button>
    );
  };

  renderAdditionalResource = (type) => {
    const { classes, resourceCounts } = this.props;
    const { change, resourceChanges, useResources } = this.state;
    const resourceCount = resourceCounts[type];
    const useResource = useResources[type];

    if (!resourceCount || !useResource) {
      return null;
    }

    const resourceChange = resourceChanges[type];
    const resourceTotal = resourceCount - resourceChange;
    const { color, image, multiplier } = RESOURCE_INFOS[type];
    const isDownDisabled = resourceChange === 0;
    const isUpDisabled = !change || resourceTotal <= 0 || this.getResourcesValue() + multiplier > -change;

    const resourceImageClass = isDownDisabled && isUpDisabled ?
      classes.resourceImageDisabled :
      classes.resourceImage;

    const resourceChangeTextClass = isDownDisabled && isUpDisabled ?
      classes.resourceChangeTextDisabled :
      classes.resourceChangeText;

    const colorStyle = { color: type ? color : '#222222' };
    const resourcesText = '+' + resourceChange * multiplier;

    return (
      <div className={ classes.tabulatorTab }>
        <div className={ classes.resourceAdjuster }>
          { this.renderResourceButton(type, 'minus', () => this.onAdjustResource(type, -1), isDownDisabled) }
          <Ingredient className={ resourceImageClass } ingredient={ { image, type, value: resourceChanges[type] } } />
          { this.renderResourceButton(type, 'plus', () => this.onAdjustResource(type, 1), isUpDisabled) }
          { this.renderResourceButton(type, 'chevron-right', () => this.onFastForwardResource(type), isUpDisabled) }
        </div>
        <div className={ resourceChangeTextClass } style={ colorStyle }>{ resourcesText }</div>
      </div>
    );
  };

  renderKeyPadButton = (value, backgroundColor, isSmall) => {
    const { classes } = this.props;

    if (value === '±') {
      return (
        <Button
          className={ classes.button }
          contentClass={ classes.buttonPlusMinus }
          backgroundColor={ backgroundColor }
          onClick={() => this.onKeyPad(value)}
        >
          +<br />-
        </Button>
      );
    }

    const text = typeof value === 'string' ? value : value >= 0 ? '+' + value : value;
    const textClass = isSmall ? classes.keyPadTextSmall : classes.keyPadTextLarge;

    return (
      <Button
        className={ classes.button }
        backgroundColor={ backgroundColor }
        onClick={ () => this.onKeyPad(value) }
        text={ text }
        textClass={ textClass }
        textColor="#222222"
      />
    );
  };

  renderResourceButton = (type, icon, onClick, isDisabled) => {
    const { classes, type: calculatorType } = this.props;

    const className = isDisabled ? classes.resourceDisabled : classes.resource;
    const colorStyle = { color: RESOURCE_INFOS[calculatorType].color };

    return (
      <Button
        className={ className }
        icon={ icon }
        iconClass={ classes.resourceButton }
        iconStyle={ colorStyle }
        isBackgroundVisible={ false }
        isDisabled={ isDisabled }
        onClick={ onClick }
        showBackground={ false }
      />
    );
  };

  renderResourceToggleButtons = () => {
    const { classes, type } = this.props;

    if (type !== RESOURCE_TYPES.MEGACREDITS) {
      return null;
    }

    const toggleTypes = [ RESOURCE_TYPES.HEAT, RESOURCE_TYPES.STEEL, RESOURCE_TYPES.TITANIUM ];

    return (
      <div className={ classes.toggleButtons }>
        { toggleTypes.map((type) => this.renderToggleButton(type)) }
      </div>
    );
  };

  renderToggleButton = (type) => {
    const { classes, resourceCounts } = this.props;

    if (!resourceCounts[type]) {
      return null;
    }

    const resourceInfo = RESOURCE_INFOS[type];
    const image = resourceInfo.image;

    return (
      <Button
        key={ type }
        className={ classes.toggleButton }
        onClick={ () => this.onToggle(type) }
        isBackgroundVisible={ false }
      >
        <img className={ classes.toggleButtonResourceImage } alt='' src={ image } />
        { this.renderToggleIcon(type) }
      </Button>
    );
  };

  renderToggleIcon = (type) => {
    const { classes } = this.props;
    const { useResources } = this.state;

    return useResources[type] ? (
      <div className={ classes.resourceTint }>
        <Icon className={ classes.toggleButtonIcon } icon="chevron-circle-down" />
      </div>
    ) : null;
  };

  render () {
    const { classes,resourceCounts, type } = this.props;
    const { change, isNegativeZero } = this.state;

    const resourceCount = resourceCounts[type];
    const resourceInfo = RESOURCE_INFOS[type];
    const backgroundColorStyle = { backgroundColor: type ? resourceInfo.color : '#EEEEEE' };
    const colorStyle = { color: type ? resourceInfo.color : '#222222' };

    const color = Color(resourceInfo.color);
    const white = Color('#FFFFFF');
    const lighterColor = color.mix(white, 0.65).toString();

    const changeText = isNegativeZero ? '-0' : change >= 0 ? '+' + change : change;

    return (
      <div className={ classes.container }>
        { this.renderResourceToggleButtons() }
        <div className={ classes.keyPad } style={ backgroundColorStyle }>
          <div className={ classes.numPad }>
            <div className={ classes.keyPadRow }>
              { this.renderKeyPadButton('7', '#FFFFFF') }
              { this.renderKeyPadButton('8', '#FFFFFF') }
              { this.renderKeyPadButton('9', '#FFFFFF') }
            </div>
            <div className={ classes.keyPadRow }>
              { this.renderKeyPadButton('4', '#FFFFFF') }
              { this.renderKeyPadButton('5', '#FFFFFF') }
              { this.renderKeyPadButton('6', '#FFFFFF') }
            </div>
            <div className={ classes.keyPadRow }>
              { this.renderKeyPadButton('1', '#FFFFFF') }
              { this.renderKeyPadButton('2', '#FFFFFF') }
              { this.renderKeyPadButton('3', '#FFFFFF') }
            </div>
            <div className={ classes.keyPadRow }>
              { this.renderKeyPadButton('C', lighterColor) }
              { this.renderKeyPadButton('0', '#FFFFFF') }
              { this.renderKeyPadButton('±', lighterColor) }
            </div>
          </div>
          <div className={ classes.steppers }>
            { this.renderKeyPadButton(5, lighterColor, true) }
            { this.renderKeyPadButton(1, lighterColor, true) }
            { this.renderKeyPadButton(-1, lighterColor, true) }
            { this.renderKeyPadButton(-5, lighterColor, true) }
          </div>
        </div>
        <div className={ classes.tabulator }>
          <div className={ classes.tabulatorRow }>
            <div className={ classes.tabulatorText } style={ colorStyle }>{ `Current:` }</div>
            <div className={ classes.currentText } style={ colorStyle }>
              { resourceCount }
            </div>
          </div>
          <div className={ classes.keyPadTab } style={ backgroundColorStyle }>
            <div className={ classes.keyPadTabText }>{ `Change:` }</div>
            <div className={ classes.changeText }>{ changeText }</div>
          </div>
          { this.renderAdditionalResource(RESOURCE_TYPES.HEAT) }
          { this.renderAdditionalResource(RESOURCE_TYPES.STEEL) }
          { this.renderAdditionalResource(RESOURCE_TYPES.TITANIUM) }
          { this.renderActionButton() }
        </div>
      </div>
    );
  }

}

const styles = {

  actionButton: {
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
    marginLeft: '0.5rem',
    paddingLeft: '0.55rem',
    paddingRight: '0.25rem',
    flex: 1
  },

  actionButtonContent: {
    display: 'flex',
    alignItems: 'flex-start',
  },

  actionChangeText: {
    alignSelf: 'center',
    fontSize: '3rem',
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: '-0.5rem'
  },

  actionText: {
    flex: 1,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: '0.4rem'
  },

  button: {
    margin: '0.2rem',
    padding: 0,
    flex: 1
  },

  buttonPlusMinus: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    lineHeight: '1rem',
    textAlign: 'center'
  },

  changeText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '-0.1rem'
  },

  container: {
    padding: '0.5rem',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },

  currentText: {
    fontSize: '3rem',
    textAlign: 'right',
    color: '#FFCC33',
    marginTop: '-0.5rem',
    marginRight: '0.35rem'
  },

  keyPad: {
    borderRadius: '0.5rem',
    padding: '0.5rem',
    display: 'flex',
    flex: 1
  },

  keyPadButton: {
    borderRadius: '0.5rem'
  },

  keyPadRow: {
    display: 'flex',
    flex: 1
  },

  keyPadTab: {
    borderTopRightRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    paddingRight: '0.5rem',
    paddingLeft: '0.6rem',
    // marginBottom: '0.5rem',
    marginLeft: '-0.1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },

  keyPadTabText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: '0.5rem',
    marginBottom: '-0.2rem'
  },

  keyPadPlusMinus: {
    fontSize: '2.2rem',
    textAlign: 'center',
    marginTop: '-0.65rem 0.1rem -0.65rem 0'
  },

  keyPadTextLarge: {
    fontSize: '1.9rem'
  },

  keyPadTextSmall: {
    fontSize: '1.7rem'
  },

  numPad: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3
  },

  resource: {
    padding: 0
  },

  resourceAdjuster: {
    width: '8rem',
    marginLeft: '0.15rem',
    marginRight: '0.25rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  resourceButton: {
    fontSize: '1.8rem',
    color: '#222222'
  },

  resourceChangeText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '0.35rem',
    marginVertical: '-0.6rem'
  },

  resourceChangeTextDisabled: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '0.35rem',
    marginVertical: '-0.6rem',
    opacity: 0.5
  },

  resourceDisabled: {
    padding: 0,
    opacity: 0.25
  },

  resourceImage: {
    width: '2.2rem',
    height: '2.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  resourceImageDisabled: {
    width: '2.2rem',
    height: '2.2rem',
    opacity: 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  resourcesText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '-0.1rem'
  },

  resourceText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 5
  },

  resourceTint: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 5,
    padding: '0.1rem',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  steppers: {
    marginLeft: '0.5rem',
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },

  tabulator: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },

  tabulatorRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  tabulatorTab: {
    marginLeft: '0.5rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  tabulatorText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#444444',
    marginLeft: '0.5rem'
  },

  toggleButton: {
    marginLeft: '0.5rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  toggleButtonIcon: {
    fontSize: '1.3rem',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 5
  },

  toggleButtonResourceImage: {
    width: '2.2rem',
    height: '2.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  toggleButtons: {
    display: 'flex',
    position: 'absolute',
    top: '-2.7rem',
    right: '3.25rem'
  }

};

const mapStateToProps = (state) => {
  const { game } = state;

  return {
    resourceCounts: game.resourceCounts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    changeCounts,
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CalculatorModal));
import If from "components/If";

import React, { Component } from 'react';
import withStyles from "react-jss";

import { RESOURCE_INFOS } from 'store/game/gameConstants';

const { abs } = Math;

class Ingredient extends Component {

  render () {
    const { classes, ingredient, isVerbose } = this.props;
    const { image, isProduction, type, value } = ingredient;
    const resourceInfo = RESOURCE_INFOS[type];
    const isHidden = resourceInfo.hideIngredient && !isVerbose;

    if (!image || isHidden) {
      return null;
    }

    const frameClass = isProduction ? classes.frameProduction : classes.frame;
    const imageClass = isProduction ? classes.imageProduction : classes.image;
    const absValue = resourceInfo.hideValue ? 0 : abs(value);
    const displayValue = absValue > 1 ? absValue : null;

    return (
      <div className={ frameClass }>
        <img className={ imageClass } alt='' src={ image } />
        <If condition={ displayValue }>
          <div className={ classes.value }>{ displayValue }</div>
        </If>
      </div>
    );
  }

}

const styles = {

  frame: {
    height: '1.8rem',
    margin: '0.2rem',
    position: 'relative'
  },

  frameProduction: {
    backgroundColor: '#B37D43',
    width: '1.8rem',
    height: '1.8rem',
    borderColor: '#222222',
    borderWidth: 1,
    margin: '0.2rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    height: '1.8rem'
  },

  imageProduction: {
    height: '1.3rem'
  },

  value: {
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '0rem 0rem 0.2rem #000000',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }

};

export default withStyles(styles)(Ingredient)
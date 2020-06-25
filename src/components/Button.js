import If from 'components/If';

import { debounce } from 'lodash';

import React, { Component } from 'react';
import withStyles from 'react-jss';
import { Icon } from 'react-onsenui';

class Button extends Component {

  static defaultProps = {
    backgroundColor: '#5b8bdd',
    border: '0.2rem solid #222222',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    hasShadow: true,
    iconColor: '#ffffff',
    iconSize: '1.3rem',
    padding: '0.5rem 1rem',
    textAlign: 'center',
    textColor: '#ffffff'
  };

  state = {
    isPressed: false,
    showPressed: false
  };

  buttonRef = null;

  componentDidMount () {
    window.addEventListener('mouseup', this.onGlobalUp, true);
    window.addEventListener('touchend', this.onGlobalUp, true);
  }

  componentWillUnmount () {
    window.removeEventListener('mouseup', this.onGlobalUp, true);
    window.removeEventListener('touchend', this.onGlobalUp, true);
  }

  onDown = (event) => {
    event.stopPropagation();

    if (!this.props.isDisabled) {
      this.setState({ isPressed: true, showPressed: true });
    }
  };

  onGlobalUp = () => {
    if (this.state.isPressed) {
      setTimeout(() => this.setState({ isPressed: false, showPressed: false }), 0);
    }
  };

  onOut = () => {
    if (!this.props.isDisabled) {
      this.setState({ showPressed: false });
    }
  };

  onOver = (event) => {
    event.stopPropagation();

    if (!this.props.isDisabled) {
      this.setState({ showPressed: this.state.isPressed });
    }
  };

  onUp = () => {
    if (this.state.showPressed) {
      const { onClick, useDebounce } = this.props;

      if (onClick) {
        if (useDebounce) {
          debounce(onClick, 250, { leading: true, trailing: false });
        } else {
          onClick();
        }
      }

      this.setState({ isPressed: false, showPressed: false })
    }
  };

  render () {
    const {
      children,
      classes,
      className,
      icon,
      iconClass,
      text,
      textClass,
    } = this.props;

    let buttonStyle = this.state.isPressed ? classes.buttonPressed : classes.button;

    if (className) {
      buttonStyle = `${ buttonStyle } ${ className }`;
    }

    const iconStyle = iconClass ? `${ classes.icon } ${ iconClass }` : classes.icon;
    const textStyle = textClass ? `${ classes.text } ${ textClass }` : classes.text;

    return (
      <div
        className={ buttonStyle }
        onPointerDown={ this.onDown }
        onPointerOut={ this.onOut }
        onPointerOver={ this.onOver }
        onPointerUp={ this.onUp }
        ref={ (ref) => this.buttonRef = ref }
      >
        <div className={ classes.content }>
          <If condition={ icon }>
            <Icon className={ iconStyle } icon={ icon } />
          </If>
          <If condition={ text }>
            <div className={ textStyle }>{ text }</div>
          </If>
          { children }
        </div>
      </div>
    );
  }

}

const styles = {

  button: {
    backgroundColor: (props) => props.isDisabled ? '#cccccc' : props.backgroundColor,
    border: (props) => props.border,
    borderRadius: (props) => props.borderRadius,
    boxShadow: (props) => props.hasShadow ? `0px 2px 2px rgba(0, 0, 0, 0.4)` : null,
    padding: (props) => props.padding,
  },

  buttonPressed: {
    backgroundColor: (props) => props.isDisabled ? '#cccccc' : props.backgroundColor,
    border: (props) => props.border,
    borderRadius: (props) => props.borderRadius,
    boxShadow: (props) => props.hasShadow ? `0px 2px 2px rgba(0, 0, 0, 0.4)` : null,
    padding: (props) => props.padding,
    opacity: 0.5
  },

  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  icon: {
    color: (props) => props.iconColor,
    fontSize: (props) => props.iconSize,
    opacity: (props) => props.isDisabled ? 0.5 : 1,
    marginRight: (props) => `calc(${ props.iconSize } * 0.25)`,
    pointerEvents: 'none'
  },

  text: {
    color: (props) => props.textColor,
    fontSize: (props) => props.fontSize,
    fontWeight: (props) => props.fontWeight,
    textAlign: (props) => props.textAlign,
    opacity: (props) => props.isDisabled ? 0.5 : 1,
    pointerEvents: 'none'
  }

};

export default withStyles(styles)(Button);
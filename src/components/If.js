import React, { Fragment, Component } from 'react';

export default class If extends Component {

  render () {
    const { children, condition } = this.props;

    return condition ? <Fragment>{ children }</Fragment> : null;
  }

}

import React, { Component } from 'react';
import withStyles from 'react-jss';

class InfoModal extends Component {

  render () {
    return (
      <div style={ styles.container }>
      </div>
    );
  }

}

const styles = {

  container: {
    display: 'flex',
    padding: '1rem'
  }

};

export default withStyles(styles)(InfoModal);
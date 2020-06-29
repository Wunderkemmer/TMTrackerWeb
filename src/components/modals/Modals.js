import React, { Component } from 'react';
import withStyles from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RESOURCE_INFOS } from 'store/game/gameConstants';
import { hideModal } from 'store/ui/uiActions';

import Button from 'components/Button';

class Modal extends Component {

  squelch = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  renderImage = () => {
    const { classes, type } = this.props;
    const image = type ? RESOURCE_INFOS[type].image : null;

    return image ? (
      <img className={ classes.modalHeaderImage } alt='' src={ image } />
    ) : null;
  };

  renderTitle = () => {
    const { classes, title, type } = this.props;
    const displayTitle = type ? 'Update ' + RESOURCE_INFOS[type].title : title;

    return displayTitle ? (
      <div className={ classes.modalHeaderText }>{ displayTitle }</div>
    ) : null;
  };

  render () {
    const { classes, content, hide, type } = this.props;
    const modalStyle = content.publicStyles ? content.publicStyles.popup : null;
    const headerStyle = { backgroundColor: type ? RESOURCE_INFOS[type].color : '#5b8bdd' };

    return (
      <div className={ classes.modalOverlay } onClick={ hide }>
        <div className={ classes.modal } onClick={ this.squelch } style={ modalStyle }>
          <div className={ classes.modalHeader } style={ headerStyle }>
            { this.renderImage() }
            { this.renderTitle() }
            <div className={ classes.modalHeaderFiller } />
            <Button
              className={ classes.modalCloseButton }
              backgroundColor="#FF0000"
              hideShadow={ true }
              icon="times"
              iconColor="#FFFFFF"
              onClick={ hide }
            />
          </div>
          <div className={ classes.modalContent } >
            { React.createElement(content, this.props) }
          </div>
        </div>
      </div>
    );
  }

}

class Modals extends Component {

  hideModal (props) {
    const { id, onHide } = props;

    this.props.actions.hideModal(id);

    onHide && onHide();
  }

  render () {
    const { classes, modals } = this.props;

    return (
      <div className={ classes.modals }>
        {
          modals.map((props, index) => (
            <StyledModal key={ index } { ...props } hide={ () => this.hideModal(props) } />)
          )
        }
      </div>
    );
  }

}

const styles = {

  modal: {
    backgroundColor: '#FFFFFF',
    minWidth: '30rem',
    height: '80%',
    border: '0.2rem solid #222222',
    borderRadius: '1rem',
    margin: '0.2rem',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column'
  },

  modalCloseButton: {
    borderRadius: '0.5rem',
    width: '2.3rem',
    height: '2.3rem',
    padding: 0
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.8rem',
    position: 'relative',
    display: 'flex',
    flex: 1
  },

  modalHeader: {
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '3.2rem',
    padding: '0 0.25rem 0 0.5rem',
    display: 'flex',
    alignItems: 'center'
  },

  modalHeaderFiller: {
    flex: 1
  },

  modalHeaderImage: {
    width: '2.2rem',
    height: '2.2rem'
  },

  modalHeaderText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: (props) => props.type ? '#222222' : '#FFFFFF',
    margin: '0.2rem',
    paddingLeft: '0.35rem'
  },

  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  modals: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

};

const StyledModal = withStyles(styles)(Modal);

const mapStateToProps = (state) => {
  const { modals } = state.ui;

  return {
    modals
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    hideModal
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Modals));
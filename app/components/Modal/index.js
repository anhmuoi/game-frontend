import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogContent from '@material-ui/core/DialogContent';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import SnackbarsUI from '../../components/SnackbarsUI';
import classNames from 'classnames';

import { Button } from '@material-ui/core';
import messages from '../Common/messages.js';
import { FormattedMessage } from 'react-intl';
const WINDOW_HEIGHT = window.innerHeight;

export const styles = (theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,
    outline: 'none',
    maxHeight: WINDOW_HEIGHT * 0.8,
    overflow: 'auto',
  },
  bodyContent: {
    overflow: 'hidden',
  },
  // button: {
  //   margin: theme.spacing.unit,
  // },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },

  buttons: {
    display: 'flex',
    justifyContent: 'center',
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    transform: `translateY(${theme.spacing.unit * 2 + 2}px)`,
    paddingBottom: theme.spacing.unit * 2,
    zIndex: 10,
  },
  button: {
    margin: theme.spacing.unit,
    width: 100,
    transform: `translateY(${theme.spacing.unit}px)`,
  },

  smallIcon: {
    fontSize: 20,
  },
});

export class ModalMaterialUi extends React.PureComponent {
  render() {
    const {
      classes,
      isOpenModal,
      onCloseModal,
      children,
      isLoading,
      onHideNotify,
      notify,
      shapeModal,
      onOpenDialog,
      onActionAgreeDialog,
      onCloseDialogDialog,
      titleDialog,
      messsageDialog,
      styleDialog,
      onCancel,
      onSave,
      disableSave,
      disableClickOutSide,
      onPreview,
    } = this.props;

    return (
      <Modal
        disableEnforceFocus
        disableBackdropClick={disableClickOutSide}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={isOpenModal}
        onClose={onCloseModal}
        // disableAutoFocus
      >
        <DialogContent>
          <AlertDialogSlideUI
            id="dialog-access-group"
            onOpen={onOpenDialog}
            onActionAgree={onActionAgreeDialog}
            onCloseDialog={onCloseDialogDialog}
            title={titleDialog}
            messsage={messsageDialog}
            styleDialog={styleDialog}
          />
          <SnackbarsUI
            open={notify.open}
            message={notify.message}
            onClose={onHideNotify}
            typeAlert={notify.type}
          />
          {isLoading ? <LinearProgress /> : null}
          <div className={classes.paper} style={shapeModal}>
            <div className={classes.bodyContent}>{children}</div>
            <ModalMaterialUiWrapped />
            <div className={classes.buttons}>
              {onPreview && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={onPreview}
                  id="btnCancel"
                >
                  <FormattedMessage {...messages.preview} />
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="contained"
                  color="default"
                  className={classes.button}
                  onClick={onCancel}
                  id="btnCancel"
                >
                  <CancelIcon
                    className={classNames(classes.rightIcon, classes.smallIcon)}
                  />
                  <FormattedMessage {...messages.cancel} />
                </Button>
              )}
              {onSave && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onSave}
                  className={classes.button}
                  id="btnSave"
                  disabled={disableSave}
                >
                  <SaveIcon
                    className={classNames(classes.rightIcon, classes.iconSmall)}
                  />
                  <FormattedMessage {...messages.save} />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  }
}

ModalMaterialUi.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpenModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.element,
  ]),
  isLoading: PropTypes.bool,
  onHideNotify: PropTypes.func,
  notify: PropTypes.object,
  shapeModal: PropTypes.object,
  // dialog
  onOpenDialog: PropTypes.bool,
  onActionAgreeDialog: PropTypes.func,
  onCloseDialogDialog: PropTypes.func,
  disableSave: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  onPreview: PropTypes.func,
  titleDialog: PropTypes.object,
  messsageDialog: PropTypes.object,
  styleDialog: PropTypes.string,
  disableClickOutSide: PropTypes.bool,
};

ModalMaterialUi.defaultProps = {
  onOpenDialog: false,
  onActionAgreeDialog: () => {},
  onCloseDialogDialog: () => {},
  titleDialog: <span />,
  messsageDialog: <span />,
  styleDialog: '',
  shapeModal: {
    width: '50%',
    top: '10%',
    left: '25%',
  },
  isOpenModal: false,
  isLoading: false,
  notify: {
    open: false,
    type: 'warning',
    message: '',
  },
};
// We need an intermediary variable for handling the recursive nesting.
const ModalMaterialUiWrapped = withStyles(styles)(ModalMaterialUi);

export default ModalMaterialUiWrapped;

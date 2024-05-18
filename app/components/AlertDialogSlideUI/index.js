import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Tooltip } from '@material-ui/core';
import { FaQuestionCircle } from 'react-icons/fa';
import messages from './messages';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const style = (theme) => ({
  tooltip: {
    color: theme.palette.primary.main,
  },
  content: {
    width: '100%',
    heght: '100%',
  },
});
class AlertDialogSlideUI extends React.Component {
  onHandleAgree = () => {
    this.props.onActionAgree();
    this.props.onCloseDialog();
  };

  onHandleDisagree = () => this.props.onCloseDialog();

  render() {
    const {
      onOpen,
      messsage,
      classes,
      tooltip,
      title,
      id,
      styleDialog,
      messageStyle,
    } = this.props;
    return title ? (
      <Dialog
        id={id}
        open={onOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.onHandleDisagree}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={styleDialog}
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText
            id="alert-dialog-slide-description"
            style={{ ...messageStyle, color: '#2b2b2b' }}
          >
            {messsage}
          </DialogContentText>
          <div style={{ float: 'right' }}>
            {tooltip ? (
              <Tooltip title={tooltip}>
                <FaQuestionCircle className={classes.tooltip} size={32} />
              </Tooltip>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.onHandleDisagree}
            color="primary"
            className="alertDialogSlideUI-disagree"
            id="btnDisagree"
          >
            <FormattedMessage {...messages.btnDisagree} />
          </Button>
          <Button
            onClick={this.onHandleAgree}
            aria-label="alertDialogSlideUI-agree"
            color="primary"
            className="alertDialogSlideUI-agree"
            id="btnAgree"
          >
            <FormattedMessage {...messages.btnAgree} />
          </Button>
        </DialogActions>
      </Dialog>
    ) : null;
  }
}

AlertDialogSlideUI.defaultProps = {
  messageStyle: {},
};

AlertDialogSlideUI.propTypes = {
  onOpen: PropTypes.bool,
  messsage: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  title: PropTypes.object,
  onActionAgree: PropTypes.func,
  onCloseDialog: PropTypes.func,
  id: PropTypes.string,
  styleDialog: PropTypes.string,
  classes: PropTypes.object,
  tooltip: PropTypes.object,
  messageStyle: PropTypes.object,
};

export default withStyles(style)(AlertDialogSlideUI);

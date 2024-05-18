import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

import MySnackbarContentWrapper from './MySnackbarContent';

const styles2 = (theme) => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class SnackbarsUI extends React.PureComponent {
  /**
   * onClose: function props hanlde: change open (props) true => false
   */
  render() {
    const { typeAlert, duration, anchor, message, open, onClose } = this.props;

    return (
      <Snackbar
        anchorOrigin={anchor}
        open={open || typeof open === 'string'}
        autoHideDuration={duration}
        onClose={onClose}
      >
        <MySnackbarContentWrapper
          onClose={onClose}
          variant={typeAlert}
          message={message}
        />
      </Snackbar>
    );
  }
}

SnackbarsUI.propTypes = {
  typeAlert: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  anchor: PropTypes.object,
  message: PropTypes.string,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onClose: PropTypes.func,
};

SnackbarsUI.defaultProps = {
  typeAlert: 'success',
  duration: 5000,
  anchor: {
    vertical: 'top',
    horizontal: 'right',
  },
};

export default withStyles(styles2)(SnackbarsUI);

import React from 'react';
import { FormattedMessage } from 'react-intl';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getProcessListObj } from 'containers/App/selectors';
import messages from './messages';
import {
  STATUS_PREPARING,
  STATUS_DOWNLOADING,
  STATUS_UPLOADING,
  STATUS_UPDATING,
  STATUS_COMPLETED,
  STATUS_STOP,
  STATUS_FAILED,
  STATUS_REINSTALLING,
  STATUS_TRANSMITTING,
} from './constants';

const styles = () => ({
  progressbarDescription: {
    // float: 'left',
    // marginLeft: 10
  },
  progressbarPercentage: {
    // float: 'right',
    position: 'absolute',
    left: '43%',
    top: 15,
  },
  progressbarWidth: {
    width: '100%',
  },
  linearColorCompleted: {
    backgroundColor: '#e0f2f1',
  },
  linearBarColorCompleted: {
    backgroundColor: '#26a69a',
  },
  linearColorProgressing: {
    backgroundColor: '#e1f5fe',
  },
  linearBarColorProgressing: {
    backgroundColor: '#03a9f4',
  },
  linearColorStop: {
    backgroundColor: '#ea8f8f',
  },
  linearBarColorStop: {
    backgroundColor: '#d32f2f',
  },
  linearColorFinishing: {
    backgroundColor: '#e1f5fe',
  },
  linearBarColorFinishing: {
    backgroundColor: '#ffff00',
  },
});

class ProgressBarSp extends React.Component {
  getStringStatus = status => {
    if (status === STATUS_DOWNLOADING)
      return <FormattedMessage {...messages.statusDownloading} />;
    else if (status === STATUS_UPDATING)
      return <FormattedMessage {...messages.statusUpdating} />;
    else if (status === STATUS_COMPLETED)
      return <FormattedMessage {...messages.statusCompleted} />;
    else if (status === STATUS_STOP)
      return <FormattedMessage {...messages.statusStop} />;
    else if (status === STATUS_PREPARING)
      return <FormattedMessage {...messages.statusPreparing} />;
    else if (status === STATUS_FAILED)
      return <FormattedMessage {...messages.statusFailed} />;
    else if (status === STATUS_UPLOADING)
      return <FormattedMessage {...messages.statusUploading} />;
    else if (status === STATUS_REINSTALLING)
      return <FormattedMessage {...messages.statusReinstalling} />;
    else if (status === STATUS_TRANSMITTING)
      return <FormattedMessage {...messages.statusTransmitting} />;
    return status;
  };

  getProgressColor = (classes, status) => {
    if (status === STATUS_STOP || status === STATUS_FAILED)
      return {
        colorPrimary: classes.linearColorStop,
        barColorPrimary: classes.linearBarColorStop,
      };
    else if (status === STATUS_COMPLETED)
      return {
        colorPrimary: classes.linearColorCompleted,
        barColorPrimary: classes.linearBarColorCompleted,
      };
    else if (status === STATUS_UPDATING)
      return {
        colorPrimary: classes.linearColorFinishing,
        barColorPrimary: classes.linearBarColorFinishing,
      };
    return {
      colorPrimary: classes.linearColorProgressing,
      barColorPrimary: classes.linearBarColorProgressing,
    };
  };

  render() {
    const { progressObj, progressId, classes } = this.props;
    const process = progressObj.get(progressId).toJS();
    // console.log(progressId, process);
    return (
      <div
        style={{
          position: 'relative',
          marginTop: `5px`,
          marginBottom: `5px`,
          textAlign: 'center',
        }}
      >
        {process && (
          <div>
            <CircularProgress
              // style={{ width: '100%' }}
              // classes={this.getProgressColor(classes, process.status)}
              variant="static"
              value={process.progress}
              size={50}
            />
            <span className={classes.progressbarPercentage}>
              {Math.round(process.progress)}%
            </span>
            <div className={classes.progressbarDescription}>
              [{this.getStringStatus(process.status)}] {process.name}
            </div>
          </div>
        )}
      </div>
    );
  }
}
ProgressBarSp.propTypes = {
  progressId: PropTypes.string,
  classes: PropTypes.object.isRequired,
  progressObj: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  progressObj: getProcessListObj(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withConnect,
  withStyles(styles),
)(ProgressBarSp);

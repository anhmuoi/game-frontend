/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Popover from '@material-ui/core/Popover';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Switch from '@material-ui/core/Switch';
import { createStructuredSelector } from 'reselect';
import { RESTART_ON_REMOUNT, MQTT_TYPE } from 'utils/constants';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  getNotificationShortList,
  deleteNotification,
  changeNotificationStatus,
  deleteAllRead,
  markAllRead,
  notificationDetail,
  getNotificationList,
} from './actions';
import messages from './messages';
import { countCreatedDuration } from './utils';
import {
  makeNotificationShortListSelector,
  makeUnreadCountNotificationSelector,
} from './selectors';
import { localstoreUtilites } from '../../utils/persistenceData';
import { isOnNotificationPage } from './utils';
import saga from './saga';
import reducer from './reducer';

const styles = () => ({
  notificationContainer: {
    padding: '12px',
    cursor: 'pointer',
  },
  notifButton: {
    marginRight: '15px',
  },
  buttonsNotif: {
    borderBottom: '1px solid #ccc7c7',
    padding: '16px',
  },
  notifType: {
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifACTIONTypeText: {
    color: 'red',
    textTransform: 'uppercase',
    display: 'inline-block',
    backgroundColor: '#f1dbdb',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  notifItemContent: {
    color: '#3e3d3d',
    fontSize: '14px',
    maxWidth: '280px',
    marginBottom: '5px',
  },
  notifTime: {
    color: '#3e3d3d',
    fontSize: '13px',
    fontStyle: 'italic',
  },
  notifItem: {
    borderBottom: '1px solid #ccc7c7',
    padding: '16px',
    cursor: 'pointer',
  },
  notifWARNINGTypeText: {
    color: 'orange',
    textTransform: 'uppercase',
    display: 'inline-block',
    backgroundColor: '#f3eadb',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  notifINFORMTypeText: {
    color: '#1074de',
    textTransform: 'uppercase',
    display: 'inline-block',
    backgroundColor: '#d0dfef',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  notifIcons: {
    position: 'relative',
    top: '-4px',
  },
  deleteNotifIcon: {
    cursor: 'pointer',
  },
  viewAllLink: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
  },
  readNotif: {
    backgroundColor: '#f5f5f5',
  },
  backgroundIcon: {
    backgroundColor: '#D5DEE8',
    borderRadius: '20px',
    padding: '7px 7px',
  },
});

const topic = [
  MQTT_TYPE.NOTIFICATION.topic.concat(
    `/${localstoreUtilites.getCompanycodeFromLocalStorage()}/${localstoreUtilites.getUserIdFromLocalStorage()}`,
  ),
];

class NotificationUI extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      anchorElNotif: null,
    };
  }

  mqttConnect = () => {
    window.DeMaster_Mqtt_Client.subscribeTopics(topic).addReciveMessageHandler(
      (message) => {
        const messageQueue = JSON.parse(message.payloadString);
        if (messageQueue.type === MQTT_TYPE.NOTIFICATION.type) {
          // this.props.onGetNotifications();

          if (isOnNotificationPage()) {
            this.props.onGetFulllNotifications();
          }
        }
      },
    );
  };

  componentDidMount() {
    // this.mqttConnect();
    this.props.onGetNotifications();
  }

  componentWillUnmount() {
    // unsubscribe topic for this page here
    window.DeMaster_Mqtt_Client.unSubscribe(topic)
      .removeReciveMessageHandler()
      .removeConnectLostHandler();
  }

  handleClickNotif = (event) => {
    this.setState({
      anchorElNotif: event.currentTarget,
    });
  };

  handleCloseNotif = () => {
    this.setState({
      anchorElNotif: null,
    });
  };

  navigateNotifDetail = (notif) => {
    this.handleCloseNotif();
    this.props.onNotificationDetail(notif);
  };

  render() {
    const {
      classes,
      notificationShortList,
      onDeleteNotification,
      onChangeNotificationStatus,
      onDeleteAllRead,
      onMarkAllAsRead,
      totalUnRead,
      intl,
    } = this.props;

    const { anchorElNotif } = this.state;

    const notifOpen = Boolean(anchorElNotif);
    const id = notifOpen ? 'simple-popover' : undefined;

    return (
      <div className={classes.notificationContainer}>
        <Badge
          badgeContent={totalUnRead}
          color="secondary"
          onClick={this.handleClickNotif}
          id="notification-badge"
          className={classes.backgroundIcon}
        >
          <NotificationsIcon aria-describedby={id} color="primary" />
        </Badge>
        <Popover
          id={id}
          open={notifOpen}
          anchorEl={anchorElNotif}
          onClose={this.handleCloseNotif}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.notifContent}>
            <div className={classes.buttonsNotif}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                classes={{
                  root: classes.notifButton,
                }}
                onClick={() => onMarkAllAsRead()}
                id="markAllAsRead"
              >
                <FormattedMessage {...messages.markAllAsRead} />
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => onDeleteAllRead()}
                id="deleteAllRead"
              >
                <FormattedMessage {...messages.clearAllRead} />
              </Button>
            </div>
            <div className={classes.notifList} id="notification-list-headers">
              {notificationShortList.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => this.navigateNotifDetail(notif)}
                  className={`${classes.notifItem} ${
                    notif.status ? '' : classes.readNotif
                  }`}
                >
                  <div className={classes.notifType}>
                    <span className={classes[`notif${notif.type}TypeText`]}>
                      {notif.transType}
                    </span>
                    <div className={classes.notifIcons}>
                      <Switch
                        checked={!notif.status}
                        name="checkRead"
                        color="primary"
                        className="toggleReadStatus"
                        inputProps={{
                          title: notif.status ? 'READ' : 'UNREAD',
                        }}
                        onChange={(event) =>
                          onChangeNotificationStatus(
                            notif.id,
                            !event.target.checked,
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <DeleteIcon
                        // color="secondary"
                        // style={{ color: colorDelete }}
                        size="medium"
                        className={`${classes.deleteNotifIcon} deleteSingleNoti`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onDeleteNotification(notif.id);
                        }}
                      />
                    </div>
                  </div>
                  <div className={classes.notifItemContent}>
                    <span dangerouslySetInnerHTML={{ __html: notif.content }} />
                  </div>
                  <div className={classes.notifTime}>
                    {countCreatedDuration(notif.createdOn, intl, messages)}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/notifications"
              underline="none"
              className={classes.viewAllLink}
            >
              <FormattedMessage {...messages.viewAllNotification} />
            </Link>
          </div>
        </Popover>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onGetNotifications: () => dispatch(getNotificationShortList()),
  onGetFulllNotifications: () => dispatch(getNotificationList()),
  onDeleteNotification: (id) => dispatch(deleteNotification(id)),
  onChangeNotificationStatus: (id, status) =>
    dispatch(changeNotificationStatus(id, status)),
  onDeleteAllRead: () => dispatch(deleteAllRead()),
  onMarkAllAsRead: () => dispatch(markAllRead()),
  onNotificationDetail: (notif) => dispatch(notificationDetail(notif)),
});

const mapStateToProps = createStructuredSelector({
  notificationShortList: makeNotificationShortListSelector(),
  totalUnRead: makeUnreadCountNotificationSelector(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'notification', reducer });
const withSaga = injectSaga({
  key: 'notification',
  saga,
  mode: RESTART_ON_REMOUNT,
});

NotificationUI.propTypes = {
  classes: PropTypes.object.isRequired,
  onGetNotifications: PropTypes.func,
  onGetFulllNotifications: PropTypes.func,
  notificationShortList: PropTypes.any,
  onDeleteNotification: PropTypes.func,
  onChangeNotificationStatus: PropTypes.func,
  onDeleteAllRead: PropTypes.func,
  totalUnRead: PropTypes.number,
  onMarkAllAsRead: PropTypes.func,
  onNotificationDetail: PropTypes.func,
  history: PropTypes.object,
  intl: PropTypes.any,
};

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(withStyles(styles)(NotificationUI));

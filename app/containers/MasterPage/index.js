/* eslint-disable indent */
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import ReactHtmlParser from 'react-html-parser';
import ApiClient from 'utils/axiosClient';
// import { isPluginEnabled } from 'utils/plugins';
import injectSaga from '../../utils/injectSaga';
import MasterUi from '../../components/MasterUi';
import saga from '../../containers/App/saga';
import WebSocketMqtt from '../../utils/mqtt';
import { MQTT_TYPE, RESTART_ON_REMOUNT } from '../../utils/constants';
import {
  getLogo,
  resetEnqueue,
  // resetNotifyError,
  resetNotifySuccess,
  updateProcesses,
} from 'containers/App/actions.js';
import {
  STATUS_COMPLETED,
  // STATUS_UPDATING,
  STATUS_DOWNLOADING,
  // STATUS_PREPARING,
  // STATUS_UPDATING,
  STATUS_FAILED,
} from '../../components/Datatables/constants';
import { localstoreUtilites, isAdmin } from '../../utils/persistenceData';
import messages from '../../containers/App/messages';
import {
  getProcessListObj,
  makeSelectError,
  makeSelectLoading,
  makeSelectLocation,
  makeSelectLogo,
  makeSelectNotifySuccess,
} from 'containers/App/selectors.js';

const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
const configWs = localstoreUtilites.getConfigWSFromLocalStorage();

export class MasterPage extends React.Component {
  state = {
    countReview: {
      user: 0,
      visit: 0,
    },
  };

  componentDidMount() {
    if (!this.props.logo) {
      // this.props.onGetLogo();
    }

    // request permission to use Notification service
    if (!('Notification' in window)) {
      console.log('Browser does not support desktop notification');
    } else {
      Notification.requestPermission();
    }

    // if (isPluginEnabled('armyManagement')) {
    //   window.addEventListener('beforeunload', () => {
    //     // Execute logout when browser or browser tab is closed
    //     this.logout();
    //   });
    // }
  }

  logout = (isButtonLogout) => {
    localStorage.removeItem('accountStatus');
    localstoreUtilites.removeAuthFromLocalStorage();
    localstoreUtilites.removeConfigWSFromLocalStorage();

    // 2020.04.28 WooCheol Kim
    // There is a issue that can not save datas into localstorage when login
    // So It will all clear when log out except username, language.
    const userName = localstoreUtilites.getUsernameFromLocalStorage();
    const lang = localstoreUtilites.getLanguageFromLocalStorage();
    localstoreUtilites.clearAllFromLocalStorage();
    localstoreUtilites.saveUsernameToLocalStorage(userName);
    localstoreUtilites.saveLanguageToLocalStorage(lang);

    // clear mqtt
    window.DeMaster_Mqtt_Client = null;
    window.Paho = null;

    // Go to login page if it is executed by logout button
    if (isButtonLogout) {
      window.location.assign('/login');
    }
  };

  UNSAFE_componentWillMount() {
    console.log(localstoreUtilites.getConfigWSFromLocalStorage());
    if (configWs && !window.DeMaster_Mqtt_Client) {
      window.DeMaster_Mqtt_Client = new WebSocketMqtt()
        .init()
        .addReciveMessageHandler(this.handleReciveMessageMqtt)
        .onReciveMessage()
        .setTopics([MQTT_TYPE.NOTIFICATION.topic]) // all topic init for app
        .connect(
          (context, topicsIsSubscribed) => {
            context.subscribeTopics(topicsIsSubscribed);
            console.log(topicsIsSubscribed, 'connect success');
          },
          (message) => {
            console.log('connect fail');
            this.props.enqueueSnackbar(`connect failed: ${message}`, {
              variant: 'error',
            });
          },
        );
    }
  }

  /**
   * @param(message) string: message is recived from mqtt server
   *
   * this handler message all of page in application
   */
  handleReciveMessageMqtt = (message) => {
    const { processListObj, onUpdateProcesses } = this.props;
    const messageQueue = JSON.parse(message.payloadString);
    const { sender } = messageQueue;
    const currentUser = localstoreUtilites.getUsernameFromLocalStorage();
    // console.log(messageQueue);
    if (sender === currentUser) {
      if (messageQueue.type === MQTT_TYPE.NOTIFICATION.type) {
        if (
          messageQueue.data.notificationType === 'NOTIFICATION_COUNT_REVIEW'
        ) {
          const countReview = JSON.parse(messageQueue.data.message);
          this.setState({
            countReview,
          });
        } else {
          // Show snack bar message by comparing the sender in the message with the currently logged in account.
          this.props.enqueueSnackbar(
            ReactHtmlParser(messageQueue.data.message),
            {
              variant: messageQueue.data.messageType,
              persist: messageQueue.data.keep,
            },
          );

          // Push Desktop Notification in case
          if (messageQueue.data.messageType === 'info') {
            const notification = new Notification(messageQueue.data.message);
            if (messageQueue.data.relatedUrl) {
              const url = `${window.location.protocol}//${window.location.host}${messageQueue.data.relatedUrl}`;

              notification.onclick = () => window.open(url);
            }
          }

          // } else if (messageQueue.data.message) {
          //   this.props.enqueueSnackbar(ReactHtmlParser(messageQueue.data.message), {
          //     variant: messageQueue.data.messageType,
          //   });
          // }
        }
      } else if (messageQueue.type === MQTT_TYPE.PROCESS_PROGRESSBAR.type) {
        console.log('PROCESS_PROGRESSBAR', messageQueue);
        const updateTime = new Date();
        onUpdateProcesses(messageQueue.data.processId, {
          name: processListObj.getIn([messageQueue.data.processId, 'name']),
          progress:
            messageQueue.data.progress === '-1.00'
              ? processListObj.getIn([messageQueue.data.processId, 'progress'])
              : Number(messageQueue.data.progress),
          action: messageQueue.data.name,
          status:
            // (messageQueue.data.progress === '100' ||
            //   messageQueue.data.progress === '100.00') &&
            // STATUS_COMPLETED,
            messageQueue.data.progress === '100' ||
            messageQueue.data.progress === '100.00'
              ? STATUS_COMPLETED
              : messageQueue.data.name,
          updateTime,
        });
        if (
          ((messageQueue.data.progress === '-1.00' &&
            messageQueue.data.name === STATUS_FAILED) ||
            messageQueue.data.progress === '100.00') &&
          processListObj.getIn([messageQueue.data.processId, 'status']) !==
            STATUS_FAILED
        ) {
          const variant =
            messageQueue.data.progress === '-1.00' ? 'error' : 'success';
          const notification =
            messageQueue.data.progress === '-1.00'
              ? messages.deviceUpdateFail
              : messages.deviceUpdateSuccess;

          this.props.enqueueSnackbar(<FormattedMessage {...notification} />, {
            variant,
          });
        }
      }
    }
  };

  updateCountReview = async () => {
    try {
      // const res = await ApiClient.get(`/accounts/waiting-for-review`);
      // this.setState({
      //   countReview: res.data,
      // });
    } catch (error) {
      console.log('error', { ...error });
      // throw error;
    }
  };

  render() {
    const {
      title,
      location,
      children,
      error,
      onResetNotifySuccess,
      notifySuccess,
      // onResetNotifyError,
      // notifyError,
      loading,
      role,
      logo,
      enqueueSnackbar,
      onResetEnqueue,
    } = this.props;

    return (
      <React.Fragment>
        <FormattedMessage {...title}>
          {(titleStr) => (
            <Helmet>
              <title>{titleStr}</title>
              <meta name="description" content="DeMasterPro homepage" />
            </Helmet>
          )}
        </FormattedMessage>

        <MasterUi
          logo={logo}
          role={role}
          username={localUsername}
          childPage={children}
          location={location.toJSON()}
          error={error}
          notifySuccess={notifySuccess}
          onResetNotifySuccess={onResetNotifySuccess}
          // notifyError={notifyError}
          // onResetNotifyError={onResetNotifyError}
          enqueueSnackbar={enqueueSnackbar}
          loading={loading}
          onResetEnqueue={onResetEnqueue}
          logout={this.logout}
          countReview={this.state.countReview}
          updateCountReview={this.updateCountReview}
        />
      </React.Fragment>
    );
  }
}

MasterPage.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  title: PropTypes.object,
  location: PropTypes.object,
  children: PropTypes.element,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  // notifySuccess: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  notifySuccess: PropTypes.string,
  notifyError: PropTypes.string,
  loading: PropTypes.bool,
  role: PropTypes.number,
  logo: PropTypes.string,
  onGetLogo: PropTypes.func,
  onResetEnqueue: PropTypes.func,
  onResetNotifySuccess: PropTypes.func,
  // onResetNotifyError: PropTypes.func,
  processListObj: PropTypes.object,
  onUpdateProcesses: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  notifySuccess: makeSelectNotifySuccess(),
  // notifyError: makeSelectNotifyError(),
  location: makeSelectLocation(),
  logo: makeSelectLogo(),
  processListObj: getProcessListObj(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onGetLogo: () => dispatch(getLogo()),
    onResetEnqueue: () => dispatch(resetEnqueue()),
    onResetNotifySuccess: () => dispatch(resetNotifySuccess()),
    // onResetNotifyError: () => dispatch(resetNotifyError()),
    onUpdateProcesses: (progressId, processObj) =>
      dispatch(updateProcesses(progressId, processObj)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'app', saga, mode: RESTART_ON_REMOUNT });

export default compose(withConnect, withSaga)(MasterPage);

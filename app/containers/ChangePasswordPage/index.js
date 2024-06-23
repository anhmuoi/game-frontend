/* eslint-disable jsx-a11y/alt-text */
import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import InputUI from 'components/InputUI';
import { makeSelectError, makeSelectLoading } from 'containers/App/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer.js';
import saga from './saga.js';
import { mainStyle } from './styles.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imgAttack from 'images/people/attack.png';
import { FormattedMessage } from 'react-intl';
import Header from '../../components/Header/index.js';
import { API_COLUMNS, MQTT_TYPE } from '../../utils/constants.js';
import WebSocketMqtt from '../../utils/mqtt.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { create_UUID } from '../../utils/utils.js';
import Sidebar from './Sidebar.js';
import classNames from 'classnames';

import {
  ChangePassword,
  changePageNumberMarket,
  changePageSizeMarket,
  changeTextField,
  deleteMarket,
  deleteMultiesFriend,
  deleteMultiesMarket,
  getFriendData,
  getInitIndexMarket,
  getMarketData,
  getMarketInit,
  getSortDirectionMarketList,
  getSortMarketList,
  postMarketAdd,
  putMarketUpdate,
  requestAddFriend,
  requestJoinGroup,
  userOutGroup,
} from './actions.js';
import { mapModelMarketUiToApi } from './functions.js';
import messages from './messages.js';
import { Icon } from '@iconify/react';

import {
  getAjaxInfo,
  getFriendListDataSelector,
  getMarketDataModified,
  getMarketDataSelector,
  getMetaPagingMarket,
  getUserListData,
  getstoreListData,
} from './selectors.js';
import './styles.css';
import { Save } from '@material-ui/icons';
import { passwordNotMatch } from '../../utils/translation.js';
const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
toast.configure();
export const headers = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
  },

  {
    id: 'totalPeople',
    label: <FormattedMessage {...messages.totalPeople} />,
  },
  {
    id: 'price',
    label: <FormattedMessage {...messages.price} />,
  },

  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: '##',
    width: '60px',
    textAlign: 'right',
  },
];

export class MarketInformationPage extends React.Component {
  state = {
    ChangePasswordIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],
    openMenu: false,
    collapse: true,
    toggle: false,
    openModalSell: false,
    itemSellSelected: null,
    priceSell: 0,

    listSendRequest: [],
    sendAddFriendState: false,

    password: '',
    confirmPassword: '',
  };

  componentDidMount() {
    this.getDataMarketTable([], [], null);
    this.props.getMarketInit();
    this.props.onGetFriendData();
  }

  getDataMarketTable(departmentIds, status, search) {
    this.props.onGetMarketData(departmentIds, status, search);
  }

  deleteMultiesMarket = () => {
    const { ChangePasswordIdSelected } = this.state;
    this.props.onDeleteMultiesMarket(ChangePasswordIdSelected);
  };

  rowsSelected = (ids) => this.setState({ ChangePasswordIdSelected: ids });
  deleteRow = (id) => this.props.onDeleteMarket(id);
  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      search: searchTxt,
    });
    // call props filter Market on table
    this.getDataMarketTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      searchTxt,
    );
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () =>
    this.props.onGetMarketData(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.searchName,
    );

  UNSAFE_componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      toast.success(ajaxSuccess.message, {
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        autoClose: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  addMarket = () => {
    this.props.onInitIndexMarket(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (id) => {
    this.props.onInitIndexMarket(id);
    this.setState({ openModal: true, rowsSelectedId: id });
  };

  getTitleModal = () => {
    const { rowsSelectedId } = this.state;
    return rowsSelectedId ? (
      <FormattedMessage {...messages.editTitleModal} />
    ) : (
      <FormattedMessage {...messages.addTitleModal} />
    );
  };

  getSortColumn = (sortColumn, value) => {
    const cloneSortColumn = API_COLUMNS.CHANGE_PASSWORDS.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };

  onChangeFilter = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    this.getDataMarketTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.search,
    );
  };

  UNSAFE_componentWillMount() {
    if (!window.DeMaster_Mqtt_Client) {
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

  handleReciveMessageMqtt = (message) => {
    const messageQueue = JSON.parse(message.payloadString);
    const { userId } = messageQueue;
    const currentUser = localstoreUtilites.getUserIdFromLocalStorage();
    console.log(
      messageQueue,
      currentUser,
      messageQueue.type === MQTT_TYPE.NOTIFICATION.type,
      messageQueue.data.userId === Number(currentUser),
    );
    if (messageQueue.type === MQTT_TYPE.NOTIFICATION.type) {
      if (messageQueue.data.room.userListId.includes(Number(currentUser))) {
        if (messageQueue.data.messageType === 'error') {
          this.getDataMarketTable([], [], null);
        } else {
          if (messageQueue.data.action.id === 0) {
            window.location.href = `${window.location.href}/${messageQueue.data.room.id}`;
          }
        }
      } else {
        this.getDataMarketTable([], [], null);
      }
    }
  };
  goToRoom = (room) => {
    const msgId = create_UUID();

    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
        action: {
          id: 0,
        },
      },
    });
  };

  openMenu = () => {
    this.setState({
      openMenu: true,
    });
  };
  closeMenu = () => {
    this.setState({
      openMenu: false,
    });
  };
  setCollapse = (value) => {
    this.setState({
      collapse: value,
    });
  };
  setToggle = (value) => {
    this.setState({
      toggle: value,
    });
  };

  handleSell = (item) => {
    this.props.onInitIndexMarket(item.id);
    this.setState({
      itemSellSelected: item,
      openModalSell: true,
    });
  };
  closeModalSell = () => {
    this.setState({
      itemSellSelected: null,
      openModalSell: false,
      priceSell: 0,
    });
  };
  handleChangePriceSell = (e) => {
    this.setState({
      priceSell: e.target.value,
    });
  };

  sellItemNft = () => {
    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(
      this.props.ChangePasswordDataModified.toJS(),
    );

    nftApi.status = 1;
    onUpdateMarket(itemSellSelected.id, nftApi);
  };
  cancelSellItemNft = async (item) => {
    await this.props.onInitIndexMarket(item.id);

    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(
      this.props.ChangePasswordDataModified.toJS(),
    );

    nftApi.status = 0;
    onUpdateMarket(item.id, nftApi);
  };

  onSaveChangePassword = () => {
    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      toast.error(passwordNotMatch(), {
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        autoClose: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }
    this.setState({
      showDialog: true,
    });
    return true;
  };

  onCloseDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  onActionAgreeConfirm = () => {
    const { password, confirmPassword } = this.state;
    this.props.onChangePassword(password, confirmPassword);

    return true;
  };

  render() {
    const {
      password,
      confirmPassword,
      collapse,
      toggle,
      showDialog,
    } = this.state;
    const {
      onUpdateMarket,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddMarket,
      ChangePasswordDataModified,
      history,
      storeList,
      classes,
      userList,
      friendListSelector,
    } = this.props;
    const {
      address,
      name,
      description,
      image,
      mana,
      aliasId,
      price,
      status,
      itemNftId,
      userId,
    } = ChangePasswordDataModified.toJS();

    let user = null;
    if (userList && userList.length > 0) {
      user = userList.find(
        (i) => i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
      );
    }

    let dialogMessage = (
      <FormattedMessage {...messages.confirmChangePassword} />
    );

    return (
      <div className="room-game">
        <Sidebar
          collapse={collapse}
          setCollapse={this.setCollapse}
          toggle={toggle}
          setToggle={this.setToggle}
          history={history}
        />

        <Header loginByAddress={() => null} history={history} />
        <div className="room-game-logo">
          <img src={imgAttack} alt="" />
        </div>

        <Typography
          variant="h3"
          style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
        >
          <FormattedMessage {...messages.ChangePassword} />
        </Typography>

        <div
          className={classes.root}
          style={{
            width: '40%',
            margin: '50px auto',
            height: 300,
            borderRadius: 20,
            background: 'rgb(192 192 192)',
            boxShadow: '1px 1px 14px 8px white',
            padding: 20,
          }}
        >
          <AlertDialogSlideUI
            onOpen={showDialog}
            messsage={<span />}
            title={<span>{dialogMessage}</span>}
            onActionAgree={this.onActionAgreeConfirm}
            onCloseDialog={this.onCloseDialog}
          />

          <form>
            <React.Fragment>
              <Icon
                icon="teenyicons:password-solid"
                color="white"
                width="40"
                height="40"
                style={{ marginBottom: 20 }}
              />
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <InputUI
                    id="password"
                    name="password"
                    typeInput="password"
                    onChange={(e) =>
                      this.setState({
                        password: e.target.value,
                      })
                    }
                    value={password}
                    label={<FormattedMessage {...messages.password} />}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <InputUI
                    typeInput="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={(e) =>
                      this.setState({
                        confirmPassword: e.target.value,
                      })
                    }
                    value={confirmPassword}
                    label={<FormattedMessage {...messages.confirmPassword} />}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          </form>
          <React.Fragment>
            <div className={classes.buttons} style={{ marginTop: 20 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.onSaveChangePassword}
                className={classes.button}
                id="btnSave"
                disabled={!password || !confirmPassword}
              >
                <Save
                  className={classNames(classes.rightIcon, classes.iconSmall)}
                />
                <FormattedMessage {...messages.btnSave} />
              </Button>
            </div>
          </React.Fragment>
        </div>
      </div>
    );
  }
}

MarketInformationPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onClearFilter: PropTypes.func,

  onUpdateMarket: PropTypes.func,
  onAddMarket: PropTypes.func,
  onInitIndexMarket: PropTypes.func,

  onGetMarketData: PropTypes.func,
  getMarketInit: PropTypes.func,

  onDeleteMarket: PropTypes.func,
  onDeleteMultiesMarket: PropTypes.func,
  onChangePageNumber: PropTypes.func,
  onChangePageSize: PropTypes.func,
  onChangeTextField: PropTypes.func,
  onGetSortColumn: PropTypes.func,
  onGetSortDirection: PropTypes.func,
  onRequestJoinGroup: PropTypes.func,
  onGetFriendData: PropTypes.func,
  onUserOutGroup: PropTypes.func,
  onRequestAddFriend: PropTypes.func,
  onChangePassword: PropTypes.func,

  loading: PropTypes.bool,
  history: PropTypes.object,
  friendListSelector: PropTypes.array,
};

function mapDispatchToProps(dispatch) {
  return {
    // onClearFilter: () => dispatch(clearFilter()),
    // modified Market
    onUpdateMarket: (id, ChangePassword) =>
      dispatch(putMarketUpdate(id, ChangePassword)),
    onAddMarket: (ChangePassword) => dispatch(postMarketAdd(ChangePassword)),
    onInitIndexMarket: (id) => dispatch(getInitIndexMarket(id)),
    // Market index
    onGetMarketData: (departmentIds, status, search) =>
      dispatch(getMarketData(departmentIds, status, search)),
    getMarketInit: () => dispatch(getMarketInit()),
    onDeleteMarket: (id) => dispatch(deleteMarket(id)),
    onDeleteMultiesMarket: (ids) => dispatch(deleteMultiesMarket(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberMarket(pageNumber)),
    onChangePageSize: (pageSize) => dispatch(changePageSizeMarket(pageSize)),
    onChangeTextField: (evt, date) => {
      if (!evt.target) {
        dispatch(changeTextField(evt, date));
      } else {
        dispatch(changeTextField(evt.target.name, evt.target.value));
      }
    },
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortMarketList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionMarketList()),
    onRequestJoinGroup: (id, userId) => dispatch(requestJoinGroup(id, userId)),

    //
    onGetFriendData: () => dispatch(getFriendData()),
    onDeleteMultiesFriend: (ids) => dispatch(deleteMultiesFriend(ids)),

    //
    onUserOutGroup: (id, groupId) => dispatch(userOutGroup(id, groupId)),

    onChangePassword: (password, confirmPassword) =>
      dispatch(ChangePassword(password, confirmPassword)),

    onRequestAddFriend: (userId1, userId2) =>
      dispatch(requestAddFriend(userId1, userId2)),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getMarketDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingMarket(),
  loading: makeSelectLoading(),
  storeList: getstoreListData(),
  ChangePasswordDataModified: getMarketDataModified(),
  userList: getUserListData(),
  friendListSelector: getFriendListDataSelector(),
});

const withReducer = injectReducer({ key: 'ChangePassword', reducer });
const withSaga = injectSaga({
  key: 'ChangePassword',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(MarketInformationPage));

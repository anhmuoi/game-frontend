/* eslint-disable jsx-a11y/alt-text */
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
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
import InputUI from 'components/InputUI';
import { Icon } from '@iconify/react';

import * as LottiePlayer from '@lottiefiles/lottie-player';
import imgAttack from 'images/people/attack.png';
import { FormattedMessage } from 'react-intl';
import { API_COLUMNS, MQTT_TYPE } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import {
  changePageNumberMarket,
  changePageSizeMarket,
  changeTextField,
  deleteMultiesMarket,
  deleteMarket,
  getInitIndexMarket,
  getMarketData,
  getMarketInit,
  getSortDirectionMarketList,
  getSortMarketList,
  postMarketAdd,
  putMarketUpdate,
  requestJoinGroup,
  getFriendData,
  deleteMultiesFriend,
  userOutGroup,
} from './actions.js';
import messages from './messages.js';
import './styles.css';
import {
  getAjaxInfo,
  getMetaPagingMarket,
  getMarketDataModified,
  getMarketDataSelector,
  getstoreListData,
  getUserListData,
  getFriendListDataSelector,
} from './selectors.js';
import Header from '../../components/Header/index.js';
import { create_UUID } from '../../utils/utils.js';
import WebSocketMqtt from '../../utils/mqtt.js';
import { Close, Menu, NoteAddOutlined } from '@material-ui/icons';
import Sidebar from './Sidebar.js';
import { mapModelMarketUiToApi } from './functions.js';
const localUsername = localstoreUtilites.getUsernameFromLocalStorage();

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
    myGroupIdSelected: [],
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
    const { myGroupIdSelected } = this.state;
    this.props.onDeleteMultiesMarket(myGroupIdSelected);
  };

  rowsSelected = (ids) => this.setState({ myGroupIdSelected: ids });
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
      // this.props.enqueueSnackbar(ajaxSuccess.message, {
      //   variant: 'success',
      // });

      this.closeModalSell();
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
    const cloneSortColumn = API_COLUMNS.MY_GROUPS.indexOf(value);
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

    const nftApi = mapModelMarketUiToApi(this.props.myGroupDataModified.toJS());

    nftApi.status = 1;
    onUpdateMarket(itemSellSelected.id, nftApi);
  };
  cancelSellItemNft = async (item) => {
    await this.props.onInitIndexMarket(item.id);

    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(this.props.myGroupDataModified.toJS());

    nftApi.status = 0;
    onUpdateMarket(item.id, nftApi);
  };

  render() {
    const {
      myGroupIdSelected,
      openModal,
      rowsSelectedId,
      openMenu,
      toggle,
      collapse,
      openModalSell,
      itemSellSelected,
      priceSell,
      sendAddFriendState,
    } = this.state;
    const {
      onUpdateMarket,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddMarket,
      myGroupDataModified,
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
    } = myGroupDataModified.toJS();

    let user = null;
    let memberList = null;
    if (userList && userList.length > 0) {
      user = userList.find(
        (i) => i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
      );
      memberList = userList.filter((i) => i.departmentId === user.departmentId);
    }
    const group =
      user && datas ? datas.find((m) => m.id === user.departmentId) : null;

    console.log(friendListSelector);
    return (
      <div className="room-game">
        <Sidebar
          collapse={collapse}
          setCollapse={this.setCollapse}
          toggle={toggle}
          setToggle={this.setToggle}
          history={history}
        />

        {openModalSell ? (
          <div className="modal-sell-item">
            <IconButton
              color="white"
              className="modal-sell-close"
              onClick={() => this.closeModalSell()}
            >
              <Close />
            </IconButton>
            <img src={image.value} className="sell-img" />
            <p className="sell-name">{name.value} </p>
            <InputUI
              id="price"
              name="price"
              // autoFocus
              value={price.value}
              color="white"
              onChange={onChangeTextField}
              typeInput="number"
              label={<FormattedMessage {...messages.price} />}
            />
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() => this.sellItemNft()}
                style={{
                  background: '#00B5AD',
                  color: 'white',
                  fontWeight: 'bold',
                  margin: 20,
                }}
              >
                <FormattedMessage {...messages.sell}></FormattedMessage>
              </Button>
            </div>
          </div>
        ) : null}

        {/* <img
          style={{
            width: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          src={battlegrounds[0].image}
          alt=""
        /> */}
        <Header loginByAddress={() => null} history={history} />
        <div className="room-game-logo">
          <img src={imgAttack} alt="" />
        </div>

        <Typography
          variant="h3"
          style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
        >
          <FormattedMessage {...messages.myGroup} />
        </Typography>

        <div
          className="room-game-list"
          style={{ marginTop: 80, flexDirection: 'column', gap: 10 }}
        >
          {group ? (
            <React.Fragment>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 5,
                  alignItems: 'center',
                  paddingLeft: 10,
                  paddingRight: 10,
                  width: '100%',
                  background: '#00B5AD',
                  borderRadius: 20,
                }}
              >
                <div
                  style={{
                    gap: 10,
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <p
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}
                  >
                    {group.name}
                  </p>
                  <p
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}
                  >
                    - Owner:{' '}
                    {userList.length > 0
                      ? userList.find((m) => m.id === group.departmentManagerId)
                          .name
                      : null}
                  </p>
                </div>
                <div
                  onClick={() =>
                    this.props.onUserOutGroup(
                      localstoreUtilites.getUserIdFromLocalStorage(),
                      group.id,
                    )
                  }
                  style={{
                    padding: 10,
                    background: '#115651',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  <FormattedMessage {...messages.out} />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 5,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {memberList &&
                  memberList.map((mem, key) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 10,
                        alignItems: 'center',
                        paddingLeft: 10,
                        paddingRight: 10,
                        width: '90%',
                        background: 'White',
                        color: '#00B5AD',
                      }}
                    >
                      <div
                        style={{
                          gap: 10,
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <img
                          src={mem.avatar}
                          alt=""
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '100%',
                          }}
                        />
                        <p
                          style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                          }}
                        >
                          {mem.name}
                        </p>
                      </div>
                      {Number(user.id) === Number(mem.id) ? null : (
                        <div
                          style={{
                            padding: 10,
                            borderRadius: 10,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                          }}
                        >
                          <Icon icon="emojione-v1:video-game" fontSize="30px" />

                          {friendListSelector &&
                          friendListSelector.find(
                            (m) =>
                              !(Number(m.userId1) === Number(mem.id)) ||
                              !(Number(m.userId2) === Number(mem.id)),
                          ) ? (
                            <Icon
                              icon="icon-park:people-minus-one"
                              fontSize="30px"
                              style={{ marginLeft: 20 }}
                              className="add-friend"
                              onClick={() =>
                                this.props.onDeleteMultiesFriend([
                                  friendListSelector.find(
                                    (m) =>
                                      !(Number(m.userId1) === Number(mem.id)) ||
                                      !(Number(m.userId2) === Number(mem.id)),
                                  ).id,
                                ])
                              }
                            />
                          ) : (
                            <Icon
                              icon={
                                sendAddFriendState
                                  ? 'eos-icons:bubble-loading'
                                  : 'icon-park:people-plus-one'
                              }
                              fontSize="30px"
                              style={{ marginLeft: 20 }}
                              className="add-friend"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </React.Fragment>
          ) : (
            <div style={{ margin: '0 auto', textAlign: 'center' }}>
              <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets2.lottiefiles.com/packages/lf20_aBYmBC.json"
                style={{ width: '320px' }}
              ></lottie-player>
            </div>
          )}
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

  loading: PropTypes.bool,
  history: PropTypes.object,
  friendListSelector: PropTypes.array,
};

function mapDispatchToProps(dispatch) {
  return {
    // onClearFilter: () => dispatch(clearFilter()),
    // modified Market
    onUpdateMarket: (id, myGroup) => dispatch(putMarketUpdate(id, myGroup)),
    onAddMarket: (myGroup) => dispatch(postMarketAdd(myGroup)),
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
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getMarketDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingMarket(),
  loading: makeSelectLoading(),
  storeList: getstoreListData(),
  myGroupDataModified: getMarketDataModified(),
  userList: getUserListData(),
  friendListSelector: getFriendListDataSelector(),
});

const withReducer = injectReducer({ key: 'myGroup', reducer });
const withSaga = injectSaga({
  key: 'myGroup',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(MarketInformationPage));

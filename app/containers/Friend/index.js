/* eslint-disable jsx-a11y/alt-text */
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { makeSelectError, makeSelectLoading } from 'containers/App/selectors';
import { Icon } from '@iconify/react';

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
import Autocomplete from 'components/Autocomplete';

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
  requestAddFriend,
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
} from './selectors.js';
import Header from '../../components/Header/index.js';
import { create_UUID } from '../../utils/utils.js';
import WebSocketMqtt from '../../utils/mqtt.js';
import { Close, Menu, NoteAddOutlined, Search } from '@material-ui/icons';
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
    friendIdSelected: [],
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

    arrSuggestion: [],
    searchItemSelect: {},
    search: '',
    idUserSelected: null,
    listAddFriendRequested: [],
  };

  componentDidMount() {
    this.getDataMarketTable([], [], null);
    this.props.getMarketInit('');
  }

  getDataMarketTable(departmentIds, status, search) {
    this.props.onGetMarketData(departmentIds, status, search);
  }

  deleteMultiesMarket = () => {
    const { friendIdSelected } = this.state;
    this.props.onDeleteMultiesMarket(friendIdSelected);
  };

  rowsSelected = (ids) => this.setState({ friendIdSelected: ids });
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
    const cloneSortColumn = API_COLUMNS.FRIENDS.indexOf(value);
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchDataSelector !== this.props.searchDataSelector) {
      this.setState({
        arrSuggestion: this.getSuggestions(),
      });
    }
  }
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

    const nftApi = mapModelMarketUiToApi(this.props.friendDataModified.toJS());

    nftApi.status = 1;
    onUpdateMarket(itemSellSelected.id, nftApi);
  };
  cancelSellItemNft = async (item) => {
    await this.props.onInitIndexMarket(item.id);

    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(this.props.friendDataModified.toJS());

    nftApi.status = 0;
    onUpdateMarket(item.id, nftApi);
  };

  handleDatas = (datas, userList) => {
    let newData = [];
    const userId = Number(localstoreUtilites.getUserIdFromLocalStorage());
    datas.map((item) => {
      if (item.userId1 === userId) {
        const user = userList.find((i) => i.id === item.userId2);
        if (user) {
          newData.push({ ...user, idFriend: item.id });
        }
      } else if (item.userId2 === userId) {
        const user = userList.find((i) => i.id === item.userId1);
        if (user) {
          newData.push({ ...user, idFriend: item.id });
        }
      }
    });
    return newData;
  };

  checkIsFriend = (datas, userId) => {
    let check = false;
    datas.map((item) => {
      if (item.userId1 === userId) {
        check = true;
      } else if (item.userId2 === userId) {
        check = true;
      }
    });
    return check;
  };

  getSuggestions = () => {
    const { userList } = this.props;
    let dataSearch = [];
    userList.map((it) => {
      if (
        it.id !== 1 &&
        it.id !== Number(localstoreUtilites.getUserIdFromLocalStorage())
      ) {
        dataSearch.push({
          id: it.id,
          label: (
            <React.Fragment>
              <img
                style={{ width: 24, height: 24, marginRight: 5 }}
                src={it.avatar}
                alt=""
              />{' '}
              {it.name}
            </React.Fragment>
          ),
        });
      }
    });

    return dataSearch;
  };

  onSearchUser = (search) => {
    this.props.getMarketInit(search);
  };
  selectedUser = (id) => {
    this.setState({
      idUserSelected: id,
    });
  };

  render() {
    const {
      friendIdSelected,
      openModal,
      rowsSelectedId,
      openMenu,
      toggle,
      collapse,
      openModalSell,
      itemSellSelected,
      priceSell,
    } = this.state;
    const {
      onUpdateMarket,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddMarket,
      friendDataModified,
      history,
      storeList,
      classes,
      userList,
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
    } = friendDataModified.toJS();

    let user = null;
    if (userList && userList.length > 0) {
      user = userList.find(
        (i) => i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
      );
    }

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
          <FormattedMessage {...messages.friend} />
        </Typography>

        {user ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <img
              src={user.avatar}
              style={{ width: 50, height: 50, borderRadius: '100%' }}
            />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>
              {user.name}
            </p>
          </div>
        ) : null}

        <div
          style={{
            width: '70%',
            margin: '0 auto',
            background: 'white',
            borderRadius: '5px',
            color: '#00B5AD',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Autocomplete
            classes={classes}
            id="search"
            name="search"
            styleInput={{ margin: 16 }}
            suggestion={this.state.arrSuggestion}
            getSuggestions={this.getSuggestions}
            onChangeKeyword={async (value) => {
              await this.onSearchUser(value);
              this.setState({
                search: value,
              });
            }}
            onSelect={async (item) => {
              if (item) {
                let newArr = [];
                this.state.arrSuggestion.map((item) =>
                  newArr.push({ ...item, label: item.name }),
                ),
                  this.setState({
                    searchItemSelect: item,
                    arrSuggestion: newArr,
                  });
                this.selectedUser(item.id);
              }
            }}
            placeholder={this.state.searchItemSelect.name}
          />
        </div>

        <div
          className="room-game-list"
          style={{ marginTop: 80, flexDirection: 'column', gap: 15 }}
        >
          <Collapse
            in={this.state.idUserSelected}
            timeout="auto"
            unmountOnExit
            style={{
              width: '100%',
              margin: '0 auto',
              background: 'white',
              color: 'gray',
              fontWeight: 'bolder',
            }}
          >
            {userList.find((m) => m.id === this.state.idUserSelected) ? (
              <div style={{ padding: 10, color: 'gray' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                      src={
                        userList.find((m) => m.id === this.state.idUserSelected)
                          .avatar
                      }
                      style={{ width: 50, height: 50, borderRadius: '100%' }}
                    />
                    <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                      {
                        userList.find((m) => m.id === this.state.idUserSelected)
                          .name
                      }
                    </p>
                  </div>
                  {this.checkIsFriend(datas, this.state.idUserSelected) ? (
                    <div
                      onClick={() => {
                        let freId = null;
                        datas.map((f) => {
                          if (f.userId1 === this.state.idUserSelected) {
                            freId = f.id;
                          } else if (f.userId2 === this.state.idUserSelected) {
                            freId = f.id;
                          }
                        });
                        if (freId) {
                          this.props.onDeleteMultiesMarket([freId]);
                        }
                      }}
                      style={{
                        padding: 10,
                        background: '#00B5AD',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      <FormattedMessage {...messages.unfriend} />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        if (
                          !this.state.listAddFriendRequested.includes(
                            this.state.idUserSelected,
                          )
                        ) {
                          this.props.onRequestAddFriend(
                            user.id,
                            this.state.idUserSelected,
                          );
                          this.setState({
                            listAddFriendRequested: [
                              this.state.listAddFriendRequested,
                              this.state.idUserSelected,
                            ],
                          });
                        }
                      }}
                      style={{
                        padding: 10,
                        background: '#00B5AD',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      {this.state.listAddFriendRequested.includes(
                        this.state.idUserSelected,
                      ) ? (
                        <FormattedMessage {...messages.sent} />
                      ) : (
                        <FormattedMessage {...messages.addFriend} />
                      )}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                  }}
                >
                  <div>
                    <FormattedMessage {...messages.email} />:
                  </div>
                  <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                    {
                      userList.find((m) => m.id === this.state.idUserSelected)
                        .email
                    }
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                    }}
                  >
                    <div>
                      <FormattedMessage {...messages.walletAddress} />:
                    </div>
                    <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                      {
                        userList.find((m) => m.id === this.state.idUserSelected)
                          .walletAddress
                      }
                    </p>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 20 }}
                  >
                    <Icon icon="noto-v1:right-arrow" fontSize="40px" />
                    <div
                      onClick={() => {
                        const userAdd = userList.find(
                          (m) => m.id === this.state.idUserSelected,
                        );
                        if (userAdd && userAdd.walletAddress) {
                          const url = `https://testnet.bscscan.com/address/${userAdd.walletAddress}`;
                          window.open(url, '_blank');
                        }
                      }}
                      style={{
                        padding: 10,
                        background: '#00B5AD',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      <FormattedMessage {...messages.checkTransactionHistory} />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                    }}
                  >
                    <div>
                      <FormattedMessage {...messages.phone} />:
                    </div>
                    <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                      {
                        userList.find((m) => m.id === this.state.idUserSelected)
                          .phone
                      }
                    </p>
                  </div>
                  <div
                    onClick={() =>
                      this.setState({
                        idUserSelected: null,
                      })
                    }
                  >
                    <Icon
                      icon="solar:square-double-alt-arrow-up-bold"
                      fontSize="40px"
                      style={{ cursor: 'pointer', color: '#00B5AD' }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </Collapse>
          {this.handleDatas(datas, userList).length > 0 ? (
            this.handleDatas(datas, userList).map((user, key) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
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
                  <img
                    src={user.avatar}
                    style={{ width: 50, height: 50, borderRadius: '100%' }}
                  />
                  <p
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}
                  >
                    {user.name}
                  </p>
                </div>
                <div
                  onClick={() =>
                    this.props.onDeleteMultiesMarket([user.idFriend])
                  }
                  style={{
                    padding: 10,
                    background: 'gray',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  <FormattedMessage {...messages.unfriend} />
                </div>
              </div>
            ))
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
  onRequestAddFriend: PropTypes.func,

  loading: PropTypes.bool,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    // onClearFilter: () => dispatch(clearFilter()),
    // modified Market
    onUpdateMarket: (id, friend) => dispatch(putMarketUpdate(id, friend)),
    onAddMarket: (friend) => dispatch(postMarketAdd(friend)),
    onInitIndexMarket: (id) => dispatch(getInitIndexMarket(id)),
    // Market index
    onGetMarketData: (departmentIds, status, search) =>
      dispatch(getMarketData(departmentIds, status, search)),
    getMarketInit: (search) => dispatch(getMarketInit(search)),
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
  friendDataModified: getMarketDataModified(),
  userList: getUserListData(),
});

const withReducer = injectReducer({ key: 'friend', reducer });
const withSaga = injectSaga({
  key: 'friend',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(MarketInformationPage));

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
import { Icon } from '@iconify/react';

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
import { Close, Menu, NoteAddOutlined } from '@material-ui/icons';
import Sidebar from './Sidebar.js';
import { mapModelMarketUiToApi } from './functions.js';
import Pagination from './Pagination.js';
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
    historyIdSelected: [],
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
  };

  componentDidMount() {
    this.getDataMarketTable([], [], null);
    this.props.getMarketInit();
  }

  getDataMarketTable(departmentIds, status, search) {
    this.props.onGetMarketData(departmentIds, status, search);
  }

  deleteMultiesMarket = () => {
    const { historyIdSelected } = this.state;
    this.props.onDeleteMultiesMarket(historyIdSelected);
  };

  rowsSelected = (ids) => this.setState({ historyIdSelected: ids });
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

  changePageNumber = (pageNumber) => {
    this.props.onChangePageNumber(pageNumber);
    this.pagingRemote();
  };
  changePageSize = (pageSize) => {
    this.props.onChangePageSize(pageSize);
  };
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
    const cloneSortColumn = API_COLUMNS.HISTORYS.indexOf(value);
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

    const nftApi = mapModelMarketUiToApi(this.props.historyDataModified.toJS());

    nftApi.status = 1;
    onUpdateMarket(itemSellSelected.id, nftApi);
  };
  cancelSellItemNft = async (item) => {
    await this.props.onInitIndexMarket(item.id);

    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(this.props.historyDataModified.toJS());

    nftApi.status = 0;
    onUpdateMarket(item.id, nftApi);
  };

  handleDatas = (datas, userList) => {
    let newData = [];

    datas.map((i) => {
      if (i.gamePlay) {
        if (i.gamePlay.orderWinning && i.gamePlay.orderWinning.length > 0) {
          const userCheck = userList.find(
            (m) => m.id === i.gamePlay.orderWinning[0],
          );
          newData.push({
            ...i,
            avatar: userCheck.avatar,
            name: userCheck.name,
          });
        } else {
          newData.push({
            ...i,
            avatar: '',
            name: '',
          });
        }
      } else {
        newData.push({
          ...i,
          avatar: '',
          name: '',
        });
      }
    });
    console.log(newData);

    return newData;
  };

  handleSelectedDetail = (id) => {
    if (this.state.historyIdSelected.includes(id)) {
      this.setState({
        historyIdSelected: [
          ...this.state.historyIdSelected.filter((m) => m !== id),
        ],
      });
    } else {
      this.setState({
        historyIdSelected: [...this.state.historyIdSelected, id],
      });
    }
  };

  render() {
    const {
      historyIdSelected,
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
      historyDataModified,
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
    } = historyDataModified.toJS();
    const { pageNumber, pageSize, recordsFiltered, recordsTotal } = meta.toJS();

    console.log(meta.toJS());
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
          <FormattedMessage {...messages.history} />
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
          className="room-game-list"
          style={{ marginTop: 80, gap: 30, flexDirection: 'column' }}
        >
          {this.handleDatas(datas, userList).map((user, key) => (
            <div>
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
                  height: 70,
                }}
              >
                <div
                  style={{
                    gap: 10,
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Icon icon="game-icons:podium-winner" fontSize="40px" />

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
                  onClick={() => this.handleSelectedDetail(user.id)}
                  style={{
                    padding: 10,
                    background: 'gray',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  <FormattedMessage {...messages.viewDetail} />
                </div>
              </div>
              <Collapse
                in={this.state.historyIdSelected.includes(user.id)}
                timeout="auto"
                unmountOnExit
                style={{
                  width: '90%',
                  margin: '0 auto',
                  background: 'white',
                  color: 'gray',
                  fontWeight: 'bolder',
                }}
              >
                <div>
                  {user.userList.map((u) => (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10,
                        borderBottom: '1px solid #00B5AD',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'start',
                          gap: 10,
                          flex: '0.25',
                        }}
                      >
                        <img
                          src={u.avatar}
                          alt=""
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '100%',
                          }}
                        />
                        <div>{u.name}</div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 5,
                        }}
                      >
                        {u.nftList.map((n) => (
                          <img
                            alt=""
                            src={n.image}
                            className={`${n.isUse ? 'used-nft' : ''}`}
                          />
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flex: '0.25',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flex: '0.25',
                          }}
                        >
                          {u.hp} <Icon icon="noto:red-heart" fontSize="20px" />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flex: '0.25',
                          }}
                        >
                          {u.mana}{' '}
                          <Icon icon="noto:blue-circle" fontSize="20px" />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flex: '0.25',
                          }}
                        >
                          {u.shield} <Icon icon="noto:shield" fontSize="20px" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
          ))}

          <Pagination
            totalRecords={recordsTotal}
            pageSize={pageSize}
            currentPage={pageNumber}
            onPageChange={(page) => this.changePageNumber(page)}
          />
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

  loading: PropTypes.bool,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    // onClearFilter: () => dispatch(clearFilter()),
    // modified Market
    onUpdateMarket: (id, history) => dispatch(putMarketUpdate(id, history)),
    onAddMarket: (history) => dispatch(postMarketAdd(history)),
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
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getMarketDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingMarket(),
  loading: makeSelectLoading(),
  storeList: getstoreListData(),
  historyDataModified: getMarketDataModified(),
  userList: getUserListData(),
});

const withReducer = injectReducer({ key: 'history', reducer });
const withSaga = injectSaga({
  key: 'history',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(MarketInformationPage));

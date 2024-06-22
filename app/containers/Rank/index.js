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
import top3 from 'images/top3.png';
import imgAttack from 'images/people/attack.png';
import { FormattedMessage } from 'react-intl';
import { API_COLUMNS, MQTT_TYPE } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import imgbnb from 'images/bnb.svg';

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
import { LineChart } from './LineChart.js';
import { ethers } from 'ethers';
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
    rankIdSelected: [],
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

    account: null,
    provider: null,
    balance: 0,
  };

  async componentDidMount() {
    this.getDataMarketTable([], [], null);
    this.props.getMarketInit();

    const provider = new ethers.providers.JsonRpcProvider(
      window.env.REACT_APP_BSC_TESTNET_URL,
    );
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const balance = await provider.getBalance(accounts[0]);

    this.setState({
      provider,
      account: accounts[0],
      balance: ethers.utils.formatEther(balance),
    });
  }

  getDataMarketTable(departmentIds, status, search) {
    this.props.onGetMarketData(departmentIds, status, search);
  }

  deleteMultiesMarket = () => {
    const { rankIdSelected } = this.state;
    this.props.onDeleteMultiesMarket(rankIdSelected);
  };

  rowsSelected = (ids) => this.setState({ rankIdSelected: ids });
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
    const cloneSortColumn = API_COLUMNS.RANKS.indexOf(value);
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

    const nftApi = mapModelMarketUiToApi(this.props.rankDataModified.toJS());

    nftApi.status = 1;
    onUpdateMarket(itemSellSelected.id, nftApi);
  };
  cancelSellItemNft = async (item) => {
    await this.props.onInitIndexMarket(item.id);

    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(this.props.rankDataModified.toJS());

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
          newData.push(user);
        }
      } else if (item.userId2 === userId) {
        const user = userList.find((i) => i.id === item.userId1);
        if (user) {
          newData.push(user);
        }
      }
    });
    return newData;
  };

  render() {
    const {
      rankIdSelected,
      openModal,
      rowsSelectedId,
      openMenu,
      toggle,
      collapse,
      openModalSell,
      itemSellSelected,
      priceSell,
      balance,
    } = this.state;
    const {
      onUpdateMarket,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddMarket,
      rankDataModified,
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
    } = rankDataModified.toJS();

    let user = null;
    if (userList && userList.length > 0) {
      user = userList.find(
        (i) => i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
      );
    }

    let dataRank = [];

    if (userList && userList.length > 0) {
      userList.map((i) => {
        if (i.id !== 1) {
          dataRank.push({ ...i, point: i.totalWin - i.totalLose });
        }
      });

      dataRank = dataRank.sort((a, b) => b.point - a.point);
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
          variant="h4"
          style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
        >
          <FormattedMessage {...messages.rank} />
        </Typography>

        {dataRank.length > 0 && user ? (
          <React.Fragment>
            <div
              className="room-game-list"
              style={{ marginTop: 40, justifyContent: 'center' }}
            >
              <div
                className=""
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <div>
                  <Icon icon="noto-v1:star" fontSize="50px" />
                </div>
                <img
                  src={dataRank[0].avatar}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '100%',
                    boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)',
                  }}
                />
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  {dataRank[0].name}
                </div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  <FormattedMessage {...messages.win} />: {dataRank[0].totalWin}
                  , <FormattedMessage {...messages.lose} />:{' '}
                  {dataRank[0].totalLose}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 300,
                marginTop: -40,
              }}
            >
              <div
                className=""
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <div>
                  <Icon icon="openmoji:star" fontSize="30px" />
                  <Icon icon="openmoji:star" fontSize="30px" />
                </div>
                <img
                  src={dataRank[1].avatar}
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: '100%',
                    boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)',
                  }}
                />
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  {dataRank[1].name}
                </div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  <FormattedMessage {...messages.win} />: {dataRank[1].totalWin}
                  , <FormattedMessage {...messages.lose} />:{' '}
                  {dataRank[1].totalLose}
                </div>
              </div>
              <div
                className=""
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <div>
                  <Icon
                    icon="emojione-monotone:star"
                    fontSize="30px"
                    color="white"
                  />
                  <Icon
                    icon="emojione-monotone:star"
                    fontSize="30px"
                    color="white"
                  />
                  <Icon
                    icon="emojione-monotone:star"
                    fontSize="30px"
                    color="white"
                  />
                </div>
                <img
                  src={dataRank[2].avatar}
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: '100%',
                    boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)',
                  }}
                />
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  {dataRank[2].name}
                </div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  <FormattedMessage {...messages.win} />: {dataRank[2].totalWin}
                  , <FormattedMessage {...messages.lose} />:{' '}
                  {dataRank[2].totalLose}
                </div>
              </div>
            </div>

            <div className="your-rank">
              <div className="your-rank-title">
                <FormattedMessage {...messages.yourRank} />
              </div>
              <div className="your-rank-content">
                <div className="your-rank-content-order">
                  {dataRank.findIndex(
                    (m) =>
                      m.id ===
                      Number(localstoreUtilites.getUserIdFromLocalStorage()),
                  ) +
                    1 +
                    '/' +
                    dataRank.length}
                </div>
                <div className="your-rank-content-point">
                  <FormattedMessage {...messages.win} />: {user.totalWin}
                  , <FormattedMessage {...messages.lose} />: {user.totalLose}
                </div>
              </div>
            </div>
            <div className="your-rank" style={{ left: 100 }}>
              <div className="your-rank-title">
                <FormattedMessage {...messages.yourBalance} />
              </div>
              <div className="your-rank-content">
                <div
                  className="your-rank-content-order"
                  style={{ fontSize: 70, height: '100%' }}
                >
                  {Number(balance).toLocaleString()}
                  <img
                    src={imgbnb}
                    style={{
                      width: 70,
                      height: 70,
                      boxShadow: 'rgb(231, 197, 38) 0px 0px 15px 0px',
                      borderRadius: '100%',
                    }}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
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
    onUpdateMarket: (id, rank) => dispatch(putMarketUpdate(id, rank)),
    onAddMarket: (rank) => dispatch(postMarketAdd(rank)),
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
  rankDataModified: getMarketDataModified(),
  userList: getUserListData(),
});

const withReducer = injectReducer({ key: 'rank', reducer });
const withSaga = injectSaga({
  key: 'rank',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(MarketInformationPage));

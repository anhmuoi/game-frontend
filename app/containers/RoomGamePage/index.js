/* eslint-disable jsx-a11y/alt-text */
import {
  AppBar,
  Button,
  IconButton,
  Tooltip,
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
import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imgAttack from 'images/people/attack.png';
import imgbnb from 'images/bnb.svg';
import { Icon } from '@iconify/react';
import ModalMaterialUi from 'components/Modal';

import { FormattedMessage } from 'react-intl';
import { API_COLUMNS, MQTT_TYPE } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import {
  changePageNumberRoomGame,
  changePageSizeRoomGame,
  changeTextField,
  deleteMultiesRoomGame,
  deleteRoomGame,
  getInitIndexRoomGame,
  getRoomGameData,
  getRoomGameInit,
  getSortDirectionRoomGameList,
  getSortRoomGameList,
  postRoomGameAdd,
  putRoomGameUpdate,
} from './actions.js';
import messages from './messages.js';
import './styles.css';
import {
  getAjaxInfo,
  getMetaPagingRoomGame,
  getRoomGameDataModified,
  getRoomGameDataSelector,
  getstoreListData,
} from './selectors.js';
import Header from '../../components/Header/index.js';
import { create_UUID } from '../../utils/utils.js';
import WebSocketMqtt from '../../utils/mqtt.js';
import { Close, Menu } from '@material-ui/icons';
import Sidebar from './Sidebar.js';
const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
import { Web3ReactProvider, InjectedConnector } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  balanceNotEnough,
  gameIsRunning,
  nameEmpty,
  nameRoomExist,
  passwordIncorrect,
  totalPeopleCondition,
} from '../../utils/translation.js';

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

export class RoomGameInformationPage extends React.Component {
  state = {
    roomGameIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],
    openMenu: false,
    collapse: true,
    toggle: false,
    checkPassModal: false,
    roomSelected: null,
    passwordRoomInGame: '',

    account: null,
    balance: null,
    message: '',

    openModalCreateRoom: false,
  };

  componentDidMount() {
    this.getDataRoomGameTable([], [], null);
    // this.props.getRoomGameInit();
    this.connectWallet();
  }
  connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      this.setState({ account }, this.getBalance);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      this.setState({ message: 'Error connecting to wallet' });
    }
  };

  getBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(this.state.account);
      this.setState({ balance: ethers.utils.formatEther(balance) }); // Định dạng số dư dưới dạng BNB
    } catch (error) {
      console.error('Error getting balance:', error);
      this.setState({ message: 'Error getting balance' });
    }
  };

  getDataRoomGameTable(departmentIds, status, search) {
    this.props.onGetRoomGameData(departmentIds, status, search);
  }

  deleteMultiesRoomGame = () => {
    const { roomGameIdSelected } = this.state;
    this.props.onDeleteMultiesRoomGame(roomGameIdSelected);
  };

  rowsSelected = (ids) => this.setState({ roomGameIdSelected: ids });
  deleteRow = (id) => this.props.onDeleteRoomGame(id);
  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      search: searchTxt,
    });
    // call props filter RoomGame on table
    this.getDataRoomGameTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      searchTxt,
    );
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () =>
    this.props.onGetRoomGameData(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.searchName,
    );

  UNSAFE_componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      this.props.enqueueSnackbar(ajaxSuccess.message, {
        variant: 'success',
      });

      this.onCloseModal();
    }
  }

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  addRoomGame = () => {
    this.props.onInitIndexRoomGame(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (id) => {
    this.props.onInitIndexRoomGame(id);
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
    const cloneSortColumn = API_COLUMNS.ROOM_GAMES.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };

  onChangeFilter = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    this.getDataRoomGameTable(
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
          this.getDataRoomGameTable([], [], null);
        } else {
          if (messageQueue.data.action.id === 0) {
            window.location.href = `${window.location.href}/${messageQueue.data.room.id}`;
          }
        }
      }
      if (
        messageQueue.data.action.id === 13 &&
        Number(messageQueue.data.userId) === Number(currentUser)
      ) {
        this.goToRoom(messageQueue.data.room);
      } else {
        this.getDataRoomGameTable([], [], null);
      }
    }
  };
  goToRoom = (room) => {
    if (Number(room.price) > Number(this.state.balance)) {
      toast.error(balanceNotEnough(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }
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

  checkPassword = (room) => {
    if (room.isRunning) {
      toast.error(gameIsRunning(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else if (room.passwordRoom) {
      this.setState({
        checkPassModal: true,
        roomSelected: room,
      });
    } else {
      this.goToRoom(room);
    }
  };
  closeCheckPass = () => {
    this.setState({
      checkPassModal: false,
      roomSelected: null,
      passwordRoomInGame: '',
    });
  };
  saveCheckPassword = () => {
    if (
      this.state.roomSelected.passwordRoom === this.state.passwordRoomInGame
    ) {
      this.goToRoom(this.state.roomSelected);
    } else {
      toast.error(passwordIncorrect(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
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

  handleCreateRoom = () => {
    this.setState({
      openModalCreateRoom: true,
    });
  };
  closeCreateRoom = () => {
    this.setState({
      openModalCreateRoom: false,
    });
  };

  onCreateRoom = () => {
    const { roomGameDataModified, datas } = this.props;

    const {
      id,
      name,
      isRunning,
      description,
      totalPeople,
      currentPeople,
      passwordRoom,
      price,
      userListId,
    } = roomGameDataModified.toJS();

    if (datas.find((i) => i.name === name.value)) {
      toast.error(nameRoomExist(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else if (Number(price.value) > Number(this.state.balance)) {
      toast.error(balanceNotEnough(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    } else if (!name.value) {
      toast.error(nameEmpty(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    } else if (totalPeople.value<2) {
      toast.error(totalPeopleCondition(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    } else {
      const msgId = create_UUID();

      let room = {};
      room.id = id.value;
      room.name = name.value;
      room.isRunning = isRunning.value;
      room.description = description.value;
      room.passwordRoom = passwordRoom.value;
      room.totalPeople = totalPeople.value;
      room.currentPeople = currentPeople.value;
      room.price = price.value;
      room.userListId = userListId.value;

      window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
        msgId: msgId,
        type: MQTT_TYPE.EXPORT_MEMBER.type,
        data: {
          room: room,
          userId: localstoreUtilites.getUserIdFromLocalStorage(),
          action: {
            id: 13,
          },
        },
      });
    }
  };

  render() {
    const {
      roomGameIdSelected,
      openModal,
      rowsSelectedId,
      openMenu,
      toggle,
      collapse,
      account,
      balance,
      message,
      roomSelected,
      checkPassModal,
      passwordRoomInGame,
      openModalCreateRoom,
    } = this.state;

    console.log(account, balance, message);
    const {
      onUpdateRoomGame,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddRoomGame,
      roomGameDataModified,
      history,
      storeList,
    } = this.props;

    const {
      id,
      name,
      isRunning,
      description,
      totalPeople,
      currentPeople,
      passwordRoom,
      price,
      userListId,
    } = roomGameDataModified.toJS();

    return (
      <div className="room-game">
        <Sidebar
          collapse={collapse}
          setCollapse={this.setCollapse}
          toggle={toggle}
          setToggle={this.setToggle}
          history={history}
        />

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
        {roomSelected ? (
          <ModalMaterialUi
            shapeModal={{
              width: '40%',
              top: '10%',
              left: '30%',
              padding: 0,
              // overflow: 'hidden',
              borderRadius: 5,
              background: 'black',
              color: 'white',
              opacity: 1,
            }}
            onCloseModal={() => this.closeCheckPass()}
            isOpenModal={checkPassModal}
          >
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>{roomSelected.name}</h2>

              <div style={{ margin: '10px 0' }}>
                <label
                  style={{
                    display: 'flex',
                    margin: '0 auto',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    width: '50%',
                  }}
                >
                  <FormattedMessage {...messages.passwordRoom} />
                  <input
                    type="text"
                    name="passwordRoomInGame"
                    value={passwordRoomInGame}
                    onChange={(e) =>
                      this.setState({
                        passwordRoomInGame: e.target.value,
                      })
                    }
                    style={{
                      marginLeft: 10,
                      padding: 5,
                      borderRadius: 3,
                      background: 'white',
                      color: 'black',
                    }}
                  />
                </label>
              </div>
              <button
                onClick={() => this.closeCheckPass()}
                style={{
                  marginTop: 20,
                  padding: '10px 20px',
                  borderRadius: 5,
                  fontWeight: 'bold',
                }}
              >
                <FormattedMessage {...messages.btnCancel} />
              </button>
              <button
                onClick={() => this.saveCheckPassword()}
                style={{
                  marginTop: 20,
                  padding: '10px 20px',
                  borderRadius: 5,
                  fontWeight: 'bold',
                }}
              >
                <FormattedMessage {...messages.confirm} />
              </button>
            </div>
          </ModalMaterialUi>
        ) : null}

        <ModalMaterialUi
          shapeModal={{
            width: '40%',
            top: '10%',
            left: '30%',
            padding: 0,
            // overflow: 'hidden',
            borderRadius: 5,
            background: 'black',
            color: 'white',
            opacity: 1,
          }}
          onCloseModal={() => this.closeCreateRoom()}
          isOpenModal={openModalCreateRoom}
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>
              <FormattedMessage {...messages.createRoom} />
            </h2>
            <div style={{ margin: '10px 0' }}>
              <label
                style={{
                  display: 'flex',
                  margin: '0 auto',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  width: '70%',
                }}
              >
                <FormattedMessage {...messages.name} />
                <input
                  type="text"
                  name="name"
                  value={name.value}
                  onChange={onChangeTextField}
                  style={{
                    marginLeft: 10,
                    padding: 5,
                    borderRadius: 3,
                    background: 'white',
                    color: 'black',
                  }}
                />
              </label>
            </div>
            <div style={{ margin: '10px 0' }}>
              <label
                style={{
                  display: 'flex',
                  margin: '0 auto',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  width: '70%',
                }}
              >
                <FormattedMessage {...messages.totalPeople} />
                <input
                  type="number"
                  value={totalPeople.value}
                  name="totalPeople"
                  onChange={onChangeTextField}
                  style={{
                    marginLeft: 10,
                    padding: 5,
                    borderRadius: 3,
                    background: 'white',
                    color: 'black',
                  }}
                  max={4}
                />
              </label>
            </div>
            <div style={{ margin: '10px 0' }}>
              <label
                style={{
                  display: 'flex',
                  margin: '0 auto',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  width: '70%',
                }}
              >
                <FormattedMessage {...messages.price} />
                <input
                  type="text"
                  name="price"
                  value={price.value}
                  onChange={onChangeTextField}
                  style={{
                    marginLeft: 10,
                    padding: 5,
                    borderRadius: 3,
                    background: 'white',
                    color: 'black',
                  }}
                />
              </label>
            </div>
            <div style={{ margin: '10px 0' }}>
              <label
                style={{
                  display: 'flex',
                  margin: '0 auto',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  width: '70%',
                }}
              >
                <FormattedMessage {...messages.passwordRoom} />
                <input
                  type="text"
                  name="passwordRoom"
                  value={passwordRoom.value}
                  onChange={onChangeTextField}
                  style={{
                    marginLeft: 10,
                    padding: 5,
                    borderRadius: 3,
                    background: 'white',
                    color: 'black',
                  }}
                />
              </label>
            </div>
            <button
              onClick={() => this.closeCreateRoom()}
              style={{
                marginTop: 20,
                padding: '10px 20px',
                borderRadius: 5,
                fontWeight: 'bold',
              }}
            >
              <FormattedMessage {...messages.btnCancel} />
            </button>
            <button
              onClick={() => this.onCreateRoom()}
              style={{
                marginTop: 20,
                padding: '10px 20px',
                borderRadius: 5,
                fontWeight: 'bold',
              }}
            >
              <FormattedMessage {...messages.btnSave} />
            </button>
          </div>
        </ModalMaterialUi>

        <div
          className="room-game-list"
          style={{ marginTop: 150, position: 'relative' }}
        >
          <Button
            style={{
              background: '#00B5AD',
              color: 'white',
              display: 'flex',
              gap: 10,
              position: 'absolute',
              right: -20,
              top: -210,
              borderRadius: 30,
              height: 42,
            }}
            onClick={() => this.handleCreateRoom()}
          >
            <div style={{ marginRight: 10, fontWeight: 'bold' }}>
              <FormattedMessage {...messages.createRoom} />
            </div>
            <div>
              <Icon icon="oui:ml-create-single-metric-job" fontSize="30px" />
            </div>
          </Button>
          {datas.map((room, key) => (
            <div
              key={key}
              className="room-game-item"
              onClick={() => this.checkPassword(room)}
            >
              {room.passwordRoom || room.isRunning ? (
                <div
                  style={{
                    height: 30,
                    display: 'flex',
                    gap: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {room.passwordRoom ? (
                    <Icon
                      icon="teenyicons:password-solid"
                      fontSize="30px"
                      style={{
                        color: '#e7c526',
                      }}
                    />
                  ) : null}
                  {room.isRunning ? (
                    <Icon
                      icon="mdi:cards-playing-outline"
                      fontSize="35px"
                      style={{
                        color: 'rgb(0 227 255)',
                      }}
                    />
                  ) : null}
                </div>
              ) : (
                <div style={{ height: 30 }}></div>
              )}
              <p
                className="room-game-text"
                style={{
                  boxShadow: '0px -5px 44px 25px #e7c526',
                  height: 30,
                  padding: 9,
                }}
              >
                {room.name}
              </p>
              <img className="room-game-img" alt="" src={imgAttack} />
              <p
                className="room-game-text"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {room.price}{' '}
                <img
                  src={imgbnb}
                  style={{
                    width: 25,
                    height: 25,
                    boxShadow: 'rgb(231, 197, 38) 0px 0px 15px 0px',
                    borderRadius: '100%',
                  }}
                />
              </p>
              <p className="room-game-text">
                {room.currentPeople}/{room.totalPeople}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

RoomGameInformationPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onClearFilter: PropTypes.func,

  onUpdateRoomGame: PropTypes.func,
  onAddRoomGame: PropTypes.func,
  onInitIndexRoomGame: PropTypes.func,

  onGetRoomGameData: PropTypes.func,
  getRoomGameInit: PropTypes.func,

  onDeleteRoomGame: PropTypes.func,
  onDeleteMultiesRoomGame: PropTypes.func,
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
    // modified RoomGame
    onUpdateRoomGame: (id, roomGame) =>
      dispatch(putRoomGameUpdate(id, roomGame)),
    onAddRoomGame: (roomGame) => dispatch(postRoomGameAdd(roomGame)),
    onInitIndexRoomGame: (id) => dispatch(getInitIndexRoomGame(id)),
    // RoomGame index
    onGetRoomGameData: (departmentIds, status, search) =>
      dispatch(getRoomGameData(departmentIds, status, search)),
    getRoomGameInit: () => dispatch(getRoomGameInit()),
    onDeleteRoomGame: (id) => dispatch(deleteRoomGame(id)),
    onDeleteMultiesRoomGame: (ids) => dispatch(deleteMultiesRoomGame(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberRoomGame(pageNumber)),
    onChangePageSize: (pageSize) => dispatch(changePageSizeRoomGame(pageSize)),
    onChangeTextField: (evt, date) => {
      if (!evt.target) {
        dispatch(changeTextField(evt, date));
      } else {
        dispatch(changeTextField(evt.target.name, evt.target.value));
      }
    },
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortRoomGameList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionRoomGameList()),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getRoomGameDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingRoomGame(),
  loading: makeSelectLoading(),
  storeList: getstoreListData(),
  roomGameDataModified: getRoomGameDataModified(),
});

const withReducer = injectReducer({ key: 'roomGame', reducer });
const withSaga = injectSaga({
  key: 'roomGame',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(RoomGameInformationPage));

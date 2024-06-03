/* eslint-disable jsx-a11y/alt-text */
import { withStyles } from '@material-ui/core';
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

import imgAttack from 'images/people/attack.png';
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

export class RoomGameInformationPage extends React.Component {
  state = {
    roomGameIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],
  };

  componentDidMount() {
    this.getDataRoomGameTable([], [], null);
    // this.props.getRoomGameInit();
  }

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
      } else {
        this.getDataRoomGameTable([], [], null);
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

  render() {
    const { roomGameIdSelected, openModal, rowsSelectedId } = this.state;
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

    return (
      <div className="room-game">
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
        <Header loginByAddress={() => null} />
        <div className="room-game-logo">
          <img src={imgAttack} alt="" />
        </div>

        <div className="room-game-list">
          {datas.map((room, key) => (
            <div
              key={key}
              className="room-game-item"
              onClick={() => this.goToRoom(room)}
            >
              <p>{room.name}</p>
              <img className="room-game-img" alt="" src={imgAttack} />
              <p>{room.price} TBNB</p>
              <p>
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

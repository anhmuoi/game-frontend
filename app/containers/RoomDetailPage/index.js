/* eslint-disable jsx-a11y/alt-text */
import { Button, Grid, Typography, withStyles } from '@material-ui/core';
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
  changePageNumberRoomDetail,
  changePageSizeRoomDetail,
  changeTextField,
  deleteMultiesRoomDetail,
  deleteRoomDetail,
  getInitIndexRoomDetail,
  getRoomDetailData,
  getRoomDetailInit,
  getSortDirectionRoomDetailList,
  getSortRoomDetailList,
  postRoomDetailAdd,
  putRoomDetailUpdate,
} from './actions.js';
import messages from './messages.js';
import './styles.css';
import {
  getAjaxInfo,
  getMetaPagingRoomDetail,
  getRoomDetailDataModified,
  getRoomDetailDataSelector,
  getUserListData,
  getstoreListData,
} from './selectors.js';
import Header from '../../components/Header/index.js';
import { create_UUID } from '../../utils/utils.js';
import WebSocketMqtt from '../../utils/mqtt.js';
import { People } from '@material-ui/icons';
import ModalMaterialUi from 'components/Modal';
import CountdownTimer from './TimeRemain.js';

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

export class RoomDetailInformationPage extends React.Component {
  state = {
    roomDetailIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],

    start: false,
    timeRemain: 60,
  };

  componentDidMount() {}

  getDataRoomDetailTable(departmentIds, status, search) {
    this.props.onGetRoomDetailData(departmentIds, status, search);
  }

  deleteMultiesRoomDetail = () => {
    const { roomDetailIdSelected } = this.state;
    this.props.onDeleteMultiesRoomDetail(roomDetailIdSelected);
  };

  rowsSelected = (ids) => this.setState({ roomDetailIdSelected: ids });
  deleteRow = (id) => this.props.onDeleteRoomDetail(id);
  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      search: searchTxt,
    });
    // call props filter RoomDetail on table
    this.getDataRoomDetailTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      searchTxt,
    );
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () =>
    this.props.onGetRoomDetailData(
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

  addRoomDetail = () => {
    this.props.onInitIndexRoomDetail(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (id) => {
    this.props.onInitIndexRoomDetail(id);
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
    const cloneSortColumn = API_COLUMNS.ROOM_DETAILS.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };

  onChangeFilter = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    this.getDataRoomDetailTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.search,
    );
  };

  // componentWillReceiveProps = (nextProps) => {
  //   // const { roomDetailDataModified, history, userList } = this.props;
  //   // const { id, userListId } = roomDetailDataModified.toJS();
  //   // console.log(roomDetailDataModified.toJS(), userList);
  // };
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
    this.props.getRoomDetailInit();
    this.props.onInitIndexRoomDetail(this.props.match.params.id);
  }

  handleReciveMessageMqtt = (message) => {
    const messageQueue = JSON.parse(message.payloadString);
    const { userId } = messageQueue;
    const currentUser = localstoreUtilites.getUserIdFromLocalStorage();
    console.log(messageQueue);
    if (messageQueue.type === MQTT_TYPE.NOTIFICATION.type) {
      if (this.props.match.params.id === messageQueue.data.room.id) {
        this.props.history.push(`/room-game/${messageQueue.data.room.id}`);

        this.props.onInitIndexRoomDetail(this.props.match.params.id);
      } else {
        this.getDataRoomDetailTable([], [], null);
      }
    }
  };
  goToRoom = (room) => {
    const msgId = create_UUID();

    console.log(msgId, window);
    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
      },
    });
  };

  handleStart = () => {
    this.setState({
      start: true,
    });
  };
  closeModalTime = () => {
    this.setState({
      start: false,
    });
  };

  render() {
    const {
      roomDetailIdSelected,
      openModal,
      rowsSelectedId,
      start,
    } = this.state;
    const {
      onUpdateRoomDetail,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddRoomDetail,
      roomDetailDataModified,
      history,
      storeList,
      userList,
      classes,
    } = this.props;
    const {
      id,
      name,
      isRunning,
      description,
      totalPeople,
      currentPeople,
      price,
      userListId,
    } = roomDetailDataModified.toJS();
    if (id.value !== 0) {
      if (localstoreUtilites.getUserIdFromLocalStorage()) {
        const check = userListId.value.find(
          (i) => i === Number(localstoreUtilites.getUserIdFromLocalStorage()),
        );
        console.log(
          userListId.value,
          localstoreUtilites.getUserIdFromLocalStorage(),
          check,
        );
        if (check) {
        } else {
          history.push('/room-game');
        }
      }
    }

    return (
      <div className="room-game">
        <ModalMaterialUi
          shapeModal={{
            width: '70%',
            top: '10%',
            left: '15%',
            padding: 0,
            // overflow: 'hidden',
            borderRadius: 5,
            background: 'black',
            color: 'white',
            opacity: 0.6,
          }}
          isOpenModal={start}
        >
          <Grid className={classes.containerBox}>
            <CountdownTimer
              time={50}
              start={start}
              timeup={() => this.closeModalTime()}
            />
          </Grid>
        </ModalMaterialUi>

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
        <div className="room-detail-info">
          <Typography
            style={{ fontWeight: 'bold', fontSize: 30, color: 'white' }}
          >
            {name.value}
          </Typography>
          <Typography
            style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}
          >
            Price:&nbsp; {price.value}TBNB
          </Typography>
          <Typography
            style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}
          >
            <People />
            {currentPeople.value}/{totalPeople.value}
          </Typography>
        </div>
        <div className="room-detail-list">
          {userListId.value.map((p, key) => (
            <div key={key} className="room-detail-person">
              <img
                className="room-detail-avatar"
                src={
                  userList.find((i) => i.id === p)
                    ? userList.find((i) => i.id === p).avatar
                    : ''
                }
                alt=""
              />
              <p>
                {userList.find((i) => i.id === p)
                  ? userList.find((i) => i.id === p).userName
                  : ''}
              </p>
            </div>
          ))}
        </div>
        <div className="room-detail-start">
          <Button
            variant="contained"
            onClick={() => this.handleStart()}
            // disabled={currentPeople.value === totalPeople.value ? false : true}
            color="white"
            style={{ background: '#00B5AD', color: 'white' }}
          >
            Start
          </Button>
        </div>

        <div className="room-game-list"></div>
      </div>
    );
  }
}

RoomDetailInformationPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onClearFilter: PropTypes.func,

  onUpdateRoomDetail: PropTypes.func,
  onAddRoomDetail: PropTypes.func,
  onInitIndexRoomDetail: PropTypes.func,

  onGetRoomDetailData: PropTypes.func,
  getRoomDetailInit: PropTypes.func,

  onDeleteRoomDetail: PropTypes.func,
  onDeleteMultiesRoomDetail: PropTypes.func,
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
    // modified RoomDetail
    onUpdateRoomDetail: (id, roomDetail) =>
      dispatch(putRoomDetailUpdate(id, roomDetail)),
    onAddRoomDetail: (roomDetail) => dispatch(postRoomDetailAdd(roomDetail)),
    onInitIndexRoomDetail: (id) => dispatch(getInitIndexRoomDetail(id)),
    // RoomDetail index
    onGetRoomDetailData: (departmentIds, status, search) =>
      dispatch(getRoomDetailData(departmentIds, status, search)),
    getRoomDetailInit: () => dispatch(getRoomDetailInit()),
    onDeleteRoomDetail: (id) => dispatch(deleteRoomDetail(id)),
    onDeleteMultiesRoomDetail: (ids) => dispatch(deleteMultiesRoomDetail(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberRoomDetail(pageNumber)),
    onChangePageSize: (pageSize) =>
      dispatch(changePageSizeRoomDetail(pageSize)),
    onChangeTextField: (evt, date) => {
      if (!evt.target) {
        dispatch(changeTextField(evt, date));
      } else {
        dispatch(changeTextField(evt.target.name, evt.target.value));
      }
    },
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortRoomDetailList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionRoomDetailList()),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getRoomDetailDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingRoomDetail(),
  loading: makeSelectLoading(),
  storeList: getstoreListData(),
  userList: getUserListData(),
  roomDetailDataModified: getRoomDetailDataModified(),
});

const withReducer = injectReducer({ key: 'roomDetail', reducer });
const withSaga = injectSaga({
  key: 'roomDetail',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(RoomDetailInformationPage));

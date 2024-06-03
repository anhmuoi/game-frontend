/* eslint-disable jsx-a11y/alt-text */
import {
  Button,
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
import questionIcon from 'images/questionIcon.png';
import imgAttack from 'images/people/attack.png';
import { FormattedMessage } from 'react-intl';
import { API_COLUMNS, MQTT_TYPE } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { IoIosLogOut } from 'react-icons/io';
import happyIcon from 'images/happy.png';
import {
  changePageNumberRoomDetail,
  changePageSizeRoomDetail,
  changeTextField,
  deleteMultiesRoomDetail,
  deleteRoomDetail,
  getInitIndexRoomDetail,
  getMeetingLogsById,
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
  getMeetingLogsDetailSelector,
  getMetaPagingRoomDetail,
  getRoomDetailDataModified,
  getRoomDetailDataSelector,
  getUserListData,
  getstoreListData,
} from './selectors.js';
import Header from '../../components/Header/index.js';
import { create_UUID } from '../../utils/utils.js';
import WebSocketMqtt from '../../utils/mqtt.js';
import { Chat, Close, Launch, Notifications, People, Send } from '@material-ui/icons';
import ModalMaterialUi from 'components/Modal';
import CountdownTimer from './TimeRemain.js';
import { card52, power } from '../../images/people/index.js';
import { isNumber } from 'lodash';
import CardAnimation from './CardAnimation.js';
import Winner from './Winner.js';

const localUsername = localstoreUtilites.getUsernameFromLocalStorage();

const emotionList = [
  { id: 1, label: '❤️' },
  { id: 2, label: '😢' },
  { id: 3, label: '😄' },
  { id: 4, label: '😡' },
  { id: 0, label: '👍' },
];
const nftRawList = [
  {
    id: 0,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 0,
    image: '',
  },
  {
    id: 1,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 1,
    image: '',
  },
  {
    id: 2,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 2,
    image: '',
  },
  {
    id: 3,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 3,
    image: '',
  },
  {
    id: 4,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 4,
    image: '',
  },
  {
    id: 5,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 5,
    image: '',
  },
  {
    id: 6,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 6,
    image: '',
  },
  {
    id: 7,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 7,
    image: '',
  },
  {
    id: 8,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 8,
    image: '',
  },
  {
    id: 9,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 9,
    image: '',
  },
  {
    id: 10,
    address: '',
    name: '',
    description: '',
    isUse: false,
    index: 10,
    image: '',
  },
];

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

const shuffleCards = (cardGame) => {
  // Tạo một bản sao của mảng cardGame
  let shuffledCards = [...cardGame];
  // Sử dụng thuật toán Fisher-Yates để xáo trộn mảng
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
  }
  return shuffledCards;
};
export class RoomDetailInformationPage extends React.Component {
  state = {
    roomDetailIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],
    startCountTimePlayer: false,

    start: false,
    timeRemain: 60,
    nFTListChoose: nftRawList,
    dataRoomInfo: null,
    player1: null,
    player2: null,
    player3: null,
    player4: null,
    idNFTTemp: null,

    isClickNFT: false,
    isClickCard: false,
    cardListClick: [],
    openAttack: false,

    positionAttach: {
      x: 0,
      y: 0,
    },
    winner: null,
    openChat: false,
    messages: [
      {
        text: 'Hi there!',
        userId: 'other',
        avatar: 'https://i.pravatar.cc/40?img=3',
        reactions: [],
      },
      {
        text: 'Hello! How can I help you?',
        userId: 'me',
        avatar: 'https://i.pravatar.cc/40?img=1',
        reactions: [],
      },
    ],
    newMessage: '',
    showEmojiPicker: false,
    selectedMessageIndex: null,
    unReadChat: false,
  };

  componentDidMount() {
    const { roomDetailDataModified, meetingLogsDetailSelector } = this.props;
    const {
      id,
      name,
      isRunning,
      description,
      totalPeople,
      currentPeople,
      currentMeetingLogId,
      price,
      userListId,
    } = roomDetailDataModified.toJS();
  }

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

    let player1 = {};
    let player2 = {};
    let player3 = {};
    let player4 = {};

    const meetingLogsDetailSelector = nextProps.meetingLogsDetailSelector;
    const {
      isRunning,
      currentMeetingLogId,
    } = nextProps.roomDetailDataModified.toJS();
    if (isRunning && isRunning.value) {
      if (meetingLogsDetailSelector === null)
        this.props.onGetMeetingLogsById(currentMeetingLogId.value);
    }

    if (
      meetingLogsDetailSelector &&
      meetingLogsDetailSelector.userList.length > 0 &&
      isRunning.value === true
    ) {
      switch (meetingLogsDetailSelector.userList.length) {
        case 2:
          if (
            Number(meetingLogsDetailSelector.userList[0].id) ===
            Number(localstoreUtilites.getUserIdFromLocalStorage())
          ) {
            player1 = meetingLogsDetailSelector.userList[0];
            player2 = meetingLogsDetailSelector.userList[1];
          } else {
            player1 = meetingLogsDetailSelector.userList[1];
            player2 = meetingLogsDetailSelector.userList[0];
          }
          break;
        case 3:
          const index1 = meetingLogsDetailSelector.userList.find(
            (i) => i.indexPlayer === 1,
          );
          const index2 = meetingLogsDetailSelector.userList.find(
            (i) => i.indexPlayer === 2,
          );
          const index3 = meetingLogsDetailSelector.userList.find(
            (i) => i.indexPlayer === 3,
          );

          const check = meetingLogsDetailSelector.userList.find(
            (i) =>
              i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
          );
          if (check.indexPlayer === 1) {
            player1 = index1;
            player2 = index2;
            player3 = index3;
          } else if (check.indexPlayer === 2) {
            player1 = index2;
            player2 = index3;
            player3 = index1;
          } else if (check.indexPlayer === 3) {
            player1 = index3;
            player2 = index1;
            player3 = index2;
          }

          break;
        case 4:
          const index1_4 = meetingLogsDetailSelector.userList.find(
            (i) => i.indexPlayer === 1,
          );
          const index2_4 = meetingLogsDetailSelector.userList.find(
            (i) => i.indexPlayer === 2,
          );
          const index3_4 = meetingLogsDetailSelector.userList.find(
            (i) => i.indexPlayer === 3,
          );
          const index4_4 = meetingLogsDetailSelector.userList.find(
            (i) => i.indexPlayer === 4,
          );

          const check_4 = meetingLogsDetailSelector.userList.find(
            (i) =>
              i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
          );
          if (check_4.indexPlayer === 1) {
            player1 = index1_4;
            player2 = index2_4;
            player3 = index3_4;
            player4 = index4_4;
          } else if (check.indexPlayer === 2) {
            player1 = index2_4;
            player2 = index3_4;
            player3 = index4_4;
            player4 = index1_4;
          } else if (check.indexPlayer === 3) {
            player1 = index3_4;
            player2 = index4_4;
            player3 = index1_4;
            player4 = index2_4;
          } else if (check.indexPlayer === 4) {
            player1 = index4_4;
            player2 = index1_4;
            player3 = index2_4;
            player4 = index3_4;
          }

          break;

        default:
          break;
      }
    }

    // calculate show position attack
    let x = 0;
    let y = 0;
    if (
      meetingLogsDetailSelector &&
      meetingLogsDetailSelector.userList.length > 0 &&
      isRunning.value === true
    ) {
      if (meetingLogsDetailSelector.userList.length === 2) {
        if (player1.id === meetingLogsDetailSelector.gamePlay.currentTurnId) {
          x = 0;
          y = 270;
        } else if (
          player2.id === meetingLogsDetailSelector.gamePlay.currentTurnId
        ) {
          x = 0;
          y = -200;
        }
      } else if (meetingLogsDetailSelector.userList.length === 3) {
        if (player1.id === meetingLogsDetailSelector.gamePlay.currentTurnId) {
          x = 0;
          y = 270;
        } else if (
          player2.id === meetingLogsDetailSelector.gamePlay.currentTurnId
        ) {
          x = -700;
          y = 50;
        } else if (
          player3.id === meetingLogsDetailSelector.gamePlay.currentTurnId
        ) {
          x = 700;
          y = 70;
        }
      } else if (meetingLogsDetailSelector.userList.length === 4) {
        if (player1.id === meetingLogsDetailSelector.gamePlay.currentTurnId) {
          x = 0;
          y = 270;
        } else if (
          player2.id === meetingLogsDetailSelector.gamePlay.currentTurnId
        ) {
          x = 0;
          y = -200;
        } else if (
          player3.id === meetingLogsDetailSelector.gamePlay.currentTurnId
        ) {
          x = 700;
          y = 70;
        } else if (
          player4.id === meetingLogsDetailSelector.gamePlay.currentTurnId
        ) {
          x = -700;
          y = 50;
        }
      }
    }
    this.setState({
      player1: player1,
      player2: player2,
      player3: player3,
      player4: player4,
      positionAttach: {
        x: x,
        y: y,
      },
    });
  }

  componentDidUpdate = () => {
    const {
      meetingLogsDetailSelector,
      roomDetailDataModified,
      userList,
    } = this.props;
    const {
      id,
      isRunning,
      currentMeetingLogId,
    } = roomDetailDataModified.toJS();

    const checkOwnerRoom = userList.find(
      (i) => i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
    );
    if (checkOwnerRoom && checkOwnerRoom.ownerRoom === id.value) {
      if (isRunning && isRunning.value) {
        if (meetingLogsDetailSelector !== null) {
          console.log(meetingLogsDetailSelector);
          let countCard = [];
          meetingLogsDetailSelector.gamePlay.cardList.map((i) => {
            if (i.choose) {
              countCard.push(i);
            }
          });
          let checkHp = false;

          meetingLogsDetailSelector.userList.map((i) => {
            if (i.hp <= 0) {
              checkHp = true;
            }
          });
          if (countCard.length === 52 || checkHp) {
            console.log('end');
            const msgId = create_UUID();

            const {
              id,
              name,
              isRunning,
              description,
              totalPeople,
              currentPeople,
              currentMeetingLogId,
              price,
              userListId,
            } = roomDetailDataModified.toJS();
            let room = {};
            room.id = id.value;
            room.name = name.value;
            room.isRunning = isRunning.value;
            room.description = description.value;
            room.totalPeople = totalPeople.value;
            room.currentPeople = currentPeople.value;
            room.price = price.value;
            room.userListId = userListId.value;
            let dataSend = [];
            let orderWinning = [];
            userListId.value.map((item) => {
              let el = meetingLogsDetailSelector.userList.find(
                (i) => i.id === item,
              );
              dataSend.push({
                id: item,
                walletAddress: el.walletAddress,
                name: el.name,
                avatar: el.avatar,
                indexPlayer: el.indexPlayer,
                hp: el.hp,
                mana: el.mana,
                shield: el.shield,
                nFTList: el.nftList,
                skillId: el.skillId,
              });
            });

            dataSend = dataSend.sort((a, b) => b.hp - a.hp);
            dataSend.map((i) => {
              orderWinning.push(i.id);
            });

            window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
              msgId: msgId,
              type: MQTT_TYPE.EXPORT_MEMBER.type,
              data: {
                room: room,
                userId: localstoreUtilites.getUserIdFromLocalStorage(),
                action: {
                  id: 4,
                  meetingLogId: meetingLogsDetailSelector.id,
                  userStatus: dataSend,
                  gamePlay: {
                    cardList: meetingLogsDetailSelector.gamePlay.cardList,
                    oldId: meetingLogsDetailSelector.gamePlay.currentTurnId,
                    currentTurnId:
                      meetingLogsDetailSelector.gamePlay.nextTurnId,
                    nextTurnId: 0,
                    cardId: [],
                    orderWinning: orderWinning,
                  },
                },
              },
            });
          }
        }
      }
    }
  };

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
      if (messageQueue.data.room.userListId.includes(Number(currentUser))) {
        if (messageQueue.data.action.id === 6) {
          this.props.onInitIndexRoomDetail(this.props.match.params.id);
          this.props.onGetMeetingLogsById(
            messageQueue.data.room.currentMeetingLogId,
          );
          this.setState({
            openAttack: true,
            isClickCard: false,
            idNFTTemp: null,
            isClickNFT: false,
          });
        }
        if (messageQueue.data.action.id === 1) {
          this.props.onInitIndexRoomDetail(this.props.match.params.id);
          if (messageQueue.data.room.currentMeetingLogId !== 0) {
            this.props.onGetMeetingLogsById(
              messageQueue.data.room.currentMeetingLogId,
            );
          }
        }
        if (messageQueue.data.action.id === 2) {
          this.props.onGetMeetingLogsById(
            messageQueue.data.room.currentMeetingLogId,
          );
          this.setState({ unReadChat: true });
        }
        if (messageQueue.data.action.id === 4) {
          this.showEndGame(messageQueue.data.action);
        }
        if (messageQueue.data.action.id === 5) {
          this.handleStart();
          console.log('start => modal');
        }
        if (messageQueue.data.messageType === 'error') {
          this.props.onInitIndexRoomDetail(this.props.match.params.id);
        } else {
          if (messageQueue.data.action.id === 0) {
            this.props.onInitIndexRoomDetail(this.props.match.params.id);
            this.props.getRoomDetailInit();
          }
          if (messageQueue.data.action.id === 3) {
            this.props.onInitIndexRoomDetail(this.props.match.params.id);
            this.props.onGetMeetingLogsById(
              messageQueue.data.room.currentMeetingLogId,
            );
            this.setState({
              startCountTimePlayer: true,
            });
          }
          if (this.state.dataRoomInfo === null) {
            this.props.onInitIndexRoomDetail(this.props.match.params.id);
          }
        }
      } else {
        this.props.onInitIndexRoomDetail(this.props.match.params.id);
      }
      this.setState({
        dataRoomInfo: messageQueue.data,
      });
    }
  };
  ownClickStart = () => {
    const { userList, roomDetailDataModified } = this.props;
    const { nFTListChoose, dataRoomInfo } = this.state;
    const {
      id,
      name,
      isRunning,
      description,
      totalPeople,
      currentPeople,
      currentMeetingLogId,
      price,
      userListId,
    } = roomDetailDataModified.toJS();
    let room = {};
    if (dataRoomInfo === null) {
      room.id = id.value;
      room.name = name.value;
      room.isRunning = isRunning.value;
      room.description = description.value;
      room.totalPeople = totalPeople.value;
      room.currentPeople = currentPeople.value;
      room.price = price.value;
      room.userListId = userListId.value;
    } else {
      room = dataRoomInfo.room;
    }

    let dataSend = [];
    userListId.value.map((item) => {
      let el = userList.find((i) => i.id === item);
      dataSend.push({
        id: item,
        walletAddress: el.userName,
        name: el.name,
        avatar: el.avatar,
        indexPlayer: el.indexPlayer,
        hp: 100,
        mana: 100,
        shield: 0,
        nFTList: [],
        skillId: '',
      });
    });

    dataSend = dataSend.sort((a, b) => a.indexPlayer - b.indexPlayer);

    const msgId = create_UUID();

    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
        action: {
          id: 5,
          userStatus: dataSend,
          gamePlay: {
            cardList: shuffleCards(card52),
            currentTurnId: dataSend[0].id,
            nextTurnId: dataSend[1].id,
          },
        },
      },
    });
  };
  startTheGame = (NFTChoose) => {
    const { userList, roomDetailDataModified } = this.props;
    const { dataRoomInfo } = this.state;
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

    let dataSend = [];
    userListId.value.map((item) => {
      let el = userList.find((i) => i.id === item);
      dataSend.push({
        id: item,
        walletAddress: el.userName,
        name: el.name,
        avatar: el.avatar,
        hp: 100,
        mana: 100,
        shield: 0,
        indexPlayer: el.indexPlayer,
        nFTList: NFTChoose,
        skillId: '',
      });
    });

    const msgId = create_UUID();

    let room = {};
    if (dataRoomInfo === null) {
      room.id = id.value;
      room.name = name.value;
      room.isRunning = isRunning.value;
      room.description = description.value;
      room.totalPeople = totalPeople.value;
      room.currentPeople = currentPeople.value;
      room.price = price.value;
      room.userListId = userListId.value;
    } else {
      room = dataRoomInfo.room;
    }
    console.log(dataSend);
    dataSend = dataSend.sort((a, b) => a.indexPlayer - b.indexPlayer);

    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
        action: {
          id: 3,
          meetingLogId: dataRoomInfo.action.meetingLogId,
          userStatus: dataSend.filter(
            (i) =>
              i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
          ),
          gamePlay: {
            cardList: shuffleCards(card52),
            currentTurnId: dataSend[0].id,
            nextTurnId: dataSend[1].id,
          },
        },
      },
    });
  };

  handleStart = () => {
    this.setState({
      start: true,
    });
  };
  closeModalTime = () => {
    const { nFTListChoose } = this.state;
    let newNFT = [];
    let nftListRandom = [...power.filter((i) => i.name)];
    let index = null;
    nFTListChoose.map((i, key) => {
      if (isNumber(i.id)) {
        if (index === null) {
          index = key;
        }
      } else {
        const check = nftListRandom.findIndex((item) => item.id === i.id);
        if (check !== -1) {
          // Xóa phần tử tại chỉ số đó
          nftListRandom.splice(check, 1);
        }
      }
    });

    nFTListChoose.map((i, key) => {
      if (key >= index && index !== null) {
        const randomIndex = Math.floor(Math.random() * nftListRandom.length);
        const nft = nftListRandom[randomIndex];
        newNFT.push({
          id: nft.id,
          address: nft.address ? nft.address : '',
          name: nft.name,
          description: nft.description,
          isUse: false,
          index: nFTListChoose.length,
          image: nft.image,
          mana: nft.mana,
        });
        nftListRandom.splice(randomIndex, 1);
      } else {
        newNFT.push(i);
      }
    });

    this.startTheGame(newNFT);
    this.setState({
      start: false,
      nFTListChoose: newNFT,
    });
  };

  chooseTheNFT = (nft) => {
    const { nFTListChoose } = this.state;
    const checkExist = nFTListChoose.find((m) => m.id === nft.id);
    if (checkExist) {
      this.props.enqueueSnackbar(<FormattedMessage {...messages.existItem} />, {
        variant: 'error',
      });
    } else {
      let newNFT = [];
      let index = null;
      nFTListChoose.map((i, key) => {
        if (isNumber(i.id)) {
          if (index === null) {
            index = key;
          }
        }
      });
      nFTListChoose.map((i, key) => {
        if (key === index) {
          newNFT.push({
            id: nft.id,
            address: nft.address ? nft.address : '',
            name: nft.name,
            description: nft.description,
            isUse: false,
            index: nFTListChoose.length,
            image: nft.image,
            mana: nft.mana,
          });
        } else {
          newNFT.push(i);
        }
      });

      this.setState({
        nFTListChoose: newNFT,
      });
    }
  };

  pushStartFirst = () => {
    const { dataRoomInfo } = this.state;

    const msgId = create_UUID();
    let room = {};
    const { roomDetailDataModified } = this.props;
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
    if (dataRoomInfo === null) {
      room.id = id.value;
      room.name = name.value;
      room.isRunning = isRunning.value;
      room.description = description.value;
      room.totalPeople = totalPeople.value;
      room.currentPeople = currentPeople.value;
      room.price = price.value;
      room.userListId = userListId.value;
    } else {
      room = dataRoomInfo.room;
    }

    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
        action: {
          id: 5,
        },
      },
    });
  };

  clickCard = (cardId) => {
    this.setState({
      isClickCard: true,
      cardListClick: [...this.state.cardListClick, cardId],
      startCountTimePlayer: false,
    });
    const { player1, player2, player3, player4, idNFTTemp } = this.state;
    const { meetingLogsDetailSelector } = this.props;
    console.log(meetingLogsDetailSelector);
    const { gamePlay } = meetingLogsDetailSelector;
    const { nextTurnId, currentTurnId } = gamePlay;
    let newListCard = [];
    meetingLogsDetailSelector.gamePlay.cardList.map((item) => {
      if (item.id === cardId) {
        newListCard.push({
          ...item,
          choose: true,
          userId: currentTurnId,
        });
      } else {
        newListCard.push(item);
      }
    });

    const { userList, roomDetailDataModified } = this.props;
    const { dataRoomInfo } = this.state;
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

    let NFTChoose = [];
    player1.nftList.map((i) => {
      if (i.id === idNFTTemp) {
        NFTChoose.push({ ...i, isUse: true });
      } else {
        NFTChoose.push(i);
      }
    });

    // ********************calculate power **********************************

    let continueChoose = false;
    let hp = 0;
    let mana = 0;
    let shield = 0;

    let hpEnemy = 0;
    let manaEnemy = 0;
    let shieldEnemy = 0;
    let skillId = '';
    const cardDetail = cardId.split('-');
    if (idNFTTemp === null) {
      if (cardDetail[0].includes('tep')) {
        shield += Number(cardDetail[1]);
      } else if (cardDetail[0].includes('co')) {
        hp += Number(cardDetail[1]);
      } else if (cardDetail[0].includes('zo')) {
        shieldEnemy -= Number(cardDetail[1]);
      } else if (cardDetail[0].includes('bich')) {
        hp -= Number(cardDetail[1]);
      }
    } else {
      switch (idNFTTemp) {
        case 'power-4':
          mana += Number(cardDetail[1]) / 2;
          break;
        case 'power-7':
          hp += Number(cardDetail[1]);
          mana -= 20;
          break;
        case 'power-16':
          shield += Number(cardDetail[1]);
          mana -= 20;
          break;
        case 'power-17':
          skillId = 'power-17';
          mana -= 20;
          break;
        case 'power-18':
          //
          mana -= 20;
          break;
        case 'power-20':
          shieldEnemy -= Number(cardDetail[1]);
          shield += Number(cardDetail[1]);
          mana -= 30;
          break;
        case 'power-21':
          shieldEnemy -= Number(cardDetail[1]) * 2;
          mana -= 30;
          break;
        case 'power-22':
          shieldEnemy -= Number(cardDetail[1]) * 3;
          mana -= 30;
          break;
        case 'power-23':
          shieldEnemy -= Number(cardDetail[1]);
          mana -= 20;
          break;
        case 'power-24':
          skillId = 'power-24';
          mana -= 20;
          break;
        case 'power-26':
          hpEnemy -= Number(cardDetail[1]);
          mana -= 25;
          break;
        case 'power-41':
          shield += Number(cardDetail[1]) * 3;
          mana -= 40;
          break;
        case 'power-43':
          hpEnemy += Number(cardDetail[1]);
          mana -= 10;
          break;
        case 'power-44':
          manaEnemy += Number(cardDetail[1]);
          mana -= 10;
          break;
        case 'power-45':
          mana += Number(cardDetail[1]);
          manaEnemy -= Number(cardDetail[1]);
          break;
        case 'power-48':
          mana += Number(cardDetail[1]);
          hp += Number(cardDetail[1]);
          mana -= 40;
          break;
        case 'power-5':
          if (this.state.cardListClick.length === 1) {
            this.setState({
              isClickCard: false,
            });
            if (cardDetail[0].includes('tep')) {
              shield += Number(cardDetail[1]);
            } else if (cardDetail[0].includes('co')) {
              hp += Number(cardDetail[1]);
            } else if (cardDetail[0].includes('zo')) {
              hpEnemy -= Number(cardDetail[1]);
            } else if (cardDetail[0].includes('bich')) {
              hp -= Number(cardDetail[1]);
            }
          } else if (this.state.cardListClick.length === 2) {
            mana -= 20;
            const cardDetail1 = cardId.split('-');
            const cardDetail2 = cardId.split('-');
            if (cardDetail1[0].includes('tep')) {
              shield += Number(cardDetail1[1]);
            } else if (cardDetail1[0].includes('co')) {
              hp += Number(cardDetail1[1]);
            } else if (cardDetail1[0].includes('zo')) {
              hpEnemy -= Number(cardDetail1[1]);
            } else if (cardDetail1[0].includes('bich')) {
              hp -= Number(cardDetail1[1]);
            }
            if (cardDetail2[0].includes('tep')) {
              shield += Number(cardDetail2[1]);
            } else if (cardDetail2[0].includes('co')) {
              hp += Number(cardDetail2[1]);
            } else if (cardDetail2[0].includes('zo')) {
              hpEnemy -= Number(cardDetail2[1]);
            } else if (cardDetail2[0].includes('bich')) {
              hp -= Number(cardDetail2[1]);
            }
          }
          break;

        default:
          break;
      }
    }

    const userEnemy = userList.find((i) => i.id === nextTurnId);

    if (userEnemy && userEnemy.skillId === 'power-17') {
      hpEnemy = 0;
      manaEnemy = 0;
      shieldEnemy = 0;
    }

    // ***********************************************************************
    if (idNFTTemp === 'power-5' && this.state.cardListClick.length === 2) {
      let dataSend = [];
      userListId.value.map((item) => {
        let el = userList.find((i) => i.id === item);

        if (el.id === currentTurnId) {
          let hpTempCurrent = el.hp + hp;
          let manaTempCurrent = el.mana + mana;
          let shieldTempCurrent = el.shield + shield;
          if (shieldTempCurrent < 0) {
            hpTempCurrent += shieldTempCurrent;
          }

          if (hpTempCurrent > 100) {
            hpTempCurrent = 100;
          } else if (hpTempCurrent < 0) {
            hpTempCurrent = 0;
          }
          if (shieldTempCurrent > 100) {
            shieldTempCurrent = 100;
          } else if (shieldTempCurrent < 0) {
            shieldTempCurrent = 0;
          }
          if (manaTempCurrent > 100) {
            manaTempCurrent = 100;
          } else if (manaTempCurrent < 0) {
            manaTempCurrent = 0;
          }
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: hpTempCurrent,
            mana: manaTempCurrent,
            shield: shieldTempCurrent,
            indexPlayer: el.indexPlayer,
            nFTList: NFTChoose,
            skillId: skillId,
          });
        } else if (el.id === nextTurnId) {
          let hpTempNext = el.hp + hpEnemy;
          let manaTempNext = el.mana + manaEnemy;
          let shieldTempNext = el.shield + shieldEnemy;
          if (shieldTempNext < 0) {
            hpTempNext += shieldTempNext;
          }

          if (hpTempNext > 100) {
            hpTempNext = 100;
          } else if (hpTempNext < 0) {
            hpTempNext = 0;
          }
          if (shieldTempNext > 100) {
            shieldTempNext = 100;
          } else if (shieldTempNext < 0) {
            shieldTempNext = 0;
          }
          if (manaTempNext > 100) {
            manaTempNext = 100;
          } else if (manaTempNext < 0) {
            manaTempNext = 0;
          }
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: hpTempNext,
            mana: manaTempNext,
            shield: shieldTempNext,
            indexPlayer: el.indexPlayer,
            nFTList: player2.nftList,
            skillId: '',
          });
        } else {
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: el.hp,
            mana: el.mana,
            shield: el.shield,
            indexPlayer: el.indexPlayer,
            nFTList: item === player3.id ? player3.nftList : player4.nftList,
            skillId: '',
          });
        }
      });

      const msgId = create_UUID();

      let room = {};
      if (dataRoomInfo === null) {
        room.id = id.value;
        room.name = name.value;
        room.isRunning = isRunning.value;
        room.description = description.value;
        room.totalPeople = totalPeople.value;
        room.currentPeople = currentPeople.value;
        room.price = price.value;
        room.userListId = userListId.value;
      } else {
        room = dataRoomInfo.room;
      }
      dataSend = dataSend.sort((a, b) => a.indexPlayer - b.indexPlayer);

      const currentIndex = dataSend.findIndex(
        (m) => m.id === meetingLogsDetailSelector.gamePlay.nextTurnId,
      );
      let nextIndex = null;
      if (dataSend.length === 2) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else {
          nextIndex = 0;
        }
      } else if (dataSend.length === 3) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else if (currentIndex === 1) {
          nextIndex = 2;
        } else if (currentIndex === 2) {
          nextIndex = 0;
        }
      } else if (dataSend.length === 4) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else if (currentIndex === 1) {
          nextIndex = 2;
        } else if (currentIndex === 2) {
          nextIndex = 3;
        } else if (currentIndex === 3) {
          nextIndex = 0;
        }
      }

      window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
        msgId: msgId,
        type: MQTT_TYPE.EXPORT_MEMBER.type,
        data: {
          room: room,
          userId: localstoreUtilites.getUserIdFromLocalStorage(),
          action: {
            id: 6,
            meetingLogId: meetingLogsDetailSelector.id,
            userStatus: dataSend,
            gamePlay: {
              cardList: newListCard,
              oldId: meetingLogsDetailSelector.gamePlay.currentTurnId,
              currentTurnId: meetingLogsDetailSelector.gamePlay.nextTurnId,
              nextTurnId: dataSend[nextIndex].id,
              cardId: [...this.state.cardListClick],
              itemNFTId: idNFTTemp,
            },
          },
        },
      });
    } else if (idNFTTemp !== 'power-5') {
      let dataSend = [];
      userListId.value.map((item) => {
        let el = meetingLogsDetailSelector.userList.find((i) => i.id === item);
        console.log(hp, mana, shield, '/', hpEnemy, manaEnemy, shieldEnemy);

        if (el.id === currentTurnId) {
          let hpTempCurrent = el.hp + hp;
          let manaTempCurrent = el.mana + mana;
          let shieldTempCurrent = el.shield + shield;
          if (shieldTempCurrent < 0) {
            hpTempCurrent += shieldTempCurrent;
          }

          if (hpTempCurrent > 100) {
            hpTempCurrent = 100;
          } else if (hpTempCurrent < 0) {
            hpTempCurrent = 0;
          }
          if (shieldTempCurrent > 100) {
            shieldTempCurrent = 100;
          } else if (shieldTempCurrent < 0) {
            shieldTempCurrent = 0;
          }
          if (manaTempCurrent > 100) {
            manaTempCurrent = 100;
          } else if (manaTempCurrent < 0) {
            manaTempCurrent = 0;
          }

          console.log(hpTempCurrent, manaTempCurrent, shieldTempCurrent);
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: hpTempCurrent,
            mana: manaTempCurrent,
            shield: shieldTempCurrent,
            indexPlayer: el.indexPlayer,
            nFTList: NFTChoose,
            skillId: skillId,
          });
        } else if (el.id === nextTurnId) {
          let hpTempNext = el.hp + hpEnemy;
          let manaTempNext = el.mana + manaEnemy;
          let shieldTempNext = el.shield + shieldEnemy;
          if (shieldTempNext < 0) {
            hpTempNext += shieldTempNext;
          }

          if (hpTempNext > 100) {
            hpTempNext = 100;
          } else if (hpTempNext < 0) {
            hpTempNext = 0;
          }
          if (shieldTempNext > 100) {
            shieldTempNext = 100;
          } else if (shieldTempNext < 0) {
            shieldTempNext = 0;
          }
          if (manaTempNext > 100) {
            manaTempNext = 100;
          } else if (manaTempNext < 0) {
            manaTempNext = 0;
          }
          console.log(hpTempNext, manaTempNext, shieldTempNext);
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: hpTempNext,
            mana: manaTempNext,
            shield: shieldTempNext,
            indexPlayer: el.indexPlayer,
            nFTList: player2.nftList,
            skillId: el.skillId,
          });
        } else {
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: el.hp,
            mana: el.mana,
            shield: el.shield,
            indexPlayer: el.indexPlayer,
            nFTList: item === player3.id ? player3.nftList : player4.nftList,
            skillId: el.skillId,
          });
        }
      });

      const msgId = create_UUID();

      let room = {};
      if (dataRoomInfo === null) {
        room.id = id.value;
        room.name = name.value;
        room.isRunning = isRunning.value;
        room.description = description.value;
        room.totalPeople = totalPeople.value;
        room.currentPeople = currentPeople.value;
        room.price = price.value;
        room.userListId = userListId.value;
      } else {
        room = dataRoomInfo.room;
      }
      dataSend = dataSend.sort((a, b) => a.indexPlayer - b.indexPlayer);

      if (idNFTTemp === 'power-2') {
      }

      const currentIndex = dataSend.findIndex(
        (m) => m.id === meetingLogsDetailSelector.gamePlay.nextTurnId,
      );
      let nextIndex = null;
      if (dataSend.length === 2) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else {
          nextIndex = 0;
        }
      } else if (dataSend.length === 3) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else if (currentIndex === 1) {
          nextIndex = 2;
        } else if (currentIndex === 2) {
          nextIndex = 0;
        }
      } else if (dataSend.length === 4) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else if (currentIndex === 1) {
          nextIndex = 2;
        } else if (currentIndex === 2) {
          nextIndex = 3;
        } else if (currentIndex === 3) {
          nextIndex = 0;
        }
      }
      console.log(dataSend, currentIndex, nextIndex, cardId);

      window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
        msgId: msgId,
        type: MQTT_TYPE.EXPORT_MEMBER.type,
        data: {
          room: room,
          userId: localstoreUtilites.getUserIdFromLocalStorage(),
          action: {
            id: 6,
            meetingLogId: meetingLogsDetailSelector.id,
            userStatus: dataSend,
            gamePlay: {
              cardList: newListCard,
              oldId: meetingLogsDetailSelector.gamePlay.currentTurnId,
              currentTurnId: meetingLogsDetailSelector.gamePlay.nextTurnId,
              nextTurnId: dataSend[nextIndex].id,
              cardId: [cardId],
              itemNFTId: idNFTTemp,
            },
          },
        },
      });
    }
  };

  clickUseNFT = (player, NFT) => {
    if (NFT.id === 'power-18') {
    }
    this.setState({
      idNFTTemp: NFT.id,
      isClickNFT: true,
    });
  };

  runCountTimePlayer = () => {
    this.setState({
      startCountTimePlayer: true,
    });
  };

  showEndGame = (data) => {
    const winPlayer = data.userStatus.find(
      (i) => i.id === data.gamePlay.orderWinning[0],
    );
    console.log(data);
    this.setState({
      winner: winPlayer,
    });
  };

  handleTimeUpPlayer = () => {
    if (this.state.startCountTimePlayer) {
      const { player1, player2, player3, player4, idNFTTemp } = this.state;
      const { meetingLogsDetailSelector } = this.props;
      console.log(meetingLogsDetailSelector);
      const { gamePlay } = meetingLogsDetailSelector;
      const { nextTurnId, currentTurnId } = gamePlay;
      let newListCard = [];
      meetingLogsDetailSelector.gamePlay.cardList.map((item) => {
        newListCard.push(item);
      });

      const { userList, roomDetailDataModified } = this.props;
      const { dataRoomInfo } = this.state;
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

      let NFTChoose = [];
      player1.nftList.map((i) => {
        NFTChoose.push(i);
      });

      let hp = 0;
      let mana = 0;
      let shield = 0;

      let hpEnemy = 0;
      let manaEnemy = 0;
      let shieldEnemy = 0;
      let skillId = '';

      mana -= 20;

      const userEnemy = userList.find((i) => i.id === nextTurnId);

      let dataSend = [];
      userListId.value.map((item) => {
        let el = meetingLogsDetailSelector.userList.find((i) => i.id === item);

        if (el.id === currentTurnId) {
          let hpTempCurrent = el.hp + hp;
          let manaTempCurrent = el.mana + mana;
          let shieldTempCurrent = el.shield + shield;
          if (shieldTempCurrent < 0) {
            hpTempCurrent += shieldTempCurrent;
          }

          if (hpTempCurrent > 100) {
            hpTempCurrent = 100;
          } else if (hpTempCurrent < 0) {
            hpTempCurrent = 0;
          }
          if (shieldTempCurrent > 100) {
            shieldTempCurrent = 100;
          } else if (shieldTempCurrent < 0) {
            shieldTempCurrent = 0;
          }
          if (manaTempCurrent > 100) {
            manaTempCurrent = 100;
          } else if (manaTempCurrent < 0) {
            manaTempCurrent = 0;
          }

          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: hpTempCurrent,
            mana: manaTempCurrent,
            shield: shieldTempCurrent,
            indexPlayer: el.indexPlayer,
            nFTList: NFTChoose,
            skillId: skillId,
          });
        } else if (el.id === nextTurnId) {
          let hpTempNext = el.hp + hpEnemy;
          let manaTempNext = el.mana + manaEnemy;
          let shieldTempNext = el.shield + shieldEnemy;
          if (shieldTempNext < 0) {
            hpTempNext += shieldTempNext;
          }

          if (hpTempNext > 100) {
            hpTempNext = 100;
          } else if (hpTempNext < 0) {
            hpTempNext = 0;
          }
          if (shieldTempNext > 100) {
            shieldTempNext = 100;
          } else if (shieldTempNext < 0) {
            shieldTempNext = 0;
          }
          if (manaTempNext > 100) {
            manaTempNext = 100;
          } else if (manaTempNext < 0) {
            manaTempNext = 0;
          }
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: hpTempNext,
            mana: manaTempNext,
            shield: shieldTempNext,
            indexPlayer: el.indexPlayer,
            nFTList: player2.nftList,
            skillId: el.skillId,
          });
        } else {
          dataSend.push({
            id: item,
            walletAddress: el.userName,
            name: el.name,
            avatar: el.avatar,
            hp: el.hp,
            mana: el.mana,
            shield: el.shield,
            indexPlayer: el.indexPlayer,
            nFTList: item === player3.id ? player3.nftList : player4.nftList,
            skillId: el.skillId,
          });
        }
      });

      const msgId = create_UUID();

      let room = {};
      if (dataRoomInfo === null) {
        room.id = id.value;
        room.name = name.value;
        room.isRunning = isRunning.value;
        room.description = description.value;
        room.totalPeople = totalPeople.value;
        room.currentPeople = currentPeople.value;
        room.price = price.value;
        room.userListId = userListId.value;
      } else {
        room = dataRoomInfo.room;
      }
      dataSend = dataSend.sort((a, b) => a.indexPlayer - b.indexPlayer);

      const currentIndex = dataSend.findIndex(
        (m) => m.id === meetingLogsDetailSelector.gamePlay.nextTurnId,
      );
      let nextIndex = null;
      if (dataSend.length === 2) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else {
          nextIndex = 0;
        }
      } else if (dataSend.length === 3) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else if (currentIndex === 1) {
          nextIndex = 2;
        } else if (currentIndex === 2) {
          nextIndex = 0;
        }
      } else if (dataSend.length === 4) {
        if (currentIndex === 0) {
          nextIndex = 1;
        } else if (currentIndex === 1) {
          nextIndex = 2;
        } else if (currentIndex === 2) {
          nextIndex = 3;
        } else if (currentIndex === 3) {
          nextIndex = 0;
        }
      }

      window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
        msgId: msgId,
        type: MQTT_TYPE.EXPORT_MEMBER.type,
        data: {
          room: room,
          userId: localstoreUtilites.getUserIdFromLocalStorage(),
          action: {
            id: 6,
            meetingLogId: meetingLogsDetailSelector.id,
            userStatus: dataSend,
            gamePlay: {
              cardList: newListCard,
              oldId: meetingLogsDetailSelector.gamePlay.currentTurnId,
              currentTurnId: meetingLogsDetailSelector.gamePlay.nextTurnId,
              nextTurnId: dataSend[nextIndex].id,
              cardId: [],
              itemNFTId: idNFTTemp,
            },
          },
        },
      });
      this.setState({
        startCountTimePlayer: false,
      });
    }
  };

  openChat = () => {
    this.setState({
      openChat: true,
    });
  };
  closeChatBox = () => {
    this.setState({
      openChat: false,
      unReadChat: false,
    });
  };

  handleInputChange = (e) => {
    this.setState({ newMessage: e.target.value });
  };

  handleSend = () => {
    const { newMessage, messages } = this.state;
    if (newMessage.trim() !== '') {
      this.setState({
        messages: [
          ...messages,
          {
            text: newMessage,
            userId: 'me',
            avatar: 'https://i.pravatar.cc/40?img=1',
            reactions: [],
          },
        ],
        newMessage: '',
      });
    }

    const { player1 } = this.state;
    const { meetingLogsDetailSelector } = this.props;
    const { content } = meetingLogsDetailSelector;

    let newContentChat = [
      ...content,
      {
        id: content.length,
        text: newMessage,
        userId: player1.id,
        avatar: player1.avatar,
        reactions: [],
      },
    ];

    const { roomDetailDataModified } = this.props;
    const { dataRoomInfo } = this.state;
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

    const msgId = create_UUID();

    let room = {};
    if (dataRoomInfo === null) {
      room.id = id.value;
      room.name = name.value;
      room.isRunning = isRunning.value;
      room.description = description.value;
      room.totalPeople = totalPeople.value;
      room.currentPeople = currentPeople.value;
      room.price = price.value;
      room.userListId = userListId.value;
    } else {
      room = dataRoomInfo.room;
    }

    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
        action: {
          id: 2,
          meetingLogId: meetingLogsDetailSelector.id,
          content: newContentChat,
        },
      },
    });
  };

  handleEmojiClick = (emoji) => {
    const { selectedMessageIndex } = this.state;

    this.setState({
      showEmojiPicker: false,
      selectedMessageIndex: null,
    });
    const { meetingLogsDetailSelector } = this.props;
    const { content } = meetingLogsDetailSelector;

    let newContentChat = [];
    content.map((item) => {
      if (item.id === selectedMessageIndex.id) {
        let newReactions = [];
        console.log(emoji.id);
        switch (emoji.id) {
          case 0:
            item.reactions.map((el) => {
              if (el.id === 0) {
                newReactions.push({
                  id: 0,
                  quantity: el.quantity + 1,
                });
              } else newReactions.push(el);
            });
            if (!item.reactions.find((el) => el.id === 0)) {
              newReactions.push({
                id: 0,
                quantity: 1,
              });
            }
            break;
          case 1:
            item.reactions.map((el) => {
              if (el.id === 1) {
                newReactions.push({
                  id: 1,
                  quantity: el.quantity + 1,
                });
              } else newReactions.push(el);
            });
            if (!item.reactions.find((el) => el.id === 1)) {
              newReactions.push({
                id: 1,
                quantity: 1,
              });
            }
            break;
          case 2:
            item.reactions.map((el) => {
              if (el.id === 2) {
                newReactions.push({
                  id: 2,
                  quantity: el.quantity + 1,
                });
              } else newReactions.push(el);
            });
            if (!item.reactions.find((el) => el.id === 2)) {
              newReactions.push({
                id: 2,
                quantity: 1,
              });
            }
            break;
          case 3:
            item.reactions.map((el) => {
              if (el.id === 3) {
                newReactions.push({
                  id: 3,
                  quantity: el.quantity + 1,
                });
              } else newReactions.push(el);
            });
            if (!item.reactions.find((el) => el.id === 3)) {
              newReactions.push({
                id: 3,
                quantity: 1,
              });
            }
            break;
          case 4:
            item.reactions.map((el) => {
              if (el.id === 4) {
                newReactions.push({
                  id: 4,
                  quantity: el.quantity + 1,
                });
              } else newReactions.push(el);
            });

            if (!item.reactions.find((el) => el.id === 4)) {
              newReactions.push({
                id: 4,
                quantity: 1,
              });
            }
            break;

          default:
            break;
        }

        item.reactions = newReactions;
      }
      newContentChat.push(item);
    });

    const { roomDetailDataModified } = this.props;
    const { dataRoomInfo } = this.state;
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

    const msgId = create_UUID();

    let room = {};
    if (dataRoomInfo === null) {
      room.id = id.value;
      room.name = name.value;
      room.isRunning = isRunning.value;
      room.description = description.value;
      room.totalPeople = totalPeople.value;
      room.currentPeople = currentPeople.value;
      room.price = price.value;
      room.userListId = userListId.value;
    } else {
      room = dataRoomInfo.room;
    }

    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
        action: {
          id: 2,
          meetingLogId: meetingLogsDetailSelector.id,
          content: newContentChat,
        },
      },
    });
  };

  toggleEmojiPicker = (msg) => {
    console.log(msg);
    this.setState({
      showEmojiPicker: !this.state.showEmojiPicker,
      selectedMessageIndex: msg,
    });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleSend();
    }
  };

  handleOutRoom = () => {
    const { roomDetailDataModified, meetingLogsDetailSelector } = this.props;
    const { dataRoomInfo } = this.state;
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

    const msgId = create_UUID();

    let room = {};
    if (dataRoomInfo === null) {
      room.id = id.value;
      room.name = name.value;
      room.isRunning = isRunning.value;
      room.description = description.value;
      room.totalPeople = totalPeople.value;
      room.currentPeople = currentPeople.value;
      room.price = price.value;
      room.userListId = userListId.value;
    } else {
      room = dataRoomInfo.room;
    }

    window.DeMaster_Mqtt_Client.publish(MQTT_TYPE.EXPORT_MEMBER.topic, {
      msgId: msgId,
      type: MQTT_TYPE.EXPORT_MEMBER.type,
      data: {
        room: room,
        userId: localstoreUtilites.getUserIdFromLocalStorage(),
        action: {
          id: 1,
          meetingLogId: meetingLogsDetailSelector.id,
        },
      },
    });
    window.location.href = `${window.location.origin}/room-game`;
  };
  render() {
    const {
      roomDetailIdSelected,
      openModal,
      rowsSelectedId,
      start,
      nFTListChoose,
      dataRoomInfo,
      player1,
      player2,
      player3,
      player4,
      isClickNFT,
      isClickCard,
      startCountTimePlayer,
      positionAttach,
      cardListClick,
      idNFTTemp,
      winner,
      openChat,
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
      meetingLogsDetailSelector,
    } = this.props;
    const { newMessage, showEmojiPicker, unReadChat } = this.state;
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
        if (check) {
        } else {
          console.log(window.location);
          window.location.href = `${window.location.origin}/room-game`;
        }
      }
    }

    const permissionTurn =
      meetingLogsDetailSelector && meetingLogsDetailSelector.gamePlay
        ? meetingLogsDetailSelector.gamePlay.currentTurnId ===
          Number(localstoreUtilites.getUserIdFromLocalStorage())
        : false;

    const currentTurnIdOfGame =
      meetingLogsDetailSelector && meetingLogsDetailSelector.gamePlay
        ? meetingLogsDetailSelector.gamePlay.currentTurnId
        : 0;

    const userOwnerRoom = userList.find(
      (i) => i.id === Number(localstoreUtilites.getUserIdFromLocalStorage()),
    );
    const checkOwnerRoom =
      userOwnerRoom && userOwnerRoom.ownerRoom === id.value ? true : false;
    console.log(meetingLogsDetailSelector);

    return (
      <div className="room-game">
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: openChat ? 0 : '-400px',
            width: '400px',
            height: '100%',
            color: 'white',
            background: 'black',
            opacity: 0.8,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            transition: 'left 0.3s',
            borderRadius: '0 8px 8px 0',
          }}
        >
          <div
            style={{
              padding: '10px',
              borderBottom: '1px solid #eee',
              textAlign: 'right',
            }}
          >
            <button onClick={() => this.closeChatBox()}>
              <Close />
            </button>
          </div>
          <div
            className="chatbox-messages"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px',
              maxHeight: 500,
            }}
          >
            {meetingLogsDetailSelector &&
              meetingLogsDetailSelector.content.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent:
                      msg.userId === player1.id ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                    alignItems: 'center',
                  }}
                >
                  {msg.userId !== player1.id && (
                    <img
                      src={msg.avatar}
                      alt="avatar"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    />
                  )}
                  <div
                    style={{
                      backgroundColor:
                        msg.userId === player1.id ? '#dcf8c6' : '#fff',
                      padding: '10px',
                      borderRadius: '10px',
                      maxWidth: '200px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      color: 'black',
                    }}
                  >
                    {msg.text}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '5px',
                      }}
                    >
                      {msg.reactions &&
                        msg.reactions.map((reaction, idx) => (
                          <div
                            key={idx}
                            style={{ marginRight: '5px', position: 'relative' }}
                          >
                            {emotionList.find((el) => el.id === reaction.id) ? (
                              <React.Fragment>
                                {
                                  emotionList.find(
                                    (el) => el.id === reaction.id,
                                  ).label
                                }
                                {reaction.quantity > 1 ? (
                                  <div className="quantity-emotion">
                                    {reaction.quantity}
                                  </div>
                                ) : null}
                              </React.Fragment>
                            ) : null}
                          </div>
                        ))}
                      <button
                        onClick={() => this.toggleEmojiPicker(msg)}
                        style={{ marginLeft: '5px' }}
                      >
                        <img
                          src={happyIcon}
                          alt=""
                          style={{ width: 15, height: 15 }}
                        />
                      </button>
                    </div>
                  </div>
                  {msg.userId === player1.id && (
                    <img
                      src={msg.avatar}
                      alt="avatar"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginLeft: '10px',
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
          <div
            style={{
              padding: '10px',
              borderTop: '1px solid #eee',
              display: 'flex',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 40,
            }}
          >
            {showEmojiPicker && (
              <div
                style={{ position: 'absolute', bottom: '-40px', right: '10px' }}
              >
                <div style={{ display: 'flex' }}>
                  {emotionList.map((emoji, index) => (
                    <span
                      key={index}
                      onClick={() => this.handleEmojiClick(emoji)}
                      style={{
                        fontSize: '24px',
                        margin: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      {emoji.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <input
              type="text"
              value={newMessage}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              placeholder="Type a message"
              style={{
                width: 'calc(100% - 40px)',
                padding: '10px',
                borderRadius: '20px',
                border: '1px solid #ddd',
              }}
            />
            <button onClick={this.handleSend} style={{ marginLeft: '10px' }}>
              <Send />
            </button>
          </div>{' '}
        </div>
        <div style={{ cursor: 'pointer' }}>
          <FormattedMessage {...messages.outGame}>
            {(message) => (
              <Tooltip title={message}>
                <IconButton
                  aria-owns="menu-appbar"
                  aria-haspopup="true"
                  id="logoutBtn"
                  onClick={() => this.handleOutRoom()}
                  color="inherit"
                  title="Logout"
                  style={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    background: '#00B5AD',
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                >
                  <IoIosLogOut fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </FormattedMessage>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <FormattedMessage {...messages.openChat}>
            {(message) => (
              <Tooltip title={message}>
                <IconButton
                  aria-owns="menu-appbar"
                  aria-haspopup="true"
                  id="logoutBtn"
                  onClick={() => this.openChat()}
                  color="inherit"
                  title="Logout"
                  style={{
                    position: 'absolute',
                    top: 75,
                    left: 15,
                    background: '#00B5AD',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <Chat fontSize="inherit" />
                  {unReadChat === true ? (
                    <div style={{position: 'absolute', top: 0, right: 0, transform: 'translate(25%,-40%)', color: 'red'}}>
                      <Notifications />
                    </div>
                  ) : null}
                </IconButton>
              </Tooltip>
            )}
          </FormattedMessage>
        </div>
        {cardListClick.length > 0 ? (
          <CardAnimation
            x={positionAttach.x}
            y={positionAttach.y}
            data={meetingLogsDetailSelector}
            runCountTimePlayer={() => this.runCountTimePlayer()}
          />
        ) : null}
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
            opacity: 1,
          }}
          onCloseModal={() => {
            this.setState({ winner: null });
            this.props.onInitIndexRoomDetail(this.props.match.params.id);
          }}
          isOpenModal={winner !== null ? true : false}
        >
          <Winner
            winner={
              winner !== null
                ? winner
                : { name: '', hp: '', image: 'https://via.placeholder.com/150' }
            }
          />
        </ModalMaterialUi>
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
            opacity: 0.8,
          }}
          isOpenModal={start}
        >
          <Grid className={classes.containerBox}>
            Time Remaining:
            <CountdownTimer
              time={30}
              start={start}
              timeup={() => this.closeModalTime()}
            />
            <FormattedMessage {...messages.chooseItem} />
            <br />
            {power.map((item) => (
              <React.Fragment>
                {item.name ? (
                  <Tooltip
                    key={item.id}
                    title={`${item.name}, mana: ${item.mana}`}
                  >
                    <img
                      src={item.image}
                      className={`power ${item.isUse ? 'power-use' : ''}`}
                      alt=""
                      onClick={() => this.chooseTheNFT(item)}
                    />
                  </Tooltip>
                ) : null}
              </React.Fragment>
            ))}
            <div className="empty-container">
              {nFTListChoose.map((item) => (
                <React.Fragment>
                  {item.name ? (
                    <Tooltip
                      key={item.id}
                      title={`${item.name}, mana: ${item.mana}`}
                    >
                      <img
                        src={item.image}
                        className={`power ${item.isUse ? 'power-use' : ''}`}
                        alt=""
                      />
                    </Tooltip>
                  ) : (
                    <div className="empty-box">
                      <img alt="" src={questionIcon} className="empty-img" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
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
            style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}
          >
            {name.value}
          </Typography>
          <Typography
            style={{ fontWeight: 'bold', fontSize: 10, color: 'white' }}
          >
            Price:&nbsp; {price.value}TBNB
          </Typography>
          <Typography
            style={{ fontWeight: 'bold', fontSize: 10, color: 'white' }}
          >
            <People />
            {currentPeople.value}/{totalPeople.value}
          </Typography>
        </div>
        {isRunning.value ? (
          <div className="game-play">
            {meetingLogsDetailSelector &&
            meetingLogsDetailSelector.userList.length == 2 ? (
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  transform: 'scale(0.6)',
                  transformOrigin: 'top',
                  left: '0%',
                  top: '0%',
                  display: 'flex',
                  gap: 5,
                  flexWrap: 'wrap',
                  paddingTop: 30,
                }}
              >
                <div>
                  <div className="player">
                    <div className="info">
                      <div className="info-1">
                        {currentTurnIdOfGame === player2.id ? (
                          <CountdownTimer
                            time={30}
                            start={currentTurnIdOfGame === player2.id}
                            timeup={() => null}
                          />
                        ) : null}
                        <div
                          className={`${
                            currentTurnIdOfGame === player2.id
                              ? 'active-turn'
                              : 'not-active-turn'
                          }`}
                        >
                          <img
                            className={`avatar`}
                            src={player2.avatar}
                            alt=""
                          />
                        </div>
                        <div className="name">{player2.name}</div>
                      </div>
                      <div className="item-box">
                        {player2.nftList.map((item) => (
                          <React.Fragment>
                            {item.name ? (
                              <Tooltip key={item.id} title={item.name}>
                                <img
                                  src={item.image}
                                  className={`power ${
                                    item.isUse ? 'power-use' : ''
                                  }`}
                                  alt=""
                                />
                              </Tooltip>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="hp">
                      {new Array(player2.hp).fill(0).map((i, key) => (
                        <div key={key} className="hp-item"></div>
                      ))}
                      {100 - player2.hp > 0
                        ? new Array(100 - player2.hp)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="mana">
                      {new Array(player2.mana).fill(0).map((i, key) => (
                        <div key={key} className="mana-item"></div>
                      ))}
                      {100 - player2.mana > 0
                        ? new Array(100 - player2.mana)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="shield">
                      {new Array(player2.shield).fill(0).map((i, key) => (
                        <div key={key} className="shield-item"></div>
                      ))}
                      {100 - player2.shield > 0
                        ? new Array(100 - player2.shield)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                  </div>

                  <div className="card">
                    {meetingLogsDetailSelector.gamePlay.cardList.map((card) => (
                      <img
                        src={card.choose ? card.image : card.deck}
                        alt=""
                        key={card.id}
                        style={{ width: 60, zIndex: 10, cursor: 'pointer' }}
                        onClick={() => {
                          if (
                            isClickCard === false &&
                            permissionTurn === true
                          ) {
                            this.clickCard(card.id);
                          }
                        }}
                      />
                    ))}
                  </div>

                  <div className="player">
                    <div className="info">
                      <div className="info-1">
                        {currentTurnIdOfGame === player1.id ? (
                          <CountdownTimer
                            time={30}
                            start={currentTurnIdOfGame === player1.id}
                            timeup={() => this.handleTimeUpPlayer()}
                          />
                        ) : null}
                        <div
                          className={`${
                            currentTurnIdOfGame === player1.id
                              ? 'active-turn'
                              : 'not-active-turn'
                          }`}
                        >
                          <img
                            className={`avatar`}
                            src={player1.avatar}
                            alt=""
                          />
                        </div>
                        <div className="name">{player1.name}</div>
                      </div>
                      <div className="item-box">
                        {player1.nftList.map((item) => (
                          <React.Fragment>
                            {item.name ? (
                              <Tooltip key={item.id} title={item.name}>
                                <img
                                  onClick={() => {
                                    if (
                                      isClickNFT === false &&
                                      permissionTurn
                                    ) {
                                      this.clickUseNFT(player1, item);
                                    }
                                  }}
                                  src={item.image}
                                  className={`power ${
                                    item.isUse ? 'power-use' : ''
                                  } ${
                                    item.id === idNFTTemp ? 'power-click' : ''
                                  }`}
                                  alt=""
                                />
                              </Tooltip>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="hp">
                      {new Array(player1.hp).fill(0).map((i, key) => (
                        <div key={key} className="hp-item"></div>
                      ))}
                      {100 - player1.hp > 0
                        ? new Array(100 - player1.hp)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="mana">
                      {new Array(player1.mana).fill(0).map((i, key) => (
                        <div key={key} className="mana-item"></div>
                      ))}
                      {100 - player1.mana > 0
                        ? new Array(100 - player1.mana)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="shield">
                      {new Array(player1.shield).fill(0).map((i, key) => (
                        <div key={key} className="shield-item"></div>
                      ))}
                      {100 - player1.shield > 0
                        ? new Array(100 - player1.shield)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {meetingLogsDetailSelector &&
            meetingLogsDetailSelector.userList.length == 3 ? (
              <div className="box-3game">
                <div className="player-left">
                  <div className="player">
                    <div className="info">
                      <div className="info-1">
                        {currentTurnIdOfGame === player3.id ? (
                          <CountdownTimer
                            time={30}
                            start={currentTurnIdOfGame === player3.id}
                            timeup={() => null}
                          />
                        ) : null}
                        <div
                          className={`${
                            currentTurnIdOfGame === player3.id
                              ? 'active-turn'
                              : 'not-active-turn'
                          }`}
                        >
                          <img
                            className={`avatar`}
                            src={player3.avatar}
                            alt=""
                          />
                        </div>
                        <div className="name">{player3.name}</div>
                      </div>
                      <div className="item-box">
                        {player3.nftList.map((item) => (
                          <React.Fragment>
                            {item.name ? (
                              <Tooltip key={item.id} title={item.name}>
                                <img
                                  src={item.image}
                                  className={`power ${
                                    item.isUse ? 'power-use' : ''
                                  }`}
                                  alt=""
                                />
                              </Tooltip>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="hp">
                      {new Array(player3.hp).fill(0).map((i, key) => (
                        <div key={key} className="hp-item"></div>
                      ))}
                      {100 - player3.hp > 0
                        ? new Array(100 - player3.hp)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="mana">
                      {new Array(player3.mana).fill(0).map((i, key) => (
                        <div key={key} className="mana-item"></div>
                      ))}
                      {100 - player3.mana > 0
                        ? new Array(100 - player3.mana)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="shield">
                      {new Array(player3.shield).fill(0).map((i, key) => (
                        <div key={key} className="shield-item"></div>
                      ))}
                      {100 - player3.shield > 0
                        ? new Array(100 - player3.shield)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    transform: 'scale(0.6)',
                    transformOrigin: 'top',
                    left: '0%',
                    top: '0%',
                    display: 'flex',
                    gap: 5,
                    flexWrap: 'wrap',
                    paddingTop: 50,
                  }}
                >
                  <div>
                    <div className="player" style={{ height: 150 }}>
                      <div className="info">
                        <div className="info-1"></div>
                        <div className="item-box"></div>
                      </div>
                    </div>

                    <div className="card">
                      {meetingLogsDetailSelector.gamePlay.cardList.map(
                        (card) => (
                          <img
                            src={card.choose ? card.image : card.deck}
                            alt=""
                            key={card.id}
                            style={{ width: 60, zIndex: 10, cursor: 'pointer' }}
                            onClick={() => {
                              if (
                                isClickCard === false &&
                                permissionTurn === true
                              ) {
                                this.clickCard(card.id);
                              }
                            }}
                          />
                        ),
                      )}
                    </div>

                    <div className="player">
                      <div className="info">
                        <div className="info-1">
                          {currentTurnIdOfGame === player1.id ? (
                            <CountdownTimer
                              time={30}
                              start={currentTurnIdOfGame === player1.id}
                              timeup={() => this.handleTimeUpPlayer()}
                            />
                          ) : null}
                          <div
                            className={`${
                              currentTurnIdOfGame === player1.id
                                ? 'active-turn'
                                : 'not-active-turn'
                            }`}
                          >
                            <img
                              className={`avatar`}
                              src={player1.avatar}
                              alt=""
                            />
                          </div>
                          <div className="name">{player1.name}</div>
                        </div>
                        <div className="item-box">
                          {player1.nftList.map((item) => (
                            <React.Fragment>
                              {item.name ? (
                                <Tooltip key={item.id} title={item.name}>
                                  <img
                                    src={item.image}
                                    onClick={() => {
                                      if (
                                        isClickNFT === false &&
                                        permissionTurn
                                      ) {
                                        this.clickUseNFT(player1, item);
                                      }
                                    }}
                                    className={`power ${
                                      item.isUse ? 'power-use' : ''
                                    }`}
                                    alt=""
                                  />
                                </Tooltip>
                              ) : null}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div className="hp">
                        {new Array(player1.hp).fill(0).map((i, key) => (
                          <div key={key} className="hp-item"></div>
                        ))}
                        {100 - player1.hp > 0
                          ? new Array(100 - player1.hp)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                      <div className="mana">
                        {new Array(player1.mana).fill(0).map((i, key) => (
                          <div key={key} className="mana-item"></div>
                        ))}
                        {100 - player1.mana > 0
                          ? new Array(100 - player1.mana)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                      <div className="shield">
                        {new Array(player1.shield).fill(0).map((i, key) => (
                          <div key={key} className="shield-item"></div>
                        ))}
                        {100 - player1.shield > 0
                          ? new Array(100 - player1.shield)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="player-right">
                  <div className="player">
                    <div className="info">
                      <div className="info-1">
                        {currentTurnIdOfGame === player2.id ? (
                          <CountdownTimer
                            time={30}
                            start={currentTurnIdOfGame === player2.id}
                            timeup={() => null}
                          />
                        ) : null}
                        <div
                          className={`${
                            currentTurnIdOfGame === player2.id
                              ? 'active-turn'
                              : 'not-active-turn'
                          }`}
                        >
                          <img
                            className={`avatar`}
                            src={player2.avatar}
                            alt=""
                          />
                        </div>
                        <div className="name">{player2.name}</div>
                      </div>
                      <div className="item-box">
                        {player2.nftList.map((item) => (
                          <React.Fragment>
                            {item.name ? (
                              <Tooltip key={item.id} title={item.name}>
                                <img
                                  src={item.image}
                                  className={`power ${
                                    item.isUse ? 'power-use' : ''
                                  }`}
                                  alt=""
                                />
                              </Tooltip>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="hp">
                      {new Array(player2.hp).fill(0).map((i, key) => (
                        <div key={key} className="hp-item"></div>
                      ))}
                      {100 - player2.hp > 0
                        ? new Array(100 - player2.hp)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="mana">
                      {new Array(player2.mana).fill(0).map((i, key) => (
                        <div key={key} className="mana-item"></div>
                      ))}
                      {100 - player2.mana > 0
                        ? new Array(100 - player2.mana)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="shield">
                      {new Array(player2.shield).fill(0).map((i, key) => (
                        <div key={key} className="shield-item"></div>
                      ))}
                      {100 - player2.shield > 0
                        ? new Array(100 - player2.shield)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {meetingLogsDetailSelector &&
            meetingLogsDetailSelector.userList.length == 4 ? (
              <div className="box-3game">
                <div className="player-left">
                  <div className="player">
                    <div className="info">
                      <div className="info-1">
                        {currentTurnIdOfGame === player4.id ? (
                          <CountdownTimer
                            time={30}
                            start={currentTurnIdOfGame === player4.id}
                            timeup={() => null}
                          />
                        ) : null}
                        <div
                          className={`${
                            currentTurnIdOfGame === player4.id
                              ? 'active-turn'
                              : 'not-active-turn'
                          }`}
                        >
                          <img
                            className={`avatar`}
                            src={player4.avatar}
                            alt=""
                          />
                        </div>
                        <div className="name">{player4.name}</div>
                      </div>
                      <div className="item-box">
                        {player4.nftList.map((item) => (
                          <React.Fragment>
                            {item.name ? (
                              <Tooltip key={item.id} title={item.name}>
                                <img
                                  src={item.image}
                                  className={`power ${
                                    item.isUse ? 'power-use' : ''
                                  }`}
                                  alt=""
                                />
                              </Tooltip>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="hp">
                      {new Array(player4.hp).fill(0).map((i, key) => (
                        <div key={key} className="hp-item"></div>
                      ))}
                      {100 - player4.hp > 0
                        ? new Array(100 - player4.hp)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="mana">
                      {new Array(player4.mana).fill(0).map((i, key) => (
                        <div key={key} className="mana-item"></div>
                      ))}
                      {100 - player4.mana > 0
                        ? new Array(100 - player4.mana)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="shield">
                      {new Array(player4.shield).fill(0).map((i, key) => (
                        <div key={key} className="shield-item"></div>
                      ))}
                      {100 - player4.shield > 0
                        ? new Array(100 - player4.shield)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    transform: 'scale(0.6)',
                    transformOrigin: 'top',
                    left: '0%',
                    top: '0%',
                    display: 'flex',
                    gap: 5,
                    flexWrap: 'wrap',
                    paddingTop: 50,
                  }}
                >
                  <div>
                    <div className="player">
                      <div className="info">
                        <div className="info-1">
                          {currentTurnIdOfGame === player3.id ? (
                            <CountdownTimer
                              time={30}
                              start={currentTurnIdOfGame === player3.id}
                              timeup={() => null}
                            />
                          ) : null}
                          <div
                            className={`${
                              currentTurnIdOfGame === player3.id
                                ? 'active-turn'
                                : 'not-active-turn'
                            }`}
                          >
                            <img
                              className={`avatar`}
                              src={player3.avatar}
                              alt=""
                            />
                          </div>
                          <div className="name">{player3.name}</div>
                        </div>
                        <div className="item-box">
                          {player3.nftList.map((item) => (
                            <React.Fragment>
                              {item.name ? (
                                <Tooltip key={item.id} title={item.name}>
                                  <img
                                    src={item.image}
                                    className={`power ${
                                      item.isUse ? 'power-use' : ''
                                    }`}
                                    alt=""
                                  />
                                </Tooltip>
                              ) : null}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div className="hp">
                        {new Array(player3.hp).fill(0).map((i, key) => (
                          <div key={key} className="hp-item"></div>
                        ))}
                        {100 - player3.hp > 0
                          ? new Array(100 - player3.hp)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                      <div className="mana">
                        {new Array(player3.mana).fill(0).map((i, key) => (
                          <div key={key} className="mana-item"></div>
                        ))}
                        {100 - player3.mana > 0
                          ? new Array(100 - player3.mana)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                      <div className="shield">
                        {new Array(player3.shield).fill(0).map((i, key) => (
                          <div key={key} className="shield-item"></div>
                        ))}
                        {100 - player3.shield > 0
                          ? new Array(100 - player3.shield)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                    </div>

                    <div className="card">
                      {meetingLogsDetailSelector.gamePlay.cardList.map(
                        (card) => (
                          <img
                            src={card.choose ? card.image : card.deck}
                            alt=""
                            key={card.id}
                            style={{ width: 60, zIndex: 10, cursor: 'pointer' }}
                            onClick={() => {
                              if (
                                isClickCard === false &&
                                permissionTurn === true
                              ) {
                                this.clickCard(card.id);
                              }
                            }}
                          />
                        ),
                      )}
                    </div>

                    <div className="player">
                      <div className="info">
                        <div className="info-1">
                          {currentTurnIdOfGame === player1.id ? (
                            <CountdownTimer
                              time={30}
                              start={currentTurnIdOfGame === player1.id}
                              timeup={() => this.handleTimeUpPlayer()}
                            />
                          ) : null}
                          <div
                            className={`${
                              currentTurnIdOfGame === player1.id
                                ? 'active-turn'
                                : 'not-active-turn'
                            }`}
                          >
                            <img
                              className={`avatar`}
                              src={player1.avatar}
                              alt=""
                            />
                          </div>
                          <div className="name">{player1.name}</div>
                        </div>
                        <div className="item-box">
                          {player1.nftList.map((item) => (
                            <React.Fragment>
                              {item.name ? (
                                <Tooltip key={item.id} title={item.name}>
                                  <img
                                    onClick={() => {
                                      if (
                                        isClickNFT === false &&
                                        permissionTurn
                                      ) {
                                        this.clickUseNFT(player1, item);
                                      }
                                    }}
                                    src={item.image}
                                    className={`power ${
                                      item.isUse ? 'power-use' : ''
                                    }`}
                                    alt=""
                                  />
                                </Tooltip>
                              ) : null}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div className="hp">
                        {new Array(player1.hp).fill(0).map((i, key) => (
                          <div key={key} className="hp-item"></div>
                        ))}
                        {100 - player1.hp > 0
                          ? new Array(100 - player1.hp)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                      <div className="mana">
                        {new Array(player1.mana).fill(0).map((i, key) => (
                          <div key={key} className="mana-item"></div>
                        ))}
                        {100 - player1.mana > 0
                          ? new Array(100 - player1.mana)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                      <div className="shield">
                        {new Array(player1.shield).fill(0).map((i, key) => (
                          <div key={key} className="shield-item"></div>
                        ))}
                        {100 - player1.shield > 0
                          ? new Array(100 - player1.shield)
                              .fill(0)
                              .map((i, key) => (
                                <div key={key} className="hp-item-blank"></div>
                              ))
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="player-right">
                  <div className="player">
                    <div className="info">
                      <div className="info-1">
                        {currentTurnIdOfGame === player2.id ? (
                          <CountdownTimer
                            time={30}
                            start={currentTurnIdOfGame === player2.id}
                            timeup={() => null}
                          />
                        ) : null}
                        <div
                          className={`${
                            currentTurnIdOfGame === player2.id
                              ? 'active-turn'
                              : 'not-active-turn'
                          }`}
                        >
                          <img
                            className={`avatar`}
                            src={player2.avatar}
                            alt=""
                          />
                        </div>
                        <div className="name">{player2.name}</div>
                      </div>
                      <div className="item-box">
                        {player2.nftList.map((item) => (
                          <React.Fragment>
                            {item.name ? (
                              <Tooltip key={item.id} title={item.name}>
                                <img
                                  src={item.image}
                                  className={`power ${
                                    item.isUse ? 'power-use' : ''
                                  }`}
                                  alt=""
                                />
                              </Tooltip>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="hp">
                      {new Array(player2.hp).fill(0).map((i, key) => (
                        <div key={key} className="hp-item"></div>
                      ))}
                      {100 - player2.hp > 0
                        ? new Array(100 - player2.hp)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="mana">
                      {new Array(player2.mana).fill(0).map((i, key) => (
                        <div key={key} className="mana-item"></div>
                      ))}
                      {100 - player2.mana > 0
                        ? new Array(100 - player2.mana)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                    <div className="shield">
                      {new Array(player2.shield).fill(0).map((i, key) => (
                        <div key={key} className="shield-item"></div>
                      ))}
                      {100 - player2.shield > 0
                        ? new Array(100 - player2.shield)
                            .fill(0)
                            .map((i, key) => (
                              <div key={key} className="hp-item-blank"></div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <React.Fragment>
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
              {checkOwnerRoom ? (
                <Button
                  variant="contained"
                  onClick={() => this.pushStartFirst()}
                  // disabled={currentPeople.value === totalPeople.value ? false : true}
                  color="white"
                  style={{ background: '#00B5AD', color: 'white' }}
                >
                  Start
                </Button>
              ) : null}
            </div>
          </React.Fragment>
        )}

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
  onGetMeetingLogsById: PropTypes.func,

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

    // meeting logs
    onGetMeetingLogsById: (id) => dispatch(getMeetingLogsById(id)),
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
  meetingLogsDetailSelector: getMeetingLogsDetailSelector(),
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

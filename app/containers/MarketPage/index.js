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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  getUserData,
  updateBalance,
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
import {
  buyNftSuccess,
  canNotBuyNftOfYourSelf,
} from '../../utils/translation.js';
import { ethers } from 'ethers';
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
    marketIdSelected: [],
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
  };

  async componentDidMount() {
    this.getDataMarketTable([], [], null);
    // this.props.getMarketInit();
    this.props.onGetUserData();

    const provider = new ethers.providers.JsonRpcProvider(
      window.env.REACT_APP_BSC_TESTNET_URL,
    );
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    this.setState({ provider, account: accounts[0] });
  }

  transferBNB = async (nftApi, userList) => {
    const recipient = userList.find((i) => i.id === nftApi.userId);

    if (!nftApi.price || isNaN(nftApi.price) || parseFloat(nftApi.price) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!ethers.utils.isAddress(recipient.walletAddress)) {
      toast.error('Please enter a valid recipient address');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient.walletAddress,
        value: ethers.utils.parseEther(nftApi.price.toString()),
      });

      toast.success(buyNftSuccess(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return true;
    } catch (error) {
      console.error('Error transferring BNB:', error);
      toast.error(`Failed to transfer BNB: ${error.message}`);
      return false;
    }
  };

  getDataMarketTable(departmentIds, status, search) {
    this.props.onGetMarketData(departmentIds, status, search);
  }

  deleteMultiesMarket = () => {
    const { marketIdSelected } = this.state;
    this.props.onDeleteMultiesMarket(marketIdSelected);
  };

  rowsSelected = (ids) => this.setState({ marketIdSelected: ids });
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

      this.closeModalBuy();
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
    const cloneSortColumn = API_COLUMNS.MARKETS.indexOf(value);
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

  handleBuy = (item) => {
    this.props.onInitIndexMarket(item.id);
    this.setState({
      itemSellSelected: item,
      openModalSell: true,
    });
  };
  closeModalBuy = () => {
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

  buyItemNft = async () => {
    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(this.props.marketDataModified.toJS());

    console.log(nftApi, localstoreUtilites.getUserIdFromLocalStorage());
    if (
      Number(nftApi.userId) ===
      Number(localstoreUtilites.getUserIdFromLocalStorage())
    ) {
      toast.error(canNotBuyNftOfYourSelf(), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      const transfer = await this.transferBNB(
        nftApi,
        this.props.userListDataSelector,
      );

      if (transfer) {
        const oldNFTUserId = nftApi.userId;
        nftApi.status = 0;
        nftApi.userId = localstoreUtilites.getUserIdFromLocalStorage();
        onUpdateMarket(itemSellSelected.id, nftApi);

        const balanceBuyer = await this.state.provider.getBalance(
          this.state.account,
        );
        this.props.onUpdateBalance(
          Number(localstoreUtilites.getUserIdFromLocalStorage()),
          Number(ethers.utils.formatEther(balanceBuyer)) - Number(nftApi.price),
        );
      

        // update balance seller
        const recipient = this.props.userListDataSelector.find(
          (i) => i.id === oldNFTUserId,
        );
        const balanceSeller = await this.state.provider.getBalance(
          recipient.walletAddress,
        );
        this.props.onUpdateBalance(
          recipient.id,
          Number(ethers.utils.formatEther(balanceSeller)) +
            Number(nftApi.price),
        );
       
      }
    }
  };
  cancelSellItemNft = async (item) => {
    await this.props.onInitIndexMarket(item.id);

    const { itemSellSelected } = this.state;
    const { onUpdateMarket } = this.props;

    const nftApi = mapModelMarketUiToApi(this.props.marketDataModified.toJS());

    nftApi.status = 0;
    onUpdateMarket(item.id, nftApi);
  };

  render() {
    const {
      marketIdSelected,
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
      marketDataModified,
      history,
      storeList,
      classes,
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
    } = marketDataModified.toJS();

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
              onClick={() => this.closeModalBuy()}
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
              disabled
              label={<FormattedMessage {...messages.price} />}
            />
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() => this.buyItemNft()}
                style={{
                  background: '#00B5AD',
                  color: 'white',
                  fontWeight: 'bold',
                  margin: 20,
                }}
              >
                <FormattedMessage {...messages.buy}></FormattedMessage>
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
          <FormattedMessage {...messages.market} />
        </Typography>

        <div className="room-game-list">
          <Grid container className={classes.couponList} spacing={16}>
            {datas.map((item, key) => (
              <Card
                key={key}
                style={{ width: 200, height: 275, margin: '0 auto' }}
                className={classes.cardCoupon}
              >
                <CardContent
                  style={{
                    padding: 0,
                    background: 'white',
                    borderRadius: '5px',
                  }}
                >
                  <Grid
                    item
                    container
                    // justify="center"
                    // alignItems="center"
                    direction="column"
                    className={classes.couponItem}
                  >
                    <label htmlFor="" style={{ width: 200, height: 200 }}>
                      <a href={null} style={{ cursor: 'pointer' }}>
                        <img
                          src={
                            item.image
                              ? item.image
                              : 'https://via.placeholder.com/200x200'
                          }
                          alt="User_photo"
                          width="200"
                          height="200"
                          style={{
                            borderTopLeftRadius: '5px',
                            borderTopRightRadius: '5px',
                          }}
                        />
                      </a>
                    </label>
                    <Grid
                      style={{
                        padding: '10px 10px 10px 10px',
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: 'normal',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: 190,
                          fontWeight: 'bold',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: 'normal',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: 190,
                          fontWeight: 'bold',
                        }}
                        className="numberExpiredDate"
                      >
                        <React.Fragment>
                          <FormattedMessage {...messages.mana} />: {item.mana},{' '}
                          <FormattedMessage {...messages.price} />: {item.price}
                        </React.Fragment>
                      </Typography>

                      <div style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => this.handleBuy(item)}
                          style={{
                            background: '#00B5AD',
                            color: 'white',
                            fontWeight: 'bold',
                            marginRight: 10,
                            marginTop: 5,
                          }}
                        >
                          <FormattedMessage
                            {...messages.buy}
                          ></FormattedMessage>
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
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
  onGetUserData: PropTypes.func,

  loading: PropTypes.bool,
  history: PropTypes.object,
  userListDataSelector: PropTypes.array,
  onUpdateBalance: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    // onClearFilter: () => dispatch(clearFilter()),
    // modified Market
    onUpdateMarket: (id, market) => dispatch(putMarketUpdate(id, market)),
    onAddMarket: (market) => dispatch(postMarketAdd(market)),
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

    onGetUserData: () => dispatch(getUserData()),

    onUpdateBalance: (userId, balance) =>
      dispatch(updateBalance(userId, balance)),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getMarketDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingMarket(),
  loading: makeSelectLoading(),
  storeList: getstoreListData(),
  marketDataModified: getMarketDataModified(),
  userListDataSelector: getUserListData(),
});

const withReducer = injectReducer({ key: 'market', reducer });
const withSaga = injectSaga({
  key: 'market',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(MarketInformationPage));

/* eslint-disable jsx-a11y/alt-text */
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Fab,
  Grid,
  Hidden,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import SearchUI from '../../components/SearchUI/index.js';
import EnhancedTable from 'components/Datatables';
import InputUI from 'components/InputUI';
import MultiSelectUI from 'components/MultiSelectUI/MultiSelect';
import SelectUI from 'components/SelectUI';
import { makeSelectError, makeSelectLoading } from 'containers/App/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { API_COLUMNS } from '../../utils/constants.js';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { styles } from './styles';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {
  Add,
  Apps,
  Close,
  ConfirmationNumber,
  Delete,
  NoteAddOutlined,
  Settings,
  ViewHeadline,
} from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { makeTableHeader } from '../App/appUtilities.js';
import CouponModifiedUi from './CouponModifiedUi.js';
import {
  changePageNumberCoupon,
  changePageSizeCoupon,
  changeTextField,
  deleteCoupon,
  deleteMultiesCoupon,
  getCouponData,
  getCouponInit,
  getInitIndexCoupon,
  getInitIndexSetting,
  getSettingCouponInit,
  getSortCouponList,
  getSortDirectionCouponList,
  postCouponAdd,
  putCouponUpdate,
  putSettingUpdate,
} from './actions';
import { mapModelSettingUiToApi } from './functions.js';
import messages from './messages.js';
import {
  getAjaxInfo,
  getCouponDataModified,
  getCouponDataSelector,
  getCouponList,
  getExpiredTypeCoupon,
  getMetaPagingCoupon,
  getRefundTypeCoupon,
  getSettingDataModified,
} from './selectors';
import { convertShowDateTime } from '../../utils/utils.js';
const localUsername = localstoreUtilites.getUsernameFromLocalStorage();

export const headers = [
  {
    id: 'image',
    label: <FormattedMessage {...messages.image} />,
  },
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
  },
  {
    id: 'isRefund',
    label: <FormattedMessage {...messages.isRefund} />,
  },
  {
    id: 'expiredDateType',
    label: <FormattedMessage {...messages.expiredDateType} />,
  },
  {
    id: 'issuedQuantity',
    label: <FormattedMessage {...messages.issuedQuantity} />,
  },
  {
    id: 'usedQuantity',
    label: <FormattedMessage {...messages.usedQuantity} />,
  },
  {
    id: 'expiredQuantity',
    label: <FormattedMessage {...messages.expiredQuantity} />,
  },
  {
    id: 'numberDateExpired',
    label: <FormattedMessage {...messages.numberDateExpired} />,
  },
  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: '##',
    width: '60px',
  },
];

export class ItemNftPage extends React.Component {
  state = {
    showDialog: false,
    showDialogDelete: false,
    itemDelete: null,
    tabSelected: 0,
    couponIdSelected: null,
    openModal: false,
    tabShowCoupon: 0,
    title: '',
  };

  componentDidMount() {
    this.props.getSettingCouponInit();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      this.props.enqueueSnackbar(ajaxSuccess.message, {
        variant: 'success',
      });
    }
  }

  onChangeTab = (event, value) => {
    this.setState({ tabSelected: value });
  };

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  addCoupon = () => {
    this.props.onInitIndexCoupon(null);
    this.setState({ openModal: true, couponIdSelected: null });
  };

  editCoupon = (id) => {
    this.props.onInitIndexCoupon(id);
    this.setState({ openModal: true, couponIdSelected: id });
  };

  handleChangeCoupon = (evt, name) => {
    const {
      memberLevel,
      visitCoupon,
      welcomeCoupon,
      birthdayCoupon,
    } = this.props.modelData.toJS();
    switch (name) {
      case 'welcomeCoupon': {
        const welCome = {
          ...welcomeCoupon.value,
          couponId: evt.target.value,
        };

        this.props.onChangeTextField('welcomeCoupon', welCome);
        break;
      }
      case 'visitCoupon': {
        const visit = {
          ...visitCoupon.value,
          couponId: evt.target.value,
        };

        this.props.onChangeTextField('visitCoupon', visit);
        break;
      }
      case 'memberLevel': {
        const member = {
          ...memberLevel.value,
          couponId: evt.target.value,
        };

        this.props.onChangeTextField('memberLevel', member);
        break;
      }
      case 'birthdayCoupon': {
        const birthday = {
          ...birthdayCoupon.value,
          couponId: evt.target.value,
        };

        this.props.onChangeTextField('birthdayCoupon', birthday);
        break;
      }

      default:
        break;
    }
  };
  handleChangeInput = (evt, name) => {
    const {
      memberLevel,
      visitCoupon,
      welcomeCoupon,
    } = this.props.modelData.toJS();

    if (name === 'visitCoupon') {
      const visit = {
        ...visitCoupon.value,
        visitedTime: Number(evt.target.value),
      };

      this.props.onChangeTextField('visitCoupon', visit);
    }
    if (name === 'memberLevel') {
      const member = {
        ...memberLevel.value,
        point: Number(evt.target.value),
      };

      this.props.onChangeTextField('memberLevel', member);
    }
  };

  onSaveSetting = () => {
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

  onDeleteCouponModal = (id) => {
    this.setState({
      showDialogDelete: true,
      itemDelete: id,
    });
    return true;
  };

  onCloseDialogDelete = () => {
    this.setState({
      showDialogDelete: false,
    });
  };

  onActionAgreeConfirm = () => {
    // update or add with condition match.params.memberId
    const settingApi = mapModelSettingUiToApi(this.props.modelData.toJS());
    this.props.onUpdateSetting(settingApi);

    return true;
  };

  onDeleteCoupon = (id) => {
    this.props.onDeleteCoupon(id);
  };
  onActionConfirmDelete = () => {
    this.onDeleteCoupon(this.state.itemDelete);
  };

  getTitleModal = () => {
    const { couponIdSelected } = this.state;
    return couponIdSelected ? (
      <FormattedMessage {...messages.editTitleModal} />
    ) : (
      <FormattedMessage {...messages.addTitleModal} />
    );
  };

  // tab coupon
  handleChangeTabCoupon = (event, value) => {
    this.setState({ tabShowCoupon: value });
    if (value == 1) {
      this.props.onGetCouponData(this.state.title);
    }
    if (value == 0) {
      this.props.getSettingCouponInit();
    }
  };
  getDataCouponTable(title) {
    this.props.onGetCouponData(title);
  }

  deleteMultiesCoupon = () => {
    const { couponIdSelected } = this.state;
    this.props.onDeleteMultiesCoupon(couponIdSelected);
  };

  rowsSelectedCoupon = (ids) => this.setState({ couponIdSelected: ids });
  deleteRowCoupon = (id) => this.props.onDeleteCoupon(id);

  changePageNumberCoupon = (pageNumber) =>
    this.props.onChangePageNumberCoupon(pageNumber);
  changePageSizeCoupon = (pageSize) =>
    this.props.onChangePageSizeCoupon(pageSize);
  pagingRemoteCoupon = () => this.props.onGetCouponData(this.state.title);

  getSortColumnCoupon = (sortColumn, value) => {
    const cloneSortColumn = API_COLUMNS.COUPONS.indexOf(value);
    this.props.onGetSortColumnCoupon(sortColumn, cloneSortColumn);
  };

  getSortDirectionCoupon = () => {
    this.props.onGetSortDirectionCoupon();
  };
  changeTitle = (name, value) => {
    this.setState({
      title: value,
    });
    this.props.onGetCouponData(value);
  };

  handleDataCoupon = (
    dataCoupon,
    expiredTypeCouponSelector,
    refundTypeCouponSelector,
  ) => {
    dataCoupon.map((item) => {
      if (item.expiredDateType === 1) {
        if (item.expiredDateOption) {
          item.numberDateExpired = convertShowDateTime(item.expiredDateOption);
        }
      }
      expiredTypeCouponSelector.map((ept) => {
        if (item.expiredDateType === ept.id) {
          item.expiredDateType = ept.name;
        }
      });
      refundTypeCouponSelector.map((rf) => {
        if (item.isRefund === rf.id) {
          item.isRefund = rf.name;
        }
      });
    });
    return dataCoupon;
  };

  render() {
    const {
      showDialog,
      showDialogDelete,
      tabSelected,
      openModal,
      couponIdSelected,
      tabShowCoupon,
    } = this.state;
    const {
      onChangeTextField,

      modelData,
      classes,
      couponList,
      couponDataModified,
      onAddCoupon,
      onUpdateCoupon,
      loading,
      expiredTypeCouponSelector,
      refundTypeCouponSelector,

      // table coupon
      metaCoupon,
      dataCoupon,
    } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <CouponModifiedUi
            titleModify={this.getTitleModal()}
            couponDataModified={couponDataModified.toJS()}
            openModal={openModal}
            onCloseModal={this.onCloseModal}
            onChangeTextField={onChangeTextField}
            onAddCoupon={onAddCoupon}
            onUpdateCoupon={onUpdateCoupon}
            isLoading={loading}
            couponIdSelected={couponIdSelected}
            enqueueSnackbar={this.props.enqueueSnackbar}
            couponList={couponList}
            expiredTypeCouponSelector={expiredTypeCouponSelector}
            refundTypeCouponSelector={refundTypeCouponSelector}
          />

          <AlertDialogSlideUI
            onOpen={showDialogDelete}
            messsage={<span />}
            title={
              <span>
                {<FormattedMessage {...messages.confirmDeleteCoupon} />}
              </span>
            }
            onActionAgree={this.onActionConfirmDelete}
            onCloseDialog={this.onCloseDialogDelete}
          />

          {/* <Grid container direction="row" className={classes.heading}>
            <Grid item>
              <Hidden smDown>
                <React.Fragment>
                  <div className={classes.title}>
                    <Typography variant="h6" id="tableTitle">
                      <FormattedMessage {...messages.titleItemNft} />
                    </Typography>
                  </div>
                </React.Fragment>
              </Hidden>
            </Grid>
          </Grid> */}
          <AppBar
            position="static"
            className={classes.appBar}
            style={{ marginBottom: 20 }}
          >
            <Tabs
              value={tabSelected}
              onChange={this.onChangeTab}
              variant="fullWidth"
            >
              <Tab
                fullWidth
                centerRipple
                icon={<ConfirmationNumber />}
                label={
                  <FormattedMessage {...messages.itemSkill}>
                    {(title) => title}
                  </FormattedMessage>
                }
                id="titleMembers"
              />
            </Tabs>
          </AppBar>
          {tabSelected === 0 ? (
            <React.Fragment>
              <Paper>
                {tabShowCoupon === 0 ? (
                  <Grid
                    container
                    className={classes.couponList}
                    spacing={16}
                    style={{ padding: 20, margin: 0 }}
                  >
                    {couponList.map((item, key) => (
                      <Card
                        key={key}
                        style={{ width: 200, height: 275, margin: '0 auto' }}
                        className={classes.cardCoupon}
                      >
                        <IconButton
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            padding: 5,
                          }}
                          onClick={() => this.onDeleteCouponModal(item.id)}
                        >
                          <Close />
                        </IconButton>
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
                            onClick={() => this.editCoupon(item.id)}
                          >
                            <label
                              htmlFor=""
                              style={{ width: 200, height: 200 }}
                            >
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
                                width: 200,
                                margin: '10px 10px 10px 10px',
                              }}
                            >
                              <Typography
                                variant="h6"
                                style={{
                                  fontWeight: 'bold',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: 190,
                                }}
                              ></Typography>
                              <Typography
                                variant="h6"
                                style={{
                                  fontWeight: 'normal',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: 190,
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
                                }}
                                className="numberExpiredDate"
                              >
                                <React.Fragment>
                                  <FormattedMessage {...messages.mana} />:{' '}
                                  {item.mana}
                                </React.Fragment>
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                    <Grid
                      alignItems="center"
                      justify="center"
                      container
                      onClick={() => this.addCoupon()}
                      style={{
                        border: '1px solid #B1B1B1',
                        width: 200,
                        height: 200,
                        margin: '0 auto',
                        borderRadius: '5px',
                        marginTop: 8,
                        cursor: 'pointer',
                      }}
                    >
                      <Grid item>
                        <NoteAddOutlined />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
                {tabShowCoupon == 1 ? (
                  <EnhancedTable
                    id="couponList"
                    data={this.handleDataCoupon(
                      dataCoupon,
                      expiredTypeCouponSelector,
                      refundTypeCouponSelector,
                    )}
                    className={classes}
                    headers={headers}
                    onPagingRemote={this.pagingRemoteCoupon}
                    onEditRow={this.editCoupon}
                    onDeleteRow={this.deleteRowCoupon}
                    deleteRowMsg={messages.confirmDelete}
                    spanColum={headers.length + 1}
                    rowsSelected={this.rowsSelectedCoupon}
                    onChangePageNumber={this.changePageNumberCoupon}
                    onChangePageSize={this.changePageSizeCoupon}
                    meta={metaCoupon}
                    localUsername={localUsername}
                    isEditShowModal
                    notViewAction={false}
                    orderHeader={makeTableHeader(headers)}
                    onChangeSortColumn={this.getSortColumnCoupon}
                    onChangeSortDirection={this.getSortDirectionCoupon}
                    isFold
                  >
                    <Grid
                      item
                      container
                      justify="space-between"
                      alignItems="center"
                      style={{ paddingTop: 10 }}
                    >
                      <Grid
                        item
                        md
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="h6">
                          <FormattedMessage {...messages.coupon} />
                        </Typography>
                        <Grid style={{ display: 'flex', alignItems: 'center' }}>
                          <FormattedMessage {...messages.searchBox}>
                            {(searchBox) => (
                              <SearchUI
                                onSearchData={(evt) =>
                                  this.changeTitle(
                                    evt.target.name,
                                    evt.target.value,
                                  )
                                }
                                placeholder={searchBox}
                              />
                            )}
                          </FormattedMessage>
                          <div className={classes.actions} id="toolbarBtn">
                            <Fab
                              color="primary"
                              aria-label="Add"
                              className={classes.buttonToolbar}
                              onClick={this.addCoupon}
                              id="btnAdd"
                            >
                              <Add />
                            </Fab>
                            <Fab
                              color="secondary"
                              aria-label="Delete"
                              className={classes.buttonToolbar}
                              onClick={this.deleteMultiesCoupon}
                              id="btnDelete"
                            >
                              <Delete />
                            </Fab>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </EnhancedTable>
                ) : null}
              </Paper>
            </React.Fragment>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

ItemNftPage.propTypes = {
  classes: PropTypes.object,

  onUpdateSetting: PropTypes.func,

  onInitIndexSetting: PropTypes.func,

  onChangeTextField: PropTypes.func,
  onGetCouponInit: PropTypes.func,
  expiredTypeCouponSelector: PropTypes.array,
  refundTypeCouponSelector: PropTypes.array,
  // table coupon
  onGetCouponData: PropTypes.func,
  metaCoupon: PropTypes.object,
  dataCoupon: PropTypes.array,
  onGetSortColumnCoupon: PropTypes.func,
  onGetSortDirectionCoupon: PropTypes.func,
  onDeleteMultiesCoupon: PropTypes.func,
  onChangePageNumberCoupon: PropTypes.func,
  onChangePageSizeCoupon: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    getSettingCouponInit: () => dispatch(getSettingCouponInit()),
    // modified Setting
    onUpdateSetting: (setting) => dispatch(putSettingUpdate(setting)),

    onInitIndexSetting: () => dispatch(getInitIndexSetting()),

    onChangeTextField: (evt, value) => {
      if (!evt.target) {
        dispatch(changeTextField(evt, value));
      } else {
        dispatch(changeTextField(evt.target.name, evt.target.value));
      }
    },

    onGetCouponInit: () => dispatch(getCouponInit()),
    onInitIndexCoupon: (id) => dispatch(getInitIndexCoupon(id)),
    onUpdateCoupon: (id, coupon) => dispatch(putCouponUpdate(id, coupon)),
    onAddCoupon: (coupon) => dispatch(postCouponAdd(coupon)),
    onDeleteCoupon: (id) => dispatch(deleteCoupon(id)),

    // table coupon
    onGetCouponData: (title) => dispatch(getCouponData(title)),
    onGetSortColumnCoupon: (sortColumn, cloneSortColumn) =>
      dispatch(getSortCouponList(sortColumn, cloneSortColumn)),
    onGetSortDirectionCoupon: () => dispatch(getSortDirectionCouponList()),
    onDeleteMultiesCoupon: (ids) => dispatch(deleteMultiesCoupon(ids)),
    onChangePageNumberCoupon: (pageNumber) =>
      dispatch(changePageNumberCoupon(pageNumber)),
    onChangePageSizeCoupon: (pageSize) =>
      dispatch(changePageSizeCoupon(pageSize)),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  modelData: getSettingDataModified(),
  ajaxInfo: getAjaxInfo(),
  loading: makeSelectLoading(),
  couponList: getCouponList(),
  couponDataModified: getCouponDataModified(),
  expiredTypeCouponSelector: getExpiredTypeCoupon(),
  refundTypeCouponSelector: getRefundTypeCoupon(),
  // table coupon
  metaCoupon: getMetaPagingCoupon(),
  dataCoupon: getCouponDataSelector(),
});

const withReducer = injectReducer({ key: 'itemNft', reducer });
const withSaga = injectSaga({
  key: 'itemNft',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(ItemNftPage));

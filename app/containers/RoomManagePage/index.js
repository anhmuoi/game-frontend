/* eslint-disable jsx-a11y/alt-text */
import { withStyles } from '@material-ui/core';
import EnhancedTable from 'components/Datatables';
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
import RoomManageManagementToolbar from './RoomManageManagementToolbar.js';
import { mainStyle } from './styles.js';

import { FormattedMessage } from 'react-intl';
import { API_COLUMNS } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { makeTableHeader } from '../App/appUtilities.js';
import {
  changePageNumberRoomManage,
  changePageSizeRoomManage,
  changeTextField,
  deleteMultiesRoomManage,
  deleteRoomManage,
  getInitIndexRoomManage,
  getSortDirectionRoomManageList,
  getSortRoomManageList,
  getRoomManageData,
  getRoomManageInit,
  postRoomManageAdd,
  putRoomManageUpdate,
} from './actions.js';
import messages from './messages.js';
import {
  getAjaxInfo,
  getDepartmentsListData,
  getMetaPagingRoomManage,
  getRoomManageDataModified,
  getRoomManageDataSelector,
  getStatusListData,
  getstoreListData,
  getWorkTypesListData,
} from './selectors.js';
import RoomManageModifiedUi from './RoomManageModifiedUi.js';
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

export class RoomManageInformationPage extends React.Component {
  state = {
    roomManageIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],
  };

  componentDidMount() {
    this.getDataRoomManageTable([], [], null);
    // this.props.getRoomManageInit();
  }

  getDataRoomManageTable(departmentIds, status, search) {
    this.props.onGetRoomManageData(departmentIds, status, search);
  }

  deleteMultiesRoomManage = () => {
    const { roomManageIdSelected } = this.state;
    this.props.onDeleteMultiesRoomManage(roomManageIdSelected);
  };

  rowsSelected = (ids) => this.setState({ roomManageIdSelected: ids });
  deleteRow = (id) => this.props.onDeleteRoomManage(id);
  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      search: searchTxt,
    });
    // call props filter RoomManage on table
    this.getDataRoomManageTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      searchTxt,
    );
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () =>
    this.props.onGetRoomManageData(
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

  addRoomManage = () => {
    this.props.onInitIndexRoomManage(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (id) => {
    this.props.onInitIndexRoomManage(id);
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
    const cloneSortColumn = API_COLUMNS.ROOM_MANAGES.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };

  onChangeFilter = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    this.getDataRoomManageTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.search,
    );
  };

  render() {
    const { roomManageIdSelected, openModal, rowsSelectedId } = this.state;
    const {
      onUpdateRoomManage,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddRoomManage,
      roomManageDataModified,
      history,
      storeList,
    } = this.props;

    return (
      <React.Fragment>
        <RoomManageModifiedUi
          titleTable={this.getTitleModal()}
          roomManageDataModified={roomManageDataModified.toJS()}
          rowsSelectedId={rowsSelectedId}
          openModal={openModal}
          onCloseModal={this.onCloseModal}
          onChangeTextField={onChangeTextField}
          onAddRoomManage={onAddRoomManage}
          onUpdateRoomManage={onUpdateRoomManage}
          isLoading={loading}
          storeList={storeList}
        />
        <EnhancedTable
          id="roomManage"
          data={datas}
          headers={headers}
          onPagingRemote={this.pagingRemote}
          onEditRow={this.editRow}
          onDeleteRow={this.deleteRow}
          deleteRowMsg={messages.confirmDelete}
          spanColum={headers.length + 1}
          rowsSelected={this.rowsSelected}
          onChangePageNumber={this.changePageNumber}
          onChangePageSize={this.changePageSize}
          meta={meta}
          localUsername={localUsername}
          isEditShowModal
          notViewAction={false}
          orderHeader={makeTableHeader(headers)}
          onChangeSortColumn={this.getSortColumn}
          onChangeSortDirection={this.getSortDirection}
          // isFold
        >
          <RoomManageManagementToolbar
            onSearchDataTable={this.searchDataTable}
            searchTxt={this.state.search}
            onDeleteMultiesRow={this.deleteMultiesRoomManage}
            isSelectMultiesRow={roomManageIdSelected.length !== 0}
            onAddRoomManage={this.addRoomManage}
            statusFilter={this.state.statusFilter}
            departmentsIdFilter={this.state.departmentsIdFilter}
            onChangeFilter={this.onChangeFilter}
            history={history}
            // onClearFilter={onClearFilter}
          />
        </EnhancedTable>
      </React.Fragment>
    );
  }
}

RoomManageInformationPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onClearFilter: PropTypes.func,

  onUpdateRoomManage: PropTypes.func,
  onAddRoomManage: PropTypes.func,
  onInitIndexRoomManage: PropTypes.func,

  onGetRoomManageData: PropTypes.func,
  getRoomManageInit: PropTypes.func,

  onDeleteRoomManage: PropTypes.func,
  onDeleteMultiesRoomManage: PropTypes.func,
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
    // modified RoomManage
    onUpdateRoomManage: (id, roomManage) =>
      dispatch(putRoomManageUpdate(id, roomManage)),
    onAddRoomManage: (roomManage) => dispatch(postRoomManageAdd(roomManage)),
    onInitIndexRoomManage: (id) => dispatch(getInitIndexRoomManage(id)),
    // RoomManage index
    onGetRoomManageData: (departmentIds, status, search) =>
      dispatch(getRoomManageData(departmentIds, status, search)),
    getRoomManageInit: () => dispatch(getRoomManageInit()),
    onDeleteRoomManage: (id) => dispatch(deleteRoomManage(id)),
    onDeleteMultiesRoomManage: (ids) => dispatch(deleteMultiesRoomManage(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberRoomManage(pageNumber)),
    onChangePageSize: (pageSize) =>
      dispatch(changePageSizeRoomManage(pageSize)),
    onChangeTextField: (evt, date) => {
      if (!evt.target) {
        dispatch(changeTextField(evt, date));
      } else {
        dispatch(changeTextField(evt.target.name, evt.target.value));
      }
    },
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortRoomManageList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionRoomManageList()),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getRoomManageDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingRoomManage(),
  loading: makeSelectLoading(),
  storeList: getstoreListData(),
  roomManageDataModified: getRoomManageDataModified(),
});

const withReducer = injectReducer({ key: 'roomManage', reducer });
const withSaga = injectSaga({
  key: 'roomManage',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(RoomManageInformationPage));

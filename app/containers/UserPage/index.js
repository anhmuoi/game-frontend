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
import reducer from './reducer';
import saga from './saga';
import UserManagementToolbar from './UserManagementToolbar';
import { mainStyle } from './styles';

import { FormattedMessage } from 'react-intl';
import { API_COLUMNS } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { makeTableHeader } from '../App/appUtilities';
import {
  changePageNumberUser,
  changePageSizeUser,
  changeTextField,
  deleteMultiesUser,
  deleteUser,
  exportUser,
  getInitIndexUser,
  getSortDirectionUserList,
  getSortUserList,
  getUserData,
  getUserInit,
  importUser,
  postUserAdd,
  putUserUpdate,
} from './actions';
import messages from './messages.js';
import {
  getAjaxInfo,
  getDepartmentsListData,
  getMetaPagingUser,
  getUserDataSelector,
  getStatusListData,
  getRolesListData,
} from './selectors';
const localUsername = localstoreUtilites.getUsernameFromLocalStorage();

export const headers = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
  },

  // {
  //   id: 'departmentId',
  //   label: <FormattedMessage {...messages.departmentId} />,
  // },
  {
    id: 'position',
    label: <FormattedMessage {...messages.position} />,
  },

  {
    id: 'phone',
    label: <FormattedMessage {...messages.phone} />,
  },

  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: '##',
    width: '60px',
  },
];
const permissions = localstoreUtilites.getPermissionsFromLocalStorage().user;

// const localUsername = localstoreUtilites.getUsernameFromLocalStorage();

export class UserInformationPage extends React.Component {
  state = {
    userIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],
  };

  componentDidMount() {
    this.props.getUserInit();
    this.getDataUserTable([], [], null);
  }

  getDataUserTable(departmentIds, status, search) {
    this.props.onGetUserData(departmentIds, status, search);
  }

  deleteMultiesUser = () => {
    const { userIdSelected } = this.state;
    this.props.onDeleteMultiesUser(userIdSelected);
  };

  rowsSelected = (ids) => this.setState({ userIdSelected: ids });
  deleteRow = (id) => this.props.onDeleteUser(id);
  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      search: searchTxt,
    });
    // call props filter User on table
    this.getDataUserTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      searchTxt,
    );
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () =>
    this.props.onGetUserData(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.search,
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

  addUser = () => {
    this.props.onInitIndexUser(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (fragment) => '/user/edit'.concat(fragment);

  viewDetail = (id) => {
    this.props.history.replace(this.editRow(`/${id}`));
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
    const cloneSortColumn = API_COLUMNS.USERS.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };

  onChangeFilter = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    this.getDataUserTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.search,
    );
  };

  onExport = (fileType, text) => {
    this.props.onExport(fileType, text);
  };

  render() {
    const { userIdSelected, openModal, rowsSelectedId } = this.state;
    const {
      onUpdateUser,

      onChangeTextField,

      datas,
      meta,
      loading,
      onExport,
      onImport,
      statusListSelector,
      onAddUser,
      departmentListSelector,
      rolesListSelector,

      history,
    } = this.props;

    if (datas && statusListSelector.length > 0) {
      const tmpStatus = [...statusListSelector];
      const tmpDepartment = [...departmentListSelector];
      datas.map((item) => {
        tmpStatus.map((stt) => {
          if (item.status === stt.id) {
            item.status = stt.name;
          }
        });
        tmpDepartment.map((stt) => {
          if (item.departmentId === stt.id) {
            item.departmentId = stt.name;
          } else if (item.departmentId === 0) {
            item.departmentId = '';
          }
        });
      });
    }

    const {} = this.props;

    return (
      <React.Fragment>
        <EnhancedTable
          id="userList"
          data={datas}
          headers={headers}
          onPagingRemote={this.pagingRemote}
          onEditRow={permissions.editUser ? this.editRow : null}
          onDeleteRow={permissions.deleteUser ? this.deleteRow : null}
          deleteRowMsg={messages.confirmDelete}
          spanColum={headers.length + 1}
          rowsSelected={this.rowsSelected}
          onChangePageNumber={this.changePageNumber}
          onChangePageSize={this.changePageSize}
          meta={meta}
          localUsername={localUsername}
          history={history}
          onViewDetail={this.viewDetail}
          notViewAction={false}
          orderHeader={makeTableHeader(headers)}
          onChangeSortColumn={this.getSortColumn}
          onChangeSortDirection={this.getSortDirection}
          isFold
        >
          <UserManagementToolbar
            onSearchDataTable={this.searchDataTable}
            searchTxt={this.state.search}
            onDeleteMultiesRow={this.deleteMultiesUser}
            isSelectMultiesRow={userIdSelected.length !== 0}
            onAddUser={this.addUser}
            onExport={this.onExport}
            onImport={onImport}
            statusListSelector={[...statusListSelector]}
            departmentListSelector={[...departmentListSelector]}
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

UserInformationPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onExport: PropTypes.func,
  onClearFilter: PropTypes.func,

  onUpdateUser: PropTypes.func,
  onAddUser: PropTypes.func,
  onInitIndexUser: PropTypes.func,

  onGetUserData: PropTypes.func,
  getUserInit: PropTypes.func,

  onDeleteUser: PropTypes.func,
  onDeleteMultiesUser: PropTypes.func,
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
    onExport: (fileType, text) => dispatch(exportUser(fileType, text)),
    onImport: (file, fileType) => dispatch(importUser(file, fileType)),
    // onClearFilter: () => dispatch(clearFilter()),
    // modified User
    onUpdateUser: (id, user) => dispatch(putUserUpdate(id, user)),
    onAddUser: (user) => dispatch(postUserAdd(user)),
    onInitIndexUser: (id) => dispatch(getInitIndexUser(id)),
    // User index
    onGetUserData: (departmentIds, status, search) =>
      dispatch(getUserData(departmentIds, status, search)),
    getUserInit: () => dispatch(getUserInit()),
    onDeleteUser: (id) => dispatch(deleteUser(id)),
    onDeleteMultiesUser: (ids) => dispatch(deleteMultiesUser(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberUser(pageNumber)),
    onChangePageSize: (pageSize) => dispatch(changePageSizeUser(pageSize)),
    onChangeTextField: (evt) =>
      dispatch(changeTextField(evt.target.name, evt.target.value)),
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortUserList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionUserList()),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getUserDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingUser(),
  loading: makeSelectLoading(),
  statusListSelector: getStatusListData(),
  departmentListSelector: getDepartmentsListData(),
  rolesListSelector: getRolesListData(),
});

const withReducer = injectReducer({ key: 'user', reducer });
const withSaga = injectSaga({
  key: 'user',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(UserInformationPage));

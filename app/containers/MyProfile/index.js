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
import MyProfileManagementToolbar from './MyProfileManagementToolbar';
import { mainStyle } from './styles';

import { FormattedMessage } from 'react-intl';
import { API_COLUMNS } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { makeTableHeader } from '../App/appUtilities';
import {
  changePageNumberMyProfile,
  changePageSizeMyProfile,
  changeTextField,
  deleteMultiesMyProfile,
  deleteMyProfile,
  exportMyProfile,
  getInitIndexMyProfile,
  getSortDirectionMyProfileList,
  getSortMyProfileList,
  getMyProfileData,
  getMyProfileInit,
  importMyProfile,
  postMyProfileAdd,
  putMyProfileUpdate,
} from './actions';
import messages from './messages.js';
import {
  getAjaxInfo,
  getDepartmentsListData,
  getMetaPagingMyProfile,
  getMyProfileDataSelector,
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
const permissions = localstoreUtilites.getPermissionsFromLocalStorage()
  .myProfile;

// const localUsername = localstoreUtilites.getUsernameFromLocalStorage();

export class MyProfileInformationPage extends React.Component {
  state = {
    myProfileIdSelected: [],
    search: '',
    openModal: false,
    rowsSelectedId: null,
    statusFilter: [],
    departmentsIdFilter: [],
  };

  componentDidMount() {
    this.props.getMyProfileInit();
    this.getDataMyProfileTable([], [], null);
  }

  getDataMyProfileTable(departmentIds, status, search) {
    this.props.onGetMyProfileData(departmentIds, status, search);
  }

  deleteMultiesMyProfile = () => {
    const { myProfileIdSelected } = this.state;
    this.props.onDeleteMultiesMyProfile(myProfileIdSelected);
  };

  rowsSelected = (ids) => this.setState({ myProfileIdSelected: ids });
  deleteRow = (id) => this.props.onDeleteMyProfile(id);
  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      search: searchTxt,
    });
    // call props filter MyProfile on table
    this.getDataMyProfileTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      searchTxt,
    );
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () =>
    this.props.onGetMyProfileData(
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

  addMyProfile = () => {
    this.props.onInitIndexMyProfile(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (fragment) => '/myProfile/edit'.concat(fragment);

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
    const cloneSortColumn = API_COLUMNS.MY_PROFILES.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };

  onChangeFilter = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    this.getDataMyProfileTable(
      this.state.departmentsIdFilter,
      this.state.statusFilter,
      this.state.search,
    );
  };

  onExport = (fileType, text) => {
    this.props.onExport(fileType, text);
  };

  render() {
    const { myProfileIdSelected, openModal, rowsSelectedId } = this.state;
    const {
      onUpdateMyProfile,

      onChangeTextField,

      datas,
      meta,
      loading,
      onExport,
      onImport,
      statusListSelector,
      onAddMyProfile,
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
          id="myProfileList"
          data={datas}
          headers={headers}
          onPagingRemote={this.pagingRemote}
          onEditRow={permissions.editMyProfile ? this.editRow : null}
          onDeleteRow={permissions.deleteMyProfile ? this.deleteRow : null}
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
          <MyProfileManagementToolbar
            onSearchDataTable={this.searchDataTable}
            searchTxt={this.state.search}
            onDeleteMultiesRow={this.deleteMultiesMyProfile}
            isSelectMultiesRow={myProfileIdSelected.length !== 0}
            onAddMyProfile={this.addMyProfile}
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

MyProfileInformationPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onExport: PropTypes.func,
  onClearFilter: PropTypes.func,

  onUpdateMyProfile: PropTypes.func,
  onAddMyProfile: PropTypes.func,
  onInitIndexMyProfile: PropTypes.func,

  onGetMyProfileData: PropTypes.func,
  getMyProfileInit: PropTypes.func,

  onDeleteMyProfile: PropTypes.func,
  onDeleteMultiesMyProfile: PropTypes.func,
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
    onExport: (fileType, text) => dispatch(exportMyProfile(fileType, text)),
    onImport: (file, fileType) => dispatch(importMyProfile(file, fileType)),
    // onClearFilter: () => dispatch(clearFilter()),
    // modified MyProfile
    onUpdateMyProfile: (id, myProfile) =>
      dispatch(putMyProfileUpdate(id, myProfile)),
    onAddMyProfile: (myProfile) => dispatch(postMyProfileAdd(myProfile)),
    onInitIndexMyProfile: (id) => dispatch(getInitIndexMyProfile(id)),
    // MyProfile index
    onGetMyProfileData: (departmentIds, status, search) =>
      dispatch(getMyProfileData(departmentIds, status, search)),
    getMyProfileInit: () => dispatch(getMyProfileInit()),
    onDeleteMyProfile: (id) => dispatch(deleteMyProfile(id)),
    onDeleteMultiesMyProfile: (ids) => dispatch(deleteMultiesMyProfile(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberMyProfile(pageNumber)),
    onChangePageSize: (pageSize) => dispatch(changePageSizeMyProfile(pageSize)),
    onChangeTextField: (evt) =>
      dispatch(changeTextField(evt.target.name, evt.target.value)),
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortMyProfileList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionMyProfileList()),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getMyProfileDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingMyProfile(),
  loading: makeSelectLoading(),
  statusListSelector: getStatusListData(),
  departmentListSelector: getDepartmentsListData(),
  rolesListSelector: getRolesListData(),
});

const withReducer = injectReducer({ key: 'myProfile', reducer });
const withSaga = injectSaga({
  key: 'myProfile',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(MyProfileInformationPage));

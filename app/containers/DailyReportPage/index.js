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
import DailyReportManagementToolbar from './DailyReportManagementToolbar';
import reducer from './reducer';
import saga from './saga';
import { mainStyle } from './styles';

import { FormattedMessage } from 'react-intl';
import { API_COLUMNS } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { makeTableHeader } from '../App/appUtilities';
import DailyReportModifiedUi from './DailyReportModifiedUi.js';
import {
  changeFilter,
  changePageNumberDailyReport,
  changePageSizeDailyReport,
  changeTextField,
  clearFilter,
  deleteDailyReport,
  deleteMultiesDailyReport,
  getDailyReportData,
  getDailyReportInit,
  getIndexDailyReportByUser,
  getInitIndexDailyReport,
  getSortDailyReportList,
  getSortDirectionDailyReportList,
  postDailyReportAdd,
  putDailyReportUpdate,
} from './actions';
import messages from './messages.js';
import {
  getAjaxInfo,
  getDailyReportDataModified,
  getDailyReportDataSelector,
  getDepartmentListData,
  getFilterSelector,
  getFolderLogListData,
  getMetaPagingDailyReport,
  getReporterListData,
  getUserListData,
} from './selectors';
const localUsername = localstoreUtilites.getUsernameFromLocalStorage();

export const headers = [
  {
    id: 'departmentName',
    label: <FormattedMessage {...messages.department} />,
  },

  {
    id: 'userId',
    label: <FormattedMessage {...messages.author} />,
  },

  {
    id: 'date',
    label: <FormattedMessage {...messages.date} />,
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
const permission = localstoreUtilites.getPermissionsFromLocalStorage()
  .dailyReport;
export class DailyReportInformationPage extends React.Component {
  state = {
    dailyReportIdSelected: [],
    openModal: false,
    rowsSelectedId: null,

    isFold: false,
  };

  componentDidMount() {
    const { filterSelector } = this.props;
    const filter = filterSelector.toJS();
    this.getDataDailyReportTable(
      [localstoreUtilites.getUserIdFromLocalStorage()],
      filter.folderLogsFilter,
      filter.reportersFilter,
      filter.departmentsFilter,
      filter.search,
      filter.startDate,
      filter.endDate,
    );
    this.props.getDailyReportInit();
  }

  getDataDailyReportTable(
    userIds,
    folderLogs,
    reporters,
    departments,
    search,
    startDate,
    endDate,
  ) {
    this.props.onGetDailyReportData(
      userIds,
      folderLogs,
      reporters,
      departments,
      search,
      startDate,
      endDate,
    );
  }

  deleteMultiesDailyReport = () => {
    const { dailyReportIdSelected } = this.state;
    this.props.onDeleteMultiesDailyReport(dailyReportIdSelected);
  };

  rowsSelected = (ids) => {
    permission.editDailyReport ? this.editRow(ids[0]) : null;
    this.setState({ dailyReportIdSelected: ids });
  };
  deleteRow = (id) => this.props.onDeleteDailyReport(id);
  searchDataTable = () => {
    const { filterSelector } = this.props;
    const filter = filterSelector.toJS();
    // call props filter DailyReport on table
    this.getDataDailyReportTable(
      filter.userIdsFilter,
      filter.folderLogsFilter,
      filter.reportersFilter,
      filter.departmentsFilter,
      filter.search,
      filter.startDate,
      filter.endDate,
    );
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () => {
    const { filterSelector } = this.props;
    const filter = filterSelector.toJS();
    // call props filter DailyReport on table
    this.props.onGetDailyReportData(
      filter.userIdsFilter,
      filter.folderLogsFilter,
      filter.reportersFilter,
      filter.departmentsFilter,
      filter.search,
      filter.startDate,
      filter.endDate,
    );
  };

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

  addDailyReport = () => {
    this.props.onInitIndexDailyReport(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (id) => {
    this.props.onInitIndexDailyReport(id);
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
    const cloneSortColumn = API_COLUMNS.DAILY_REPORTS.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };

  onChangeFilter = async (event) => {
    this.props.onchangeFilter({
      ...this.props.filterSelector.toJS(),
      [event.target.name]: event.target.value,
    });
  };
  onClearFilter = async () => {
    await this.props.clearFilter();
    this.getDataDailyReportTable(
      [],
      [],
      [],
      [],
      '',
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(),
    );
  };
  onFoldOption = () => {
    this.setState({
      isFold: !this.state.isFold,
    });
  };

  onChangeDate = (startDate, endDate) => {
    this.props.onchangeFilter({
      ...this.props.filterSelector.toJS(),
      startDate,
      endDate,
    });
  };

  onClear = () => {
    const { onChangeTextField } = this.props;
    onChangeTextField('title', '');
    onChangeTextField('reporterId', null);
    onChangeTextField('content', '');
    onChangeTextField('title', '');
  };

  render() {
    const {
      dailyReportIdSelected,
      openModal,
      rowsSelectedId,
      startDate,
      endDate,
      isFold,
      search,
    } = this.state;
    const {
      onUpdateDailyReport,

      onChangeTextField,

      datas,
      meta,
      loading,
      onAddDailyReport,
      dailyReportDataModified,
      history,
      reporterList,
      folderLogList,
      departmentList,
      userList,
      filterSelector,
      onGetIndexDailyReportByUser,
    } = this.props;

    if (datas) {
      datas.map((item) => {
        folderLogList.map((stt) => {
          if (item.folderLogId === stt.id) {
            item.folderLogId = stt.name;
          }
        });
        userList.map((stt) => {
          if (item.userId === stt.id) {
            item.userId = stt.name;
          }
        });
        reporterList.map((stt) => {
          if (item.reporterId === stt.id) {
            item.reporterId = stt.name;
          }
        });
      });
    }

    return (
      <React.Fragment>
        {/* <DailyReportModifiedUi
          titleTable={this.getTitleModal()}
          dailyReportDataModified={dailyReportDataModified.toJS()}
          rowsSelectedId={rowsSelectedId}
          openModal={openModal}
          onCloseModal={this.onCloseModal}
          onChangeTextField={onChangeTextField}
          onAddDailyReport={onAddDailyReport}
          onUpdateDailyReport={onUpdateDailyReport}
          isLoading={loading}
          reporterList={reporterList}
          userList={userList}
          folderLogList={folderLogList}
        /> */}
        <EnhancedTable
          id="dailyReport"
          data={datas}
          headers={headers}
          onPagingRemote={this.pagingRemote}
          // onEditRow={permission.editDailyReport ? this.editRow : null}
          // onDeleteRow={permission.deleteDailyReport ? this.deleteRow : null}
          deleteRowMsg={messages.confirmDelete}
          spanColum={headers.length + 1}
          rowsSelected={this.rowsSelected}
          checkOnlyOne
          onChangePageNumber={this.changePageNumber}
          onChangePageSize={this.changePageSize}
          meta={meta}
          localUsername={localUsername}
          isEditShowModal
          notViewAction={false}
          orderHeader={makeTableHeader(headers)}
          onChangeSortColumn={this.getSortColumn}
          onChangeSortDirection={this.getSortDirection}
          isNotCheckedRow
          contentEdit={
            <DailyReportModifiedUi
              titleTable={this.getTitleModal()}
              dailyReportDataModified={dailyReportDataModified.toJS()}
              rowsSelectedId={rowsSelectedId}
              openModal={openModal}
              onCloseModal={this.onCloseModal}
              onChangeTextField={onChangeTextField}
              onAddDailyReport={onAddDailyReport}
              onUpdateDailyReport={onUpdateDailyReport}
              isLoading={loading}
              reporterList={reporterList}
              userList={userList}
              folderLogList={folderLogList}
              onClear={this.onClear}
              onGetIndexDailyReportByUser={onGetIndexDailyReportByUser}
            />
          }
          // isFold
        >
          <DailyReportManagementToolbar
            onSearchDataTable={this.searchDataTable}
            onDeleteMultiesRow={this.deleteMultiesDailyReport}
            isSelectMultiesRow={dailyReportIdSelected.length !== 0}
            onAddDailyReport={this.addDailyReport}
            userIdsFilter={filterSelector.toJS().userIdsFilter}
            folderLogsFilter={filterSelector.toJS().folderLogsFilter}
            departmentsFilter={filterSelector.toJS().departmentsFilter}
            reportersFilter={filterSelector.toJS().reportersFilter}
            folderLogList={folderLogList}
            departmentList={departmentList}
            userList={userList}
            reporterList={reporterList}
            onChangeFilter={this.onChangeFilter}
            history={history}
            isFold={isFold}
            onFoldOption={this.onFoldOption}
            startDate={filterSelector.toJS().startDate}
            endDate={filterSelector.toJS().endDate}
            onClearFilter={this.onClearFilter}
            onChangeDate={this.onChangeDate}
            search={filterSelector.toJS().search}
          />
        </EnhancedTable>
      </React.Fragment>
    );
  }
}

DailyReportInformationPage.propTypes = {
  classes: PropTypes.object,
  onClearFilter: PropTypes.func,
  filterSelector: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  datas: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  meta: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  userList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  folderLogList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  departmentList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  reporterList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dailyReportDataModified: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  onUpdateDailyReport: PropTypes.func,
  onAddDailyReport: PropTypes.func,
  onInitIndexDailyReport: PropTypes.func,

  onGetDailyReportData: PropTypes.func,
  getDailyReportInit: PropTypes.func,

  onDeleteDailyReport: PropTypes.func,
  onDeleteMultiesDailyReport: PropTypes.func,
  onChangePageNumber: PropTypes.func,
  onChangePageSize: PropTypes.func,
  onChangeTextField: PropTypes.func,
  onGetSortColumn: PropTypes.func,
  onGetSortDirection: PropTypes.func,
  clearFilter: PropTypes.func,
  onchangeFilter: PropTypes.func,
  onGetIndexDailyReportByUser: PropTypes.func,

  loading: PropTypes.bool,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    // onClearFilter: () => dispatch(clearFilter()),
    // modified DailyReport
    onUpdateDailyReport: (id, dailyReport) =>
      dispatch(putDailyReportUpdate(id, dailyReport)),
    onAddDailyReport: (dailyReport) =>
      dispatch(postDailyReportAdd(dailyReport)),
    onInitIndexDailyReport: (id) => dispatch(getInitIndexDailyReport(id)),
    // DailyReport index
    onGetDailyReportData: (
      userIds,
      folderLogs,
      reporters,
      departments,
      search,
      startDate,
      endDate,
    ) =>
      dispatch(
        getDailyReportData(
          userIds,
          folderLogs,
          reporters,
          departments,
          search,
          startDate,
          endDate,
        ),
      ),
    getDailyReportInit: () => dispatch(getDailyReportInit()),
    onDeleteDailyReport: (id) => dispatch(deleteDailyReport(id)),
    onDeleteMultiesDailyReport: (ids) =>
      dispatch(deleteMultiesDailyReport(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberDailyReport(pageNumber)),
    onChangePageSize: (pageSize) =>
      dispatch(changePageSizeDailyReport(pageSize)),
    onChangeTextField: (evt, date) => {
      if (!evt.target) {
        dispatch(changeTextField(evt, date));
      } else {
        dispatch(changeTextField(evt.target.name, evt.target.value));
      }
    },
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortDailyReportList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionDailyReportList()),
    clearFilter: () => dispatch(clearFilter()),
    onchangeFilter: (filter) => dispatch(changeFilter(filter)),
    onGetIndexDailyReportByUser: (userId, date) =>
      dispatch(getIndexDailyReportByUser(userId, date)),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getDailyReportDataSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingDailyReport(),
  loading: makeSelectLoading(),
  reporterList: getReporterListData(),
  folderLogList: getFolderLogListData(),
  departmentList: getDepartmentListData(),
  userList: getUserListData(),
  dailyReportDataModified: getDailyReportDataModified(),
  filterSelector: getFilterSelector(),
});

const withReducer = injectReducer({ key: 'dailyReport', reducer });
const withSaga = injectSaga({
  key: 'dailyReport',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(mainStyle)(DailyReportInformationPage));

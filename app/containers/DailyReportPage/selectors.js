/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDailyReport = (state) => state.get('dailyReport', initialState);

const getDailyReportDataSelector = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('data'),
  );

const getReporterListData = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('reporterList'),
  );
const getFolderLogListData = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('folderLogList'),
  );
const getDepartmentListData = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('departmentList'),
  );
const getUserListData = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('userList'),
  );

const getDailyReportDataModified = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('dailyReportModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectDailyReport, (userState) => userState.get('isRedirect'));

const getMetaPagingDailyReport = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('metaPaging'),
  );
const getFilterSelector = () =>
  createSelector(selectDailyReport, (dailyReportState) =>
    dailyReportState.get('filter'),
  );

export {
  selectDailyReport,
  getDailyReportDataSelector,
  getDailyReportDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingDailyReport,
  getReporterListData,
  getFolderLogListData,
  getUserListData,
  getDepartmentListData,
  getFilterSelector,
};

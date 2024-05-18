/*
 * DAILY_REPORT Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  GET_DAILY_REPORT_DATA_SUCCESS,
  UPDATE_DAILY_REPORT,
  ADD_DAILY_REPORT,
  INIT_INDEX_DAILY_REPORT,
  INIT_INDEX_DAILY_REPORT_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_DAILY_REPORT_ROW,
  VALIDATE_DAILY_REPORT_ERROR,
  CREATE_DAILY_REPORT_SUCCESS,
  UPDATE_DAILY_REPORT_SUCCESS,
  DELETE_DAILY_REPORT_SUCCESS,
  SET_META_DAILY_REPORT,
  DELETE_MULTIES_DAILY_REPORT,
  DELETE_MULTIES_DAILY_REPORT_SUCCESS,
  CHANGE_PAGE_NUMBER_DAILY_REPORT,
  CHANGE_PAGE_SIZE_DAILY_REPORT,
  GET_SORT_DAILY_REPORT_LIST,
  GET_SORT_DIRECTION_DAILY_REPORT_LIST,
  VALIDATE_DAILY_REPORT,
  SET_STATUS_LIST_DAILY_REPORT,
  FETCH_DAILY_REPORT_INIT,
  FETCH_DAILY_REPORT_DATA,
  SET_GENDER_LIST_DAILY_REPORT,
  SET_DEPARTMENTS_LIST_DAILY_REPORT,
  SET_WORKTYPES_LIST_DAILY_REPORT,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_REPORTER_LIST,
  GET_USER_DATA_SUCCESS,
  SET_FOLDER_LOG_LIST,
  SET_DEPARTMENT_LIST,
  CHANGE_FILTER,
  CLEAR_FILTER,
  GET_INDEX_DAILY_REPORT_BY_USER,
} from './constants';

/**
 * Get DAILY_REPORT data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_DAILY_REPORT_DATA_SUCCESS
 */
export function getDailyReportDataSuccess(data) {
  return {
    type: GET_DAILY_REPORT_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaDailyReport(meta) {
  return {
    type: SET_META_DAILY_REPORT,
    meta,
  };
}

export function setStatusListDailyReport(statusList) {
  return {
    type: SET_STATUS_LIST_DAILY_REPORT,
    statusList,
  };
}
export function setGenderListDailyReport(genderList) {
  return {
    type: SET_GENDER_LIST_DAILY_REPORT,
    genderList,
  };
}
export function setDepartmentsListDailyReport(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_DAILY_REPORT,
    departmentsList,
  };
}
export function setWorkTypesListDailyReport(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_DAILY_REPORT,
    workTypesList,
  };
}
/**
 * @param(DAILY_REPORT): object: contains info DAILY_REPORT for update
 * @param(id) number: DAILY_REPORT id
 */
export function putDailyReportUpdate(id, dailyReport) {
  return {
    type: UPDATE_DAILY_REPORT,
    dailyReport,
    id,
  };
}

/**
 * @param(DAILY_REPORT): object: contains info DAILY_REPORT for add
 */
export function postDailyReportAdd(dailyReport) {
  return {
    type: ADD_DAILY_REPORT,
    dailyReport,
  };
}

/**
 * @param(id): number: id DAILY_REPORT for get data
 */
export function getInitIndexDailyReport(id) {
  return {
    type: INIT_INDEX_DAILY_REPORT,
    id,
  };
}
export function getIndexDailyReportByUser(userId, date) {
  return {
    type: GET_INDEX_DAILY_REPORT_BY_USER,
    userId,
    date,
  };
}

export function setReporterList(reporterList) {
  return {
    type: SET_REPORTER_LIST,
    reporterList,
  };
}

/**
 * @param(DAILY_REPORT) object , init DAILY_REPORT object get from api for add and edit
 */
export function getInitIndexDailyReportSuccess(dailyReportModel) {
  return {
    type: INIT_INDEX_DAILY_REPORT_SUCCESS,
    dailyReportModel,
  };
}

/**
 * @param(name) string : name of field
 * @param(value) string: value of field
 */
export function changeTextField(name, value) {
  return {
    type: CHANGE_TEXT_FIELD,
    name,
    value,
  };
}
export function changeFilter(filter) {
  return {
    type: CHANGE_FILTER,
    filter,
  };
}
export function clearFilter() {
  return {
    type: CLEAR_FILTER,
  };
}

/**
 * @param(id) number: id DAILY_REPORT delete
 */
export function deleteDailyReport(id) {
  return {
    type: DELETE_DAILY_REPORT_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberDailyReport(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_DAILY_REPORT,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeDailyReport(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_DAILY_REPORT,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getDailyReportData(
  userIds,
  folderLogs,
  reporters,
  departments,
  search,
  startDate,
  endDate,
) {
  return {
    type: FETCH_DAILY_REPORT_DATA,
    userIds,
    folderLogs,
    reporters,
    departments,
    search,
    startDate,
    endDate,
  };
}

export function getDailyReportInit() {
  return {
    type: FETCH_DAILY_REPORT_INIT,
  };
}

/**
 * @param(ids) array: ids DAILY_REPORT delete
 */
export function deleteMultiesDailyReport(ids) {
  return {
    type: DELETE_MULTIES_DAILY_REPORT,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_DAILY_REPORT_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createDailyReportSuccess(message) {
  return {
    type: CREATE_DAILY_REPORT_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateDailyReportSuccess(message) {
  return {
    type: UPDATE_DAILY_REPORT_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id DAILY_REPORT is deleted
 */
export function deleteDailyReportSuccess(message, id) {
  return {
    type: DELETE_DAILY_REPORT_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids DAILY_REPORT is deleted
 */
export function deleteMultiesDailyReportSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_DAILY_REPORT_SUCCESS,
    message,
    ids,
  };
}

export function getSortDailyReportList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_DAILY_REPORT_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionDailyReportList() {
  return {
    type: GET_SORT_DIRECTION_DAILY_REPORT_LIST,
  };
}

export function validateDailyReport(errors) {
  return {
    type: VALIDATE_DAILY_REPORT,
    errors,
  };
}

export function updateAvatar(file) {
  return {
    type: UPDATE_AVATAR,
    file,
  };
}

export function getUserDataSuccess(userList) {
  return {
    type: GET_USER_DATA_SUCCESS,
    userList,
  };
}
export function setFolderLogList(folderLogList) {
  return {
    type: SET_FOLDER_LOG_LIST,
    folderLogList,
  };
}
export function setDepartmentList(departmentList) {
  return {
    type: SET_DEPARTMENT_LIST,
    departmentList,
  };
}

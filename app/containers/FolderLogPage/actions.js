import {
  CHANGE_GROUP_MODEL,
  CHANGE_MEETING_MODEL,
  CHANGE_PAGE_NUMBER_FOLDER_LOG,
  CHANGE_PAGE_NUMBER_WORK_LOG,
  CHANGE_PAGE_SIZE_FOLDER_LOG,
  CHANGE_PAGE_SIZE_WORK_LOG,
  CHANGE_WORK_LOG_MODEL, // here
  CLEAR_MODAL_GROUP,
  CREATE_MEETING,
  CREATE_MEETING_SUCCESS,
  CREATE_WORK_LOG,
  CREATE_WORK_LOG_SUCCESS,
  DELETE_DAILY_REPORT,
  DELETE_DAILY_REPORT_SUCCESS,
  DELETE_MEETING,
  DELETE_MEETING_SUCCESS,
  DELETE_MULTIES_MEETING,
  DELETE_MULTIES_MEETING_SUCCESS,
  DELETE_MULTIES_WORK_LOG,
  DELETE_MULTIES_WORK_LOG_SUCCESS,
  DELETE_MULTIPLE_FOLDER_LOG,
  DELETE_MULTIPLE_FOLDER_LOG_SUCCESS,
  DELETE_SCHEDULE,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_WORK_LOG,
  DELETE_WORK_LOG_SUCCESS,
  EDIT_MEETING,
  EDIT_MEETING_SUCCESS,
  EDIT_WORK_LOG,
  EDIT_WORK_LOG_SUCCESS,
  FETCH_WORK_LOG_DATA,
  GET_FOLDER_LOG_SUCCESS,
  GET_GROUP_DETAIL,
  GET_GROUP_DETAIL_SUCCESS,
  GET_INIT_FOLDER_LOG,
  GET_LIST_FOLDER_LOG,
  GET_MEETING_DETAIL,
  GET_MEETING_DETAIL_SUCCESS,
  GET_SELECT_FOLDER_LOG_ITEM_SUCCESS,
  GET_SORT_DIRECTION_WORK_LOG_LIST,
  GET_SORT_WORK_LOG_LIST,
  GET_USER_DATA_SUCCESS,
  GET_WORK_LOG_DATA_SUCCESS,
  GET_WORK_LOG_DETAIL,
  GET_WORK_LOG_DETAIL_SUCCESS,
  RESET_ALL_DATA,
  SAVE_FOLDER_LOG,
  SAVE_FOLDER_LOG_SUCCESS,
  SELECT_FOLDER_LOG_ITEM,
  SET_ACCOUNT_LIST,
  SET_FOLDER_LOG_META,
  SET_META_WORK_LOG,
  SET_SEARCH,
  SET_SEARCH_DATA,
  VALIDATE_FOLDER_LOG,
  VALIDATE_GROUP_ERROR,
  VALIDATE_MEETING_ERROR,
  VALIDATE_WORK_LOG_ERROR,
} from './constants';

// ***************************************
// #region
export function getFolderLogDatas(search, callback) {
  return {
    type: GET_LIST_FOLDER_LOG,
    search,
    callback,
  };
}
export function getFolderLogInit() {
  return {
    type: GET_INIT_FOLDER_LOG,
  };
}
export function setAccountList(accountList) {
  return {
    type: SET_ACCOUNT_LIST,
    accountList,
  };
}
export function getFolderLogDatasSuccess(datas) {
  return {
    type: GET_FOLDER_LOG_SUCCESS,
    datas,
  };
}

/**
 * @param(value: any)
 * @param(name: string)
 *
 * action change in modal edit or add folderLog
 */
export function changeGroupModel(value, name) {
  return {
    type: CHANGE_GROUP_MODEL,
    value,
    name,
  };
}

/**
 * @param {group: object} info group is input on modal
 */
export function saveGroup(folderLog, groupId) {
  return {
    type: SAVE_FOLDER_LOG,
    folderLog,
    groupId,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_GROUP_ERROR,
    errors,
  };
}

export function createGroupSuccess(message) {
  return {
    type: SAVE_FOLDER_LOG_SUCCESS,
    message,
  };
}

export function selectGroup(ids) {
  return {
    type: SELECT_FOLDER_LOG_ITEM,
    ids,
  };
}

export function getGroupDetail(groupId) {
  return {
    type: GET_GROUP_DETAIL,
    groupId,
  };
}

export function getGroupDetailSuccess(groupDetail) {
  return {
    type: GET_GROUP_DETAIL_SUCCESS,
    groupDetail,
  };
}

export function clearModal() {
  return {
    type: CLEAR_MODAL_GROUP,
  };
}
/**
 * @param {resDoors: object} doors response return from server after get doors of group
 * @return object with type and object corresponding to
 */
export function getSelectGroupItemSuccess(folderSelect) {
  return {
    type: GET_SELECT_FOLDER_LOG_ITEM_SUCCESS,
    folderSelect,
  };
}

export function deleteMultiesFolderLog(ids) {
  return { type: DELETE_MULTIPLE_FOLDER_LOG, ids };
}
export function deleteMultiesFolderLogSuccess(message) {
  return { type: DELETE_MULTIPLE_FOLDER_LOG_SUCCESS, message };
}

export function setFolderLogMeta(meta) {
  return { type: SET_FOLDER_LOG_META, meta };
}
export function changePageNumberFolderLog(pageNumber) {
  return { type: CHANGE_PAGE_NUMBER_FOLDER_LOG, pageNumber };
}
export function changePageSizeFolderLog(pageSize) {
  return { type: CHANGE_PAGE_SIZE_FOLDER_LOG, pageSize };
}

export function resetAllData() {
  return { type: RESET_ALL_DATA };
}

export function setSearch(search) {
  return { type: SET_SEARCH, search };
}
export function setSearchData(searchData) {
  return { type: SET_SEARCH_DATA, searchData };
}

export function validateFolderLog(errors) {
  return { type: VALIDATE_FOLDER_LOG, errors };
}

//work log
export function getWorkLogDetail(id) {
  return {
    type: GET_WORK_LOG_DETAIL,
    id,
  };
}

export function getWorkLogDetailSuccess(workLogModel) {
  return {
    type: GET_WORK_LOG_DETAIL_SUCCESS,
    workLogModel,
  };
}
export function deleteWorkLog(id) {
  return { type: DELETE_WORK_LOG, id };
}
export function deleteWorkLogSuccess(message) {
  return { type: DELETE_WORK_LOG_SUCCESS, message };
}
export function editWorkLog(id, workLog) {
  return { type: EDIT_WORK_LOG, workLog, id };
}
export function editWorkLogSuccess(message) {
  return { type: EDIT_WORK_LOG_SUCCESS, message };
}
export function createWorkLog(workLog) {
  return { type: CREATE_WORK_LOG, workLog };
}
export function createWorkLogSuccess(message) {
  return { type: CREATE_WORK_LOG_SUCCESS, message };
}

export function changeWorkLogModel(name, value) {
  return {
    type: CHANGE_WORK_LOG_MODEL,
    value,
    name,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidWorkLogModel(errors) {
  return {
    type: VALIDATE_WORK_LOG_ERROR,
    errors,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberWorkLog(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_WORK_LOG,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeWorkLog(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_WORK_LOG,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getWorkLogData(userIds, folderLogs, search) {
  return {
    type: FETCH_WORK_LOG_DATA,
    userIds,
    search,
    folderLogs,
  };
}
export function getWorkLogDataSuccess(data) {
  return {
    type: GET_WORK_LOG_DATA_SUCCESS,
    data,
  };
}
export function getUserDataSuccess(data) {
  return {
    type: GET_USER_DATA_SUCCESS,
    data,
  };
}

export function getSortWorkLogList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_WORK_LOG_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionWorkLogList() {
  return {
    type: GET_SORT_DIRECTION_WORK_LOG_LIST,
  };
}

export function setMetaWorkLog(meta) {
  return {
    type: SET_META_WORK_LOG,
    meta,
  };
}
export function deleteMultiesWorkLog(ids) {
  return {
    type: DELETE_MULTIES_WORK_LOG,
    ids,
  };
}
export function deleteMultiesWorkLogSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_WORK_LOG_SUCCESS,
    message,
    ids,
  };
}

// schedule
export function deleteSchedule(id) {
  return {
    type: DELETE_SCHEDULE,
    id,
  };
}
export function deleteScheduleSuccess(message) {
  return {
    type: DELETE_SCHEDULE_SUCCESS,
    message,
  };
}
// daily report
export function deleteDailyReport(id) {
  return {
    type: DELETE_DAILY_REPORT,
    id,
  };
}
export function deleteDailyReportSuccess(message) {
  return {
    type: DELETE_DAILY_REPORT_SUCCESS,
    message,
  };
}

// meeting
export function getMeetingDetail(id) {
  return {
    type: GET_MEETING_DETAIL,
    id,
  };
}

export function getMeetingDetailSuccess(meetingModel) {
  return {
    type: GET_MEETING_DETAIL_SUCCESS,
    meetingModel,
  };
}

export function deleteMeeting(id) {
  return { type: DELETE_MEETING, id };
}
export function deleteMeetingSuccess(message) {
  return { type: DELETE_MEETING_SUCCESS, message };
}
export function editMeeting(id, meetingLog) {
  return { type: EDIT_MEETING, meetingLog, id };
}
export function editMeetingSuccess(message) {
  return { type: EDIT_MEETING_SUCCESS, message };
}
export function createMeeting(meetingLog) {
  return { type: CREATE_MEETING, meetingLog };
}
export function createMeetingSuccess(message) {
  return { type: CREATE_MEETING_SUCCESS, message };
}

export function changeMeetingModel(name, value) {
  return {
    type: CHANGE_MEETING_MODEL,
    value,
    name,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidMeetingModel(errors) {
  return {
    type: VALIDATE_MEETING_ERROR,
    errors,
  };
}

export function deleteMultiesMeeting(ids) {
  return {
    type: DELETE_MULTIES_MEETING,
    ids,
  };
}
export function deleteMultiesMeetingSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_MEETING_SUCCESS,
    message,
    ids,
  };
}

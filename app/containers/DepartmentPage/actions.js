import {
  GET_DEPARTMENT,
  ADD_DEPARTMENT_SUCCESS,
  SET_DEPARTMENT_SUCCESS,
  SET_META_DEPARTMENT,
  CHANGE_PAGE_NUMBER_DEPARTMENT,
  CHANGE_PAGE_SIZE_DEPARTMENT,
  DELETE_DEPARTMENT_ROW,
  VALIDATE_DEPARTMENT_ERROR,
  DELETE_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT,
  DELETE_MULTIES_DEPARTMENT,
  DELETE_MULTIES_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT,
  UPDATE_DEPARTMENT_SUCCESS,
  HIDE_NOTIFY_DEPARTMENT,
  REFRESH_PAGE,
  SHOW_MODAL,
  HIDE_MODAL,
  CHANGE_TEXT_FIELD,
  SHOW_MODAL_UPDATE,
  EXPORT_DEPARTMENT,
  IMPORT_DEPARTMENT,
  GET_SORTED_DEPARTMENTS,
  GET_SORTED_DIRECTION_DEPARTMENTS,
  RESET_ALL_DATA,
  GET_ACCOUNT_SUCCESS,
  GET_USER_LIST,
  GET_USER_LIST_SUCCESS,
  CHANGE_USER_META,
} from './constants';

/**
 * Get event log data when init page
 *
 * @param  {meta} object contains info paging
 * @return {object}    An action object with a type of GET_DEPARTMENT
 */
export function getDepartments(paging) {
  return {
    type: GET_DEPARTMENT,
    paging,
  };
}
/**
 *
 * @param {data} object contains data of event logs
 * @returns {object} An action object with a type of  SET_DEPARTMENT_SUCCESS
 */
export function fetchDepartmentsSuccess(data) {
  return {
    type: SET_DEPARTMENT_SUCCESS,
    data,
  };
}
/**
 * @param {meta} object contains info of recordsFiltered and recordsTotal
 * @param {object} An action object with a type of SET_META_DEPARTMENT
 */

export function setMetaPagingDepartment(meta) {
  return {
    type: SET_META_DEPARTMENT,
    meta,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberDepartment(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_DEPARTMENT,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeDepartment(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_DEPARTMENT,
    pageSize,
  };
}

export function deleteDepartment(id) {
  return {
    type: DELETE_DEPARTMENT_ROW,
    id,
  };
}

export function invalidModel(errors) {
  return {
    type: VALIDATE_DEPARTMENT_ERROR,
    errors,
  };
}

export function addDepartmentSuccess(message) {
  return {
    type: ADD_DEPARTMENT_SUCCESS,
    message,
  };
}
export function updateDepartmentSuccess(message) {
  return {
    type: UPDATE_DEPARTMENT_SUCCESS,
    message,
  };
}
export function postDepartmentAdd(department) {
  return {
    type: ADD_DEPARTMENT,
    department,
  };
}
export function putDepartmentUpdate(department) {
  return {
    type: UPDATE_DEPARTMENT,
    department,
  };
}
export function deleteDepartmentSuccess(message, id) {
  return {
    type: DELETE_DEPARTMENT_SUCCESS,
    message,
    id,
  };
}
export function deleteMultiesDepartment(ids) {
  return {
    type: DELETE_MULTIES_DEPARTMENT,
    ids,
  };
}
export function deleteMultiesDepartmentSucces(message, ids) {
  return {
    type: DELETE_MULTIES_DEPARTMENT_SUCCESS,
    message,
    ids,
  };
}

export function hideNotify() {
  return {
    type: HIDE_NOTIFY_DEPARTMENT,
  };
}

export function refreshPage() {
  return {
    type: REFRESH_PAGE,
  };
}

export function showModal() {
  return {
    type: SHOW_MODAL,
  };
}

export function hideModal() {
  return {
    type: HIDE_MODAL,
  };
}

export function changeTextField(name, value) {
  return {
    type: CHANGE_TEXT_FIELD,
    name,
    value,
  };
}

export function showModelUpdate(number, name, departmentManagerId) {
  return {
    type: SHOW_MODAL_UPDATE,
    number,
    name,
    departmentManagerId,
  };
}

export function exportFile(fileType) {
  return {
    type: EXPORT_DEPARTMENT,
    fileType,
  };
}

export function importFile(file, fileType, state) {
  return {
    type: IMPORT_DEPARTMENT,
    file,
    fileType,
    state,
  };
}

export function getSortedDepartments(sortColumn) {
  return {
    type: GET_SORTED_DEPARTMENTS,
    sortColumn,
  };
}

export function getSortedDirectionDepartments() {
  return {
    type: GET_SORTED_DIRECTION_DEPARTMENTS,
  };
}

export function resetAllData() {
  return { type: RESET_ALL_DATA };
}

export function getAccountSuccess(accounts) {
  return { type: GET_ACCOUNT_SUCCESS, accounts };
}

export function getUserList() {
  return { type: GET_USER_LIST };
}

export function getUserListSuccess(data, meta, header) {
  return { type: GET_USER_LIST_SUCCESS, data, meta, header };
}

export function changeUserMeta(name, value) {
  return { type: CHANGE_USER_META, name, value };
}

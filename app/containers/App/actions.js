import {
  FETCH_API,
  FETCH_API_ERROR,
  SUBMIT_LOGIN,
  LOGIN_SUCCESS,
  INVALID_INPUT_LOGIN,
  LOAD_SUCCES,
  HIDE_SHOW_NOTIFY_GLOBAL,
  SEND_EMAIL_FORGOT_PASSWORD,
  OPEN_FORGOT_PASS_MODAL,
  SEND_EMAIL_SUCCESS,
  GET_LOGO_SUCCESS,
  RESET_ENQUEUE,
  RESET_NOTIFY_SUCCESS,
  NOTIFY_SUCCESS,
  GET_LOGO,
  UPDATE_PROGRESS,
  STOP_PROCESSES,
  CLEAR_PROCESSES,
  CREATE_PROCESSES,
  PUSH_PROCESSOBJ,
  POP_PROCESSOBJ,
  GET_ACCOUNT_TZ,
  GET_ACCOUNT_TZ_SUCCESS,
  PATCH_ACCOUNT_TZ,
  PATCH_ACCOUNT_TZ_SUCCESS,
  PATCH_HEADER_COLUMNS,
} from './constants';

/**
 *
 *  LOGIN ACTION
 *
 */
/**
 * @param  {email: string} message will be send to this email
 * @return {object}    An action object with a type of SEND_EMAIL_FORGOT_PASSWORD
 */
export function sendMailForgotPass(email) {
  return {
    type: SEND_EMAIL_FORGOT_PASSWORD,
    email,
  };
}

/**
 *
 * @param {message: object} message retrun from server
 */
export function sendEmailSuccess(message) {
  return {
    type: SEND_EMAIL_SUCCESS,
    message,
  };
}

/**
 * @param {login} : payload for submit login: {username:'', password:''}
 */
export function submitLogin(payload, data, rememberMe) {
  return {
    type: SUBMIT_LOGIN,
    payload: payload,
    data: data,
    rememberMe,
  };
}

export function openForgotPassModal() {
  return {
    type: OPEN_FORGOT_PASS_MODAL,
  };
}
/**
 * @param  {token} string
 */
export function loginSuccess(
  username,
  token,
  accountType,
  companyCode,
  accountTz,
) {
  return {
    type: LOGIN_SUCCESS,
    username,
    token,
    accountType,
    companyCode,
    accountTz,
  };
}

/**
 * @param {err} object contains error info
 */
export function invalidInput(err) {
  return {
    type: INVALID_INPUT_LOGIN,
    error: err,
  };
}

/**
 * Show loading bar
 */
export function fetchApi() {
  return { type: FETCH_API };
}

/**
 * @param  {object}
 */
export function fetchApiError(error) {
  return {
    type: FETCH_API_ERROR,
    error,
  };
}

export function loadSuccess() {
  return {
    type: LOAD_SUCCES,
  };
}

export function hideNotifyGlobal() {
  return {
    type: HIDE_SHOW_NOTIFY_GLOBAL,
  };
}

export function getLogo() {
  return {
    type: GET_LOGO,
  };
}

export function getLogoSuccess(logo) {
  return {
    type: GET_LOGO_SUCCESS,
    logo,
  };
}

export function resetEnqueue() {
  return {
    type: RESET_ENQUEUE,
  };
}

export function notifySuccess(message) {
  return {
    type: NOTIFY_SUCCESS,
    message,
  };
}

export function resetNotifySuccess() {
  return {
    type: RESET_NOTIFY_SUCCESS,
  };
}

export function createProcesses(devicesIdSelected, processLists) {
  return {
    type: CREATE_PROCESSES,
    devicesIdSelected,
    processLists,
  };
}

export function updateProcesses(progressId, processObj) {
  return {
    type: UPDATE_PROGRESS,
    progressId,
    processObj,
  };
}

export function stopProcesses(processIds, devicesIdSelected) {
  return {
    type: STOP_PROCESSES,
    processIds,
    devicesIdSelected,
  };
}

export function clearProcesses(processListObj, processIds) {
  return {
    type: CLEAR_PROCESSES,
    processListObj,
    processIds,
  };
}

export function pushProcesses(pageName, data) {
  return {
    type: PUSH_PROCESSOBJ,
    pageName,
    data,
  };
}

export function popProcesses(pageName, data) {
  return {
    type: POP_PROCESSOBJ,
    pageName,
    data,
  };
}

export function getTimezoneSuccess(data) {
  return {
    type: GET_ACCOUNT_TZ_SUCCESS,
    data,
  };
}

export function getTimezone() {
  return { type: GET_ACCOUNT_TZ };
}

export function patchTimezone(timeZone) {
  return { type: PATCH_ACCOUNT_TZ, payLoad: timeZone };
}

export function patchTimezoneSuccess(message) {
  return { type: PATCH_ACCOUNT_TZ_SUCCESS, message };
}

export function patchHeaderColumns(headers) {
  return { type: PATCH_HEADER_COLUMNS, headers };
}

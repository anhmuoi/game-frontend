import {
  CHANGE_INPUT,
  JOIN_GROUP,
  JOIN_GROUP_SUCCESS,
  VALIDATE_PASS_ERROR,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  RESET_DATA_MODELS,
  GET_USER_LIST_JOIN_GROUP_SUCCESS,
  GET_USER_LIST_JOIN_GROUP,
  CONFIRM_JOIN_GROUP,
} from './constants';

/**
 *
 * @param {name: string} name input
 * @param {value} value that user input
 */
export function changeInput(name, value) {
  return {
    type: CHANGE_INPUT,
    name,
    value,
  };
}

/**
 *
 * @param {*} token: string
 * @param {*} newPass: string
 * @param {*} confirmPass: string
 */
export function joinGroup(token, newPass, confirmPass) {
  return {
    type: JOIN_GROUP,
    token,
    newPass,
    confirmPass,
  };
}

export function joinGroupSuccess(message) {
  return {
    type: JOIN_GROUP_SUCCESS,
    message,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_PASS_ERROR,
    errors,
  };
}

export function changePassword(model) {
  return {
    type: CHANGE_PASSWORD,
    model,
  };
}

export function changePassSuccess(message) {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    message,
  };
}

export function resetDataModels() {
  return { type: RESET_DATA_MODELS };
}
export function getUserData() {
  return { type: GET_USER_LIST_JOIN_GROUP };
}
export function confirmJoinGroup(departmentId, userId, confirm, token) {
  return { type: CONFIRM_JOIN_GROUP, id: departmentId, userId, confirm, token };
}
export function setUserData(userList) {
  return { type: GET_USER_LIST_JOIN_GROUP_SUCCESS, userList };
}

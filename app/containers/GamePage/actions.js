import {
  CHANGE_INPUT,
  GAME,
  GAME_SUCCESS,
  VALIDATE_PASS_ERROR,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  RESET_DATA_MODELS,
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
export function game(token, newPass, confirmPass) {
  return {
    type: GAME,
    token,
    newPass,
    confirmPass,
  };
}

export function resetPassSuccess(message) {
  return {
    type: GAME_SUCCESS,
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

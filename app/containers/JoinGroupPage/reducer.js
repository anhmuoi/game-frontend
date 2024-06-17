import { fromJS } from 'immutable';
import {
  CHANGE_INPUT,
  VALIDATE_PASS_ERROR,
  JOIN_GROUP_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  RESET_DATA_MODELS,
  GET_USER_LIST_JOIN_GROUP_SUCCESS,
} from './constants';

/**
 * @param(state) object (userModel in store user): object merge
 * @param(err) object: object contains error info
 */
export const mergeState = (state, err) => {
  const errorUI = {};
  err.forEach((error) => {
    errorUI[error.field] = error.message;
  });

  const cloneState = {};
  Object.getOwnPropertyNames(state).forEach((property) => {
    cloneState[property] = {
      value: state[property].value,
      errorMessage: errorUI[property] ? errorUI[property] : false,
    };
  });
  return cloneState;
};

// The initial state of the App
export const initialState = fromJS({
  passwordModel: {
    username: { value: '', errorMessage: false },
    password: { value: '', errorMessage: false },
    newPassword: { value: '', errorMessage: false },
    confirmNewPassword: { value: '', errorMessage: false },
  },
  isRedirect: { value: false, route: '' },
  userList: [],
});

function joinGroupReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_INPUT:
      return state.setIn(['passwordModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case JOIN_GROUP_SUCCESS:
    case CHANGE_PASSWORD_SUCCESS:
      return state.set('isRedirect', fromJS({ value: true, route: '/login' }));
    case VALIDATE_PASS_ERROR:
      return state.set(
        'passwordModel',
        fromJS(mergeState(state.toJS().passwordModel, action.errors)),
      );
    case GET_USER_LIST_JOIN_GROUP_SUCCESS:
      return state.set('userList', action.userList);
    case RESET_DATA_MODELS:
      return state
        .set('passwordModel', initialState.get('passwordModel'))
        .set('isRedirect', initialState.get('isRedirect'));
    default:
      return state;
  }
}

export default joinGroupReducer;

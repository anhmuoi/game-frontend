/*
 * CHANGE_PASSWORDReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  CHANGE_PAGE_NUMBER_CHANGE_PASSWORD,
  CHANGE_PAGE_SIZE_CHANGE_PASSWORD,
  CHANGE_TEXT_FIELD,
  CREATE_CHANGE_PASSWORD_SUCCESS,
  DELETE_MULTIES_CHANGE_PASSWORD_SUCCESS,
  DELETE_CHANGE_PASSWORD_SUCCESS,
  GET_SORT_DIRECTION_CHANGE_PASSWORD_LIST,
  GET_SORT_CHANGE_PASSWORD_LIST,
  GET_CHANGE_PASSWORD_DATA_SUCCESS,
  INIT_INDEX_CHANGE_PASSWORD_SUCCESS,
  SET_META_CHANGE_PASSWORD,
  SET_STATUS_LIST_CHANGE_PASSWORD,
  UPDATE_CHANGE_PASSWORD_SUCCESS,
  VALIDATE_CHANGE_PASSWORD,
  VALIDATE_CHANGE_PASSWORD_ERROR,
  SET_GENDER_LIST_CHANGE_PASSWORD,
  SET_DEPARTMENTS_LIST_CHANGE_PASSWORD,
  SET_WORKTYPES_LIST_CHANGE_PASSWORD,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_CHANGE_PASSWORD,
  GET_FRIEND_DATA_SUCCESS,
  DELETE_MULTIES_FRIEND_SUCCESS,
  USER_OUT_GROUP_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
} from './constants.js';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  ChangePasswordModel: {
    id: { value: 0, errorMessage: false },
    address: { value: '', errorMessage: false },
    name: { value: '', errorMessage: false },
    description: { value: '', errorMessage: false },
    image: { value: '', errorMessage: false },
    mana: { value: 0, errorMessage: false },
    aliasId: { value: '', errorMessage: false },
    price: { value: 0, errorMessage: false },
    status: { value: 0, errorMessage: false },
    itemNftId: { value: 0, errorMessage: false },
    userId: { value: 0, errorMessage: false },
  },

  storeList: [],
  userList: [],
  friendList: [],

  ajaxSuccess: { value: false, message: '' },
  isRedirect: { value: false, route: '' },
  metaPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    sortColumn: 'Name',
    cloneSortColumn: 0,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  },
});

function ChangePasswordReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_CHANGE_PASSWORD:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_CHANGE_PASSWORD:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_CHANGE_PASSWORD:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_STORE_LIST_WAITING:
      return state.set('storeList', action.storeList);
    case SET_USER_CHANGE_PASSWORD:
      return state.set('userList', action.userList);
    case GET_FRIEND_DATA_SUCCESS:
      return state.set('friendList', action.friendList);
    case USER_OUT_GROUP_SUCCESS:
    case DELETE_MULTIES_FRIEND_SUCCESS:
    case DELETE_MULTIES_CHANGE_PASSWORD_SUCCESS:
    case DELETE_CHANGE_PASSWORD_SUCCESS:
    case UPDATE_CHANGE_PASSWORD_SUCCESS:
    case CREATE_CHANGE_PASSWORD_SUCCESS:
    case CHANGE_PASSWORD_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_CHANGE_PASSWORD_ERROR:
      return state.set(
        'ChangePasswordModel',
        fromJS(mergeState(state.toJS().ChangePasswordModel, action.errors)),
      );
    case VALIDATE_CHANGE_PASSWORD:
      return state.set(
        'ChangePasswordModel',
        fromJS(mergeState(state.toJS().ChangePasswordModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['ChangePasswordModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_CHANGE_PASSWORD_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_CHANGE_PASSWORD_SUCCESS:
      return state
        .set('ChangePasswordModel', fromJS(action.ChangePasswordModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_CHANGE_PASSWORD_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_CHANGE_PASSWORD_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default ChangePasswordReducer;

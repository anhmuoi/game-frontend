/*
 * FRIENDReducer
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
  CHANGE_PAGE_NUMBER_FRIEND,
  CHANGE_PAGE_SIZE_FRIEND,
  CHANGE_TEXT_FIELD,
  CREATE_FRIEND_SUCCESS,
  DELETE_MULTIES_FRIEND_SUCCESS,
  DELETE_FRIEND_SUCCESS,
  GET_SORT_DIRECTION_FRIEND_LIST,
  GET_SORT_FRIEND_LIST,
  GET_FRIEND_DATA_SUCCESS,
  INIT_INDEX_FRIEND_SUCCESS,
  SET_META_FRIEND,
  SET_STATUS_LIST_FRIEND,
  UPDATE_FRIEND_SUCCESS,
  VALIDATE_FRIEND,
  VALIDATE_FRIEND_ERROR,
  SET_GENDER_LIST_FRIEND,
  SET_DEPARTMENTS_LIST_FRIEND,
  SET_WORKTYPES_LIST_FRIEND,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_FRIEND,
} from './constants.js';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  friendModel: {
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

function friendReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_FRIEND:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_FRIEND:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_FRIEND:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_STORE_LIST_WAITING:
      return state.set('storeList', action.storeList);
    case SET_USER_FRIEND:
      return state.set('userList', action.userList);
    case DELETE_MULTIES_FRIEND_SUCCESS:
    case DELETE_FRIEND_SUCCESS:
    case UPDATE_FRIEND_SUCCESS:
    case CREATE_FRIEND_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_FRIEND_ERROR:
      return state.set(
        'friendModel',
        fromJS(mergeState(state.toJS().friendModel, action.errors)),
      );
    case VALIDATE_FRIEND:
      return state.set(
        'friendModel',
        fromJS(mergeState(state.toJS().friendModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['friendModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_FRIEND_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_FRIEND_SUCCESS:
      return state
        .set('friendModel', fromJS(action.friendModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_FRIEND_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_FRIEND_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default friendReducer;

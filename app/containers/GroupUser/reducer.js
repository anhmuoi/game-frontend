/*
 * GROUP_USERReducer
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
  CHANGE_PAGE_NUMBER_GROUP_USER,
  CHANGE_PAGE_SIZE_GROUP_USER,
  CHANGE_TEXT_FIELD,
  CREATE_GROUP_USER_SUCCESS,
  DELETE_MULTIES_GROUP_USER_SUCCESS,
  DELETE_GROUP_USER_SUCCESS,
  GET_SORT_DIRECTION_GROUP_USER_LIST,
  GET_SORT_GROUP_USER_LIST,
  GET_GROUP_USER_DATA_SUCCESS,
  INIT_INDEX_GROUP_USER_SUCCESS,
  SET_META_GROUP_USER,
  SET_STATUS_LIST_GROUP_USER,
  UPDATE_GROUP_USER_SUCCESS,
  VALIDATE_GROUP_USER,
  VALIDATE_GROUP_USER_ERROR,
  SET_GENDER_LIST_GROUP_USER,
  SET_DEPARTMENTS_LIST_GROUP_USER,
  SET_WORKTYPES_LIST_GROUP_USER,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_GROUP_USER,
} from './constants.js';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  groupUserModel: {
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

function groupUserReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_GROUP_USER:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_GROUP_USER:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_GROUP_USER:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_STORE_LIST_WAITING:
      return state.set('storeList', action.storeList);
    case SET_USER_GROUP_USER:
      return state.set('userList', action.userList);
    case DELETE_MULTIES_GROUP_USER_SUCCESS:
    case DELETE_GROUP_USER_SUCCESS:
    case UPDATE_GROUP_USER_SUCCESS:
    case CREATE_GROUP_USER_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_GROUP_USER_ERROR:
      return state.set(
        'groupUserModel',
        fromJS(mergeState(state.toJS().groupUserModel, action.errors)),
      );
    case VALIDATE_GROUP_USER:
      return state.set(
        'groupUserModel',
        fromJS(mergeState(state.toJS().groupUserModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['groupUserModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_GROUP_USER_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_GROUP_USER_SUCCESS:
      return state
        .set('groupUserModel', fromJS(action.groupUserModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_GROUP_USER_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_GROUP_USER_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default groupUserReducer;

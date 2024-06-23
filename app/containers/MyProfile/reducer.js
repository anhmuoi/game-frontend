/*
 * MY_PROFILEReducer
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
  CHANGE_PAGE_NUMBER_MY_PROFILE,
  CHANGE_PAGE_SIZE_MY_PROFILE,
  CHANGE_TEXT_FIELD,
  CREATE_MY_PROFILE_SUCCESS,
  DELETE_MULTIES_MY_PROFILE_SUCCESS,
  DELETE_MY_PROFILE_SUCCESS,
  GET_SORT_DIRECTION_MY_PROFILE_LIST,
  GET_SORT_MY_PROFILE_LIST,
  GET_MY_PROFILE_DATA_SUCCESS,
  INIT_INDEX_MY_PROFILE_SUCCESS,
  SET_META_MY_PROFILE,
  SET_STATUS_LIST_MY_PROFILE,
  UPDATE_MY_PROFILE_SUCCESS,
  VALIDATE_MY_PROFILE,
  VALIDATE_MY_PROFILE_ERROR,
  SET_GENDER_LIST_MY_PROFILE,
  SET_DEPARTMENTS_LIST_MY_PROFILE,
  SET_WORKTYPES_LIST_MY_PROFILE,
  UPDATE_AVATAR,
  SET_ROLE_LIST_MY_PROFILE,
} from './constants';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  myProfileModel: {
    id: { value: 0, errorMessage: false },
    avatar: { value: '', errorMessage: false },
    name: { value: '', errorMessage: false },
    userName: { value: '', errorMessage: false },
    phone: { value: '', errorMessage: false },
    departmentId: { value: 0, errorMessage: false },
    position: { value: '', errorMessage: false },
    email: { value: '', errorMessage: false },
    status: { value: 0, errorMessage: false },
    holiday: { value: 0, errorMessage: false },
    password: { value: '', errorMessage: false },
    confirmPassword: { value: '', errorMessage: false },
    language: { value: '', errorMessage: false },
    timezone: { value: '', errorMessage: false },
    createdOn: { value: '', errorMessage: false },
    roleId: { value: 1, errorMessage: false },
    walletAddress: { value: '', errorMessage: false },
    ownerRoom: { value: 0, errorMessage: false },
  },
  roleList: [],
  departmentsList: [],
  statusList: [],
  genderList: [],
  ajaxSuccess: { value: false, message: '' },
  isRedirect: { value: false, route: '' },
  metaPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    sortColumn: 'name',
    cloneSortColumn: 0,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  },
});

function myProfileReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_MY_PROFILE:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_MY_PROFILE:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_MY_PROFILE:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_STATUS_LIST_MY_PROFILE:
      return state.set('statusList', action.statusList);
    case UPDATE_AVATAR:
      return state.setIn(['myProfileModel', 'avatar', 'value'], action.file);

    case SET_GENDER_LIST_MY_PROFILE:
      return state.set('genderList', action.genderList);
    case SET_DEPARTMENTS_LIST_MY_PROFILE:
      return state.set('departmentsList', action.departmentsList);
    case SET_ROLE_LIST_MY_PROFILE:
      return state.set('roleList', action.roleList);
    case DELETE_MULTIES_MY_PROFILE_SUCCESS:
    case DELETE_MY_PROFILE_SUCCESS:
    case UPDATE_MY_PROFILE_SUCCESS:
    case CREATE_MY_PROFILE_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_MY_PROFILE_ERROR:
      return state.set(
        'myProfileModel',
        fromJS(mergeState(state.toJS().myProfileModel, action.errors)),
      );
    case VALIDATE_MY_PROFILE:
      return state.set(
        'myProfileModel',
        fromJS(mergeState(state.toJS().myProfileModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['myProfileModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_MY_PROFILE_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_MY_PROFILE_SUCCESS:
      return state
        .set('myProfileModel', fromJS(action.myProfileModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_MY_PROFILE_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_MY_PROFILE_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default myProfileReducer;

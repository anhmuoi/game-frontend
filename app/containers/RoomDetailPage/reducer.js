/*
 * ROOM_DETAILReducer
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
  CHANGE_PAGE_NUMBER_ROOM_DETAIL,
  CHANGE_PAGE_SIZE_ROOM_DETAIL,
  CHANGE_TEXT_FIELD,
  CREATE_ROOM_DETAIL_SUCCESS,
  DELETE_MULTIES_ROOM_DETAIL_SUCCESS,
  DELETE_ROOM_DETAIL_SUCCESS,
  GET_SORT_DIRECTION_ROOM_DETAIL_LIST,
  GET_SORT_ROOM_DETAIL_LIST,
  GET_ROOM_DETAIL_DATA_SUCCESS,
  INIT_INDEX_ROOM_DETAIL_SUCCESS,
  SET_META_ROOM_DETAIL,
  SET_STATUS_LIST_ROOM_DETAIL,
  UPDATE_ROOM_DETAIL_SUCCESS,
  VALIDATE_ROOM_DETAIL,
  VALIDATE_ROOM_DETAIL_ERROR,
  SET_GENDER_LIST_ROOM_DETAIL,
  SET_DEPARTMENTS_LIST_ROOM_DETAIL,
  SET_WORKTYPES_LIST_ROOM_DETAIL,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_ROOM_DETAIL,
  GET_MEETING_LOGS_BY_ID_SUCCESS,
} from './constants.js';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  roomDetailModel: {
    id: { value: 0, errorMessage: false },
    name: { value: '', errorMessage: false },
    isRunning: { value: false, errorMessage: false },
    description: { value: '', errorMessage: false },
    totalPeople: { value: 0, errorMessage: false },
    currentPeople: { value: 0, errorMessage: false },
    currentMeetingLogId: { value: 0, errorMessage: false },
    price: { value: 0, errorMessage: false },
    userListId: { value: [], errorMessage: false },
  },
  meetingLogDetail: null,

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

function roomDetailReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_ROOM_DETAIL:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_ROOM_DETAIL:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_ROOM_DETAIL:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_STORE_LIST_WAITING:
      return state.set('storeList', action.storeList);
    case GET_MEETING_LOGS_BY_ID_SUCCESS:
      return state.set('meetingLogDetail', action.meetingLogDetail);
    case SET_USER_ROOM_DETAIL:
      return state.set('userList', action.userList);

    case DELETE_MULTIES_ROOM_DETAIL_SUCCESS:
    case DELETE_ROOM_DETAIL_SUCCESS:
    case UPDATE_ROOM_DETAIL_SUCCESS:
    case CREATE_ROOM_DETAIL_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_ROOM_DETAIL_ERROR:
      return state.set(
        'roomDetailModel',
        fromJS(mergeState(state.toJS().roomDetailModel, action.errors)),
      );
    case VALIDATE_ROOM_DETAIL:
      return state.set(
        'roomDetailModel',
        fromJS(mergeState(state.toJS().roomDetailModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['roomDetailModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_ROOM_DETAIL_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_ROOM_DETAIL_SUCCESS:
      return state
        .set('roomDetailModel', fromJS(action.roomDetailModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_ROOM_DETAIL_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_ROOM_DETAIL_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default roomDetailReducer;

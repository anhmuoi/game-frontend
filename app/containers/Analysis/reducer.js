/*
 * ANALYSISReducer
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
  CHANGE_PAGE_NUMBER_ANALYSIS,
  CHANGE_PAGE_SIZE_ANALYSIS,
  CHANGE_TEXT_FIELD,
  CREATE_ANALYSIS_SUCCESS,
  DELETE_MULTIES_ANALYSIS_SUCCESS,
  DELETE_ANALYSIS_SUCCESS,
  GET_SORT_DIRECTION_ANALYSIS_LIST,
  GET_SORT_ANALYSIS_LIST,
  GET_ANALYSIS_DATA_SUCCESS,
  INIT_INDEX_ANALYSIS_SUCCESS,
  SET_META_ANALYSIS,
  SET_STATUS_LIST_ANALYSIS,
  UPDATE_ANALYSIS_SUCCESS,
  VALIDATE_ANALYSIS,
  VALIDATE_ANALYSIS_ERROR,
  SET_GENDER_LIST_ANALYSIS,
  SET_DEPARTMENTS_LIST_ANALYSIS,
  SET_WORKTYPES_LIST_ANALYSIS,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_ANALYSIS,
  GET_BALANCE_CHART_SUCCESS,
} from './constants.js';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  analysisModel: {
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
  balanceChart: [],

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

function analysisReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_ANALYSIS:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_ANALYSIS:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_ANALYSIS:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_STORE_LIST_WAITING:
      return state.set('storeList', action.storeList);
    case SET_USER_ANALYSIS:
      return state.set('userList', action.userList);
    case GET_BALANCE_CHART_SUCCESS:
      return state.set('balanceChart', action.balanceChart);
    case DELETE_MULTIES_ANALYSIS_SUCCESS:
    case DELETE_ANALYSIS_SUCCESS:
    case UPDATE_ANALYSIS_SUCCESS:
    case CREATE_ANALYSIS_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_ANALYSIS_ERROR:
      return state.set(
        'analysisModel',
        fromJS(mergeState(state.toJS().analysisModel, action.errors)),
      );
    case VALIDATE_ANALYSIS:
      return state.set(
        'analysisModel',
        fromJS(mergeState(state.toJS().analysisModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['analysisModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_ANALYSIS_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_ANALYSIS_SUCCESS:
      return state
        .set('analysisModel', fromJS(action.analysisModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_ANALYSIS_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_ANALYSIS_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default analysisReducer;

/*
 * accountReducer
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
import { mergeState } from './accountUtilities';

import {
  GET_ACCOUNT_DATA_SUCCESS,
  INIT_INDEX_ACCOUNT_SUCCESS,
  CHANGE_TEXT_FIELD,
  VALIDATE_ACCOUNT_ERROR,
  CREATE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_MULTIES_ACCOUNT_SUCCESS,
  SET_META_ACCOUNT,
  CHANGE_PAGE_NUMBER_ACCOUNT,
  CHANGE_PAGE_SIZE_ACCOUNT,
  GET_SORT_ACCOUNT_LIST,
  GET_SORT_DIRECTION_ACCOUNT_LIST,
  VALIDATE_ACCOUNT,
} from './constants';
import { mergeMetaPaging } from '../App/appUtilities';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  accountModel: {
    id: { value: 0, errorMessage: false },
    username: { value: '', errorMessage: false },
    password: { value: '', errorMessage: false },
    confirmPassword: { value: '', errorMessage: false },
    companyCode: { value: 'k637420', errorMessage: false },
    rootFlag: { value: false, errorMessage: false },
    role: { value: 0, errorMessage: false },
    status: { value: 0, errorMessage: false },
    isCurrentAccount: { value: false, errorMessage: false },
    roleList: {
      value: [],
      errorMessage: false,
    },
    statusList: {
      value: [],
      errorMessage: false,
    },
  },
  ajaxSuccess: { value: false, message: '' },
  metaPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    sortColumn: 'email',
    cloneSortColumn: 0,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  },
});

function accountReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_ACCOUNT:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_ACCOUNT:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_ACCOUNT:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );
    case DELETE_MULTIES_ACCOUNT_SUCCESS:
    case DELETE_ACCOUNT_SUCCESS:
    case UPDATE_ACCOUNT_SUCCESS:
    case CREATE_ACCOUNT_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_ACCOUNT_ERROR:
      return state.set(
        'accountModel',
        fromJS(mergeState(state.toJS().accountModel, action.errors)),
      );
    case VALIDATE_ACCOUNT:
      return state.set(
        'accountModel',
        fromJS(mergeState(state.toJS().accountModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['accountModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_ACCOUNT_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data);
    case INIT_INDEX_ACCOUNT_SUCCESS:
      return state
        .set('accountModel', fromJS(action.accountModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_ACCOUNT_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_ACCOUNT_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default accountReducer;

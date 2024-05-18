/*
 * DAILY_REPORTReducer
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
  CHANGE_FILTER,
  CHANGE_PAGE_NUMBER_DAILY_REPORT,
  CHANGE_PAGE_SIZE_DAILY_REPORT,
  CHANGE_TEXT_FIELD,
  CLEAR_FILTER,
  CREATE_DAILY_REPORT_SUCCESS,
  DELETE_DAILY_REPORT_SUCCESS,
  DELETE_MULTIES_DAILY_REPORT_SUCCESS,
  GET_DAILY_REPORT_DATA_SUCCESS,
  GET_SORT_DAILY_REPORT_LIST,
  GET_SORT_DIRECTION_DAILY_REPORT_LIST,
  GET_USER_DATA_SUCCESS,
  INIT_INDEX_DAILY_REPORT_SUCCESS,
  SET_DEPARTMENT_LIST,
  SET_FOLDER_LOG_LIST,
  SET_META_DAILY_REPORT,
  SET_REPORTER_LIST,
  UPDATE_DAILY_REPORT_SUCCESS,
  VALIDATE_DAILY_REPORT,
  VALIDATE_DAILY_REPORT_ERROR,
} from './constants';
import { mergeMetaPaging, mergeState } from './functions.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  dailyReportModel: {
    id: { value: 0, errorMessage: false },
    title: { value: '', errorMessage: false },
    content: { value: '', errorMessage: false },
    userId: {
      value: localstoreUtilites.getUserIdFromLocalStorage(),
      errorMessage: false,
    },
    reporterId: { value: 0, errorMessage: false },
    folderLogId: { value: 0, errorMessage: false },
    date: { value: new Date(), errorMessage: false },
  },
  filter: {
    search: '',
    userIdsFilter: [Number(localstoreUtilites.getUserIdFromLocalStorage())],
    folderLogsFilter: [],
    departmentsFilter: [],
    reportersFilter: [],
    startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },

  folderLogList: [],
  reporterList: [],
  departmentList: [],
  userList: [],

  ajaxSuccess: { value: false, message: '' },
  isRedirect: { value: false, route: '' },
  metaPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    sortColumn: 'userId',
    cloneSortColumn: 0,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  },
});

function dailyReportReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_DAILY_REPORT:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_DAILY_REPORT:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_DAILY_REPORT:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_REPORTER_LIST:
      return state.set('reporterList', action.reporterList);
    case SET_FOLDER_LOG_LIST:
      return state.set('folderLogList', action.folderLogList);
    case SET_DEPARTMENT_LIST:
      return state.set('departmentList', action.departmentList);
    case GET_USER_DATA_SUCCESS:
      return state.set('userList', action.userList);

    case DELETE_MULTIES_DAILY_REPORT_SUCCESS:
    case DELETE_DAILY_REPORT_SUCCESS:
    case UPDATE_DAILY_REPORT_SUCCESS:
    case CREATE_DAILY_REPORT_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_DAILY_REPORT_ERROR:
      return state.set(
        'dailyReportModel',
        fromJS(mergeState(state.toJS().dailyReportModel, action.errors)),
      );
    case VALIDATE_DAILY_REPORT:
      return state.set(
        'dailyReportModel',
        fromJS(mergeState(state.toJS().dailyReportModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['dailyReportModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case CHANGE_FILTER:
      return state.set(
        'filter',
        fromJS(mergeMetaPaging(state.toJS().filter, action.filter)),
      );
    case CLEAR_FILTER:
      return state.set(
        'filter',
        fromJS(
          mergeMetaPaging(state.toJS().filter, {
            search: '',
            userIdsFilter: [],
            folderLogsFilter: [],
            departmentsFilter: [],
            reportersFilter: [],
            startDate: new Date(new Date().setHours(0, 0, 0, 0)),
            endDate: new Date(),
          }),
        ),
      );

    case GET_DAILY_REPORT_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_DAILY_REPORT_SUCCESS:
      return state
        .set('dailyReportModel', fromJS(action.dailyReportModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_DAILY_REPORT_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_DAILY_REPORT_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default dailyReportReducer;

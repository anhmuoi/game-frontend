/* eslint-disable no-fallthrough */
/*
 * AppReducer
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
import { localstoreUtilites } from 'utils/persistenceData';
import {
  CLEAR_PROCESSES,
  CREATE_PROCESSES,
  FETCH_API,
  FETCH_API_ERROR,
  // PATCH_ACCOUNT_TZ_SUCCESS,
  GET_ACCOUNT_TZ,
  GET_ACCOUNT_TZ_SUCCESS,
  GET_LOGO_SUCCESS,
  HIDE_SHOW_NOTIFY_GLOBAL,
  INVALID_INPUT_LOGIN,
  LOAD_SUCCES,
  LOGIN_SUCCESS,
  NOTIFY_SUCCESS,
  OPEN_FORGOT_PASS_MODAL,
  PATCH_ACCOUNT_TZ,
  POP_PROCESSOBJ,
  PUSH_PROCESSOBJ,
  RESET_ENQUEUE,
  RESET_NOTIFY_SUCCESS,
  SEND_EMAIL_FORGOT_PASSWORD,
  SEND_EMAIL_SUCCESS,
  STOP_PROCESSES,
  SUBMIT_LOGIN,
  UPDATE_PROGRESS,
} from './constants';
// import {
//   FETCH_ACCOUNT_INIT,
//   ADD_ACCOUNT,
//   UPDATE_ACCOUNT,
//   INIT_INDEX_ACCOUNT,
//   DELETE_ACCOUNT_ROW,
//   DELETE_MULTIES_ACCOUNT,
// } from '../AccountPage/constants';
import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
} from '../ResetPasswordPage/constants';

import {
  ADD_ACCOUNT,
  DELETE_ACCOUNT_ROW,
  DELETE_MULTIES_ACCOUNT,
  FETCH_ACCOUNT_INIT,
  UPDATE_ACCOUNT,
} from '../AccountPage/constants.js';

import {
  GET_CATEGORY,
  GET_CATEGORY_INFO,
  DELETE_CATEGORY_ROW,
  DELETE_MULTIPLE_CATEGORY,
} from '../CategoryPage/constants.js';
import {
  mapCreateProcesses,
  mapRemoveProcesses,
  mapStopProcesses,
  removeProcessListObj,
  storeProcessListObj,
} from './appUtilities';
import {
  CREATE_WORK_LOG,
  DELETE_DAILY_REPORT,
  DELETE_MULTIES_WORK_LOG,
  DELETE_MULTIPLE_FOLDER_LOG,
  DELETE_SCHEDULE,
  DELETE_WORK_LOG,
  EDIT_WORK_LOG,
  FETCH_WORK_LOG_DATA,
  GET_GROUP_DETAIL,
  GET_LIST_FOLDER_LOG,
  GET_WORK_LOG_DETAIL,
  SAVE_FOLDER_LOG,
  SET_SEARCH,
} from '../FolderLogPage/constants.js';
import {
  ADD_DAILY_REPORT,
  DELETE_DAILY_REPORT_ROW,
  DELETE_MULTIES_DAILY_REPORT,
  FETCH_DAILY_REPORT_DATA,
  FETCH_DAILY_REPORT_INIT,
  GET_INDEX_DAILY_REPORT_BY_USER,
  INIT_INDEX_DAILY_REPORT,
  UPDATE_DAILY_REPORT,
} from '../DailyReportPage/constants.js';
import {
  GET_SCHEDULE,
  UPDATE_SCHEDULE,
  ADD_SCHEDULE,
  DELETE_SCHEDULE_ROW,
  DELETE_MULTIPLE_SCHEDULE,
} from '../SchedulePage/constants.js';

// The initial state of the App
const initialState = fromJS({
  logo: null,
  loading: false,
  error: false,
  notifySuccess: '',
  auth: localstoreUtilites.getAuthFromLocalStorage(),
  success: false,
  processListObj: {},

  storedProcessListObj: {
    DeviceUpdatePage: {},
    EventRecoveryPage: {},
    DevicePage: {},
  },
  /*
  {
    DeviceUpdatePage: {
      22: {
        processId: ['123123', '123124']
      },
    EventRecoveryPage: {
      22: {
        processId: ['123125']
      },
      23: {
        processId: ['123126']
      }
    }
  }
  */
  username: '',
  accountType: -1,
  accountTimezone: {},
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LOGO_SUCCESS:
      return state.set('logo', action.logo);
    case LOAD_SUCCES:
      return state.set('loading', false);
    case FETCH_API:
    case PATCH_ACCOUNT_TZ:
    case GET_ACCOUNT_TZ:
    case FETCH_ACCOUNT_INIT:
    case UPDATE_ACCOUNT:
    case ADD_ACCOUNT:
    case DELETE_ACCOUNT_ROW:
    case DELETE_MULTIES_ACCOUNT:
    // category
    case GET_CATEGORY:
    case GET_CATEGORY_INFO:
    case DELETE_CATEGORY_ROW:
    case DELETE_MULTIPLE_CATEGORY:

    // folder
    case GET_LIST_FOLDER_LOG:
    case SAVE_FOLDER_LOG:
    case DELETE_MULTIPLE_FOLDER_LOG:
    case GET_GROUP_DETAIL:
    case DELETE_SCHEDULE:
    case DELETE_DAILY_REPORT:
    case SET_SEARCH:

    // work
    case FETCH_WORK_LOG_DATA:
    case GET_WORK_LOG_DETAIL:
    case CREATE_WORK_LOG:
    case EDIT_WORK_LOG:
    case DELETE_WORK_LOG:
    case DELETE_MULTIES_WORK_LOG:

    // daily report
    case FETCH_DAILY_REPORT_DATA:
    case FETCH_DAILY_REPORT_INIT:
    case UPDATE_DAILY_REPORT:
    case ADD_DAILY_REPORT:
    case INIT_INDEX_DAILY_REPORT:
    case DELETE_DAILY_REPORT_ROW:
    case DELETE_MULTIES_DAILY_REPORT:
    case GET_INDEX_DAILY_REPORT_BY_USER:

    // schedule
    case GET_SCHEDULE: 
    case DELETE_SCHEDULE_ROW: 
    case DELETE_MULTIPLE_SCHEDULE:

    // reset member password:
    case RESET_PASSWORD:
      return state.set('loading', true).set('error', false);
    case SUBMIT_LOGIN:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['auth', 'isAuthed'], false)
        .set('success', false)
        .set('username', action.payload.username);
    case HIDE_SHOW_NOTIFY_GLOBAL:
      return state.set('error', false);
    case LOGIN_SUCCESS: {
      return state
        .set('loading', false)
        .set('error', false)
        .setIn(['auth', 'token'], action.token)
        .setIn(['auth', 'accountType'], action.accountType)
        .setIn(['auth', 'isAuthed'], true)
        .set('accountType', action.accountType);
    }
    case FETCH_API_ERROR:
      return state.set('loading', false).set('error', action.error);
    case NOTIFY_SUCCESS:
      return state.set('notifySuccess', action.message);
    case RESET_NOTIFY_SUCCESS:
      return state.set('notifySuccess', '');
    case INVALID_INPUT_LOGIN:
      return state.set('error', action.error).set('success', false);
    case RESET_PASSWORD_SUCCESS:
    case CHANGE_PASSWORD_SUCCESS:
    case SEND_EMAIL_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('success', action.message);
    case RESET_PASSWORD:
    case CHANGE_PASSWORD:
    case SEND_EMAIL_FORGOT_PASSWORD:
      return state
        .set('loading', true)
        .set('error', false)
        .set('success', false);
    case OPEN_FORGOT_PASS_MODAL:
      return state
        .set('loading', false)
        .set('error', false)
        .set('success', false);
    case RESET_ENQUEUE:
      return state.set('error', false);
    case UPDATE_PROGRESS: {
      const processList = state.get('processListObj').toJS();
      if (processList[action.progressId]) {
        return state.setIn(
          ['processListObj', action.progressId],
          fromJS(action.processObj),
        );
      }
      state.set(
        'processListObj',
        fromJS(
          mapCreateProcesses(state.get('processListObj').toJS(), [
            {
              progressId: action.progressId,
              target: '',
            },
          ]),
        ),
      );
      return state.setIn(
        ['processListObj', action.progressId],
        fromJS(action.processObj),
      );
    }
    case CREATE_PROCESSES:
      return state.set(
        'processListObj',
        fromJS(
          mapCreateProcesses(
            state.get('processListObj').toJS(),
            action.processLists,
          ),
        ),
      );
    case STOP_PROCESSES:
      return state.set(
        'processListObj',
        fromJS(
          mapStopProcesses(
            state.get('processListObj').toJS(),
            action.processIds,
          ),
        ),
      );
    case CLEAR_PROCESSES:
      return state.set(
        'processListObj',
        mapRemoveProcesses(action.processListObj, action.processIds),
      );
    case PUSH_PROCESSOBJ: {
      // console.log(
      //   'PUSH',
      //   state
      //     .setIn(
      //       ['storedProcessListObj', action.pageName],
      //       storeProcessListObj(action.data),
      //     )
      //     .toJS().storedProcessListObj,
      // );
      return state.setIn(
        ['storedProcessListObj', action.pageName],
        storeProcessListObj(action.data),
      );
    }
    case POP_PROCESSOBJ: {
      // console.log(
      //   'POP',
      //   state
      //     .setIn(
      //       ['storedProcessListObj', action.pageName],
      //       removeProcessListObj(
      //         action.data,
      //         state.getIn(
      //           ['storedProcessListObj', action.pageName],
      //           fromJS({}),
      //         ),
      //       ),
      //     )
      //     .toJS().storedProcessListObj,
      // );
      return state.setIn(
        ['storedProcessListObj', action.pageName],
        removeProcessListObj(
          action.data,
          state.getIn(['storedProcessListObj', action.pageName], fromJS({})),
        ),
      );
    }
    case GET_ACCOUNT_TZ_SUCCESS:
      return state.set('accountTimezone', action.data);
    default:
      return state;
  }
}

export default appReducer;

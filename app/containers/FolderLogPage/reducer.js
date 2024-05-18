import { fromJS } from 'immutable';

import { LOAD_SUCCES } from '../App/constants';
import {
  CHANGE_GROUP_MODEL,
  CHANGE_MEETING_MODEL,
  CHANGE_PAGE_NUMBER_FOLDER_LOG,
  CHANGE_PAGE_NUMBER_WORK_LOG,
  CHANGE_PAGE_SIZE_FOLDER_LOG,
  CHANGE_PAGE_SIZE_WORK_LOG,
  CHANGE_WORK_LOG_MODEL,
  CLEAR_MODAL_GROUP,
  CREATE_MEETING_SUCCESS,
  CREATE_WORK_LOG_SUCCESS,
  DELETE_DAILY_REPORT_SUCCESS,
  DELETE_MEETING_SUCCESS,
  DELETE_MULTIPLE_FOLDER_LOG_SUCCESS,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_WORK_LOG_SUCCESS,
  EDIT_MEETING_SUCCESS,
  EDIT_WORK_LOG_SUCCESS,
  GET_FOLDER_LOG_SUCCESS,
  GET_GROUP_DETAIL_SUCCESS,
  GET_MEETING_DETAIL_SUCCESS,
  GET_SELECT_FOLDER_LOG_ITEM_SUCCESS,
  GET_SORT_DIRECTION_WORK_LOG_LIST,
  GET_SORT_WORK_LOG_LIST,
  GET_USER_DATA_SUCCESS,
  GET_WORK_LOG_DATA_SUCCESS,
  GET_WORK_LOG_DETAIL_SUCCESS,
  RESET_ALL_DATA,
  SAVE_FOLDER_LOG_SUCCESS,
  SELECT_FOLDER_LOG_ITEM,
  SET_ACCOUNT_LIST,
  SET_FOLDER_LOG_META,
  SET_META_WORK_LOG,
  SET_SEARCH_DATA,
  VALIDATE_FOLDER_LOG,
  VALIDATE_GROUP_ERROR,
} from './constants';
import {
  mergeMetaPaging,
  mergeState,
  // remakeUnassignedMasterData,
  sortPredicate,
} from './folderLogUtilities';

export const initialState = fromJS({
  isEditDoorModalOpen: false,
  isUserModalOpen: false,
  currentGroupId: [0],
  groupModel: {
    name: { value: '', errorMessage: false },
    description: { value: '', errorMessage: false },
    parentId: { value: 0, errorMessage: false },
    parentFolderLogItem: { value: [], errorMessage: false },
  },
  groupData: [],
  folderSelect: [],
  accountList: [],
  searchData: [],
  ajaxSuccess: { value: false, message: '' },
  groupPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'asc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 'name',
  },
  // work
  workLogModel: {
    id: { value: 0, errorMessage: false },
    title: { value: '', errorMessage: false },
    content: { value: '', errorMessage: false },
    startDate: { value: '', errorMessage: false },
    endDate: { value: '', errorMessage: false },
    folderLogId: { value: 0, errorMessage: false },
    userId: { value: 0, errorMessage: false },
  },
  userData: [],
  workLogData: [],
  metaPagingWorkLog: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'asc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 'title',
  },

  // meeting
  meetingModel: {
    id: { value: 0, errorMessage: false },
    title: { value: '', errorMessage: false },
    content: { value: '', errorMessage: false },
    startDate: { value: '', errorMessage: false },
    endDate: { value: '', errorMessage: false },
    folderLogId: { value: 0, errorMessage: false },
    meetingRoomId: { value: null, errorMessage: false },
  },
});

export default function groupAccessReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_MODAL_GROUP:
      return state.set(
        'groupModel',
        fromJS({
          name: { value: '', errorMessage: false },
          description: { value: '', errorMessage: false },
          parentId: { value: 0, errorMessage: false },
          parentFolderLogItem: {
            value: state.get('groupData'),
            errorMessage: false,
          },
        }),
      );

    case DELETE_MULTIPLE_FOLDER_LOG_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );

    case GET_SELECT_FOLDER_LOG_ITEM_SUCCESS:
      return state.set('folderSelect', action.folderSelect);
    case SET_SEARCH_DATA:
      return state.set('searchData', action.searchData);

    case LOAD_SUCCES:
      return state.set('ajaxSuccess', fromJS({ value: false, message: '' }));
    case GET_GROUP_DETAIL_SUCCESS:
      return state
        .set('groupModel', fromJS(action.groupDetail))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));
    case SAVE_FOLDER_LOG_SUCCESS:
      return state.mergeIn(
        ['ajaxSuccess'],
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_GROUP_ERROR:
      return state.set(
        'groupModel',
        fromJS(mergeState(state.toJS().groupModel, action.errors)),
      );
    case VALIDATE_FOLDER_LOG:
      return state.set(
        'groupModel',
        fromJS(mergeState(state.toJS().groupModel, action.errors)),
      );
    case CHANGE_GROUP_MODEL:
      return state.setIn(['groupModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_FOLDER_LOG_SUCCESS:
      return state
        .set('groupData', action.datas.sort(sortPredicate))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));
    case SET_ACCOUNT_LIST:
      return state.set('accountList', action.accountList);
    // ***************************************
    case SET_FOLDER_LOG_META:
      return state.mergeIn(['groupPaging'], action.meta);
    case CHANGE_PAGE_NUMBER_FOLDER_LOG:
      return state.setIn(['groupPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_FOLDER_LOG:
      return state.setIn(['groupPaging', 'pageSize'], action.pageSize);

    case RESET_ALL_DATA:
      return initialState;
    case SELECT_FOLDER_LOG_ITEM:
      return state.set('currentGroupId', action.ids);

    // work log
    case GET_WORK_LOG_DETAIL_SUCCESS:
      return state.set('workLogModel', fromJS(action.workLogModel));
    case CHANGE_WORK_LOG_MODEL:
      return state.setIn(['workLogModel', action.name], {
        value: action.value,
        errorMessage: false,
      });

    case DELETE_WORK_LOG_SUCCESS:
    case EDIT_WORK_LOG_SUCCESS:
    case CREATE_WORK_LOG_SUCCESS:
    case DELETE_DAILY_REPORT_SUCCESS:
    case DELETE_SCHEDULE_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case GET_WORK_LOG_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('workLogData', action.data);
    case GET_USER_DATA_SUCCESS:
      return state.set('userData', action.data);
    case CHANGE_PAGE_NUMBER_WORK_LOG:
      return state.setIn(
        ['metaPagingWorkLog', 'pageNumber'],
        action.pageNumber,
      );
    case CHANGE_PAGE_SIZE_WORK_LOG:
      return state.setIn(['metaPagingWorkLog', 'pageSize'], action.pageSize);
    case SET_META_WORK_LOG:
      return state.set(
        'metaPagingWorkLog',
        fromJS(mergeMetaPaging(state.toJS().metaPagingWorkLog, action.meta)),
      );
    case GET_SORT_WORK_LOG_LIST:
      return state
        .setIn(['metaPagingWorkLog', 'sortColumn'], action.sortColumn)
        .setIn(
          ['metaPagingWorkLog', 'cloneSortColumn'],
          action.cloneSortColumn,
        );
    case GET_SORT_DIRECTION_WORK_LOG_LIST:
      if (state.getIn(['metaPagingWorkLog', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPagingWorkLog', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPagingWorkLog', 'sortDirection'], 'asc');

    // meeting
    // work log
    case GET_MEETING_DETAIL_SUCCESS:
      return state.set('meetingModel', fromJS(action.meetingModel));
    case CHANGE_MEETING_MODEL:
      return state.setIn(['meetingModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case DELETE_MEETING_SUCCESS:
    case EDIT_MEETING_SUCCESS:
    case CREATE_MEETING_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );

    default:
      return state;
  }
}

import { fromJS } from 'immutable';

import { mapScheduleApiToUI, mergeState } from './scheduleUtilities';
import {
  GET_SCHEDULE_DATA_SUCCESS,
  CHANGE_TEXT_FIELD,
  RESET_SCHEDULE_MODEL,
  MAP_INFO_TO_MODEL,
  TOGGLE_CHECKBOX,
  VALIDATE_SCHEDULE_MODEL,
  VALIDATE_SCHEDULE_ERROR,
  CREATE_SCHEDULE_SUCCESS,
  UPDATE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_MULTIPLE_SCHEDULE_SUCCESS,
  SET_META_SCHEDULE,
  CHANGE_PAGE_NUMBER_SCHEDULE,
  CHANGE_PAGE_SIZE_SCHEDULE,
  OPEN_MODAL,
  CLOSE_MODAL,
  GET_SORT_SCHEDULE,
  GET_SORT_DIRECTION_SCHEDULE,
  VALIDATE_SCHEDULE,
  SET_TYPE_LIST_SCHEDULE,
  SET_CATEGORY_LIST,
  SET_CREATEDBY_LIST,
  SET_DEPARTMENT_LIST,
  SET_CATEGORY_TYPES,
  SET_REMAINING_HOLIDAY
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  isOpenModal: false,
  ajaxSuccess: { value: false, message: '' },
  scheduleModel: {
    id: { value: 0, errorMessage: false },
    title: { value: '', errorMessage: false },
    categoryId: { value: 0, errorMessage: false },
    folderLogId: { value: 0, errorMessage: false },
    content: { value: '', errorMessage: false },
    type: { value: 0, errorMessage: false },
    startDate: { value: null, errorMessage: false },
    endDate: { value: null, errorMessage: false },
    isAllDay: { value: false, errorMessage: false },
  },
  metaPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    sortColumn: 'title',
    orderBy: '',
    pageNumber: 1,
    pageSize: 999999,
  },
  typeList:[],
  categories: [],
  accounts: [],
  departments: [],
  categoryTypes: [],
  remainingHoliday: 0
});

function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return state.set('isOpenModal', true);
    case CLOSE_MODAL:
      return state.set('isOpenModal', false);
    case CHANGE_PAGE_NUMBER_SCHEDULE:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_SCHEDULE:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_SCHEDULE:
      return state.mergeIn(['metaPaging'], action.meta);
    case SET_TYPE_LIST_SCHEDULE:
      return state.set('typeList', action.typeList);
    case SET_CATEGORY_LIST:
      return state.set('categories', action.categories);
    case SET_CREATEDBY_LIST:
      return state.set('accounts', action.accounts);
    case SET_DEPARTMENT_LIST:
      return state.set('departments', action.departments);
    case SET_CATEGORY_TYPES:
      return state.set('categoryTypes', action.categoryTypes);
    case SET_REMAINING_HOLIDAY:
      return state.set('remainingHoliday', action.remainingHoliday);
    case DELETE_MULTIPLE_SCHEDULE_SUCCESS:
    case DELETE_SCHEDULE_SUCCESS:
    case UPDATE_SCHEDULE_SUCCESS:
    case CREATE_SCHEDULE_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: true, message: action.message }))
        .set('isOpenModal', false);
    case VALIDATE_SCHEDULE_MODEL:
      // Client validation
      return state.mergeDeepIn(['scheduleModel'], action.model);
    case VALIDATE_SCHEDULE_ERROR:
      // Error from api
      return state.set(
        'scheduleModel',
        fromJS(mergeState(state.toJS().scheduleModel, action.errors)),
      );
    case VALIDATE_SCHEDULE:
      // Error from api
      return state.set(
        'scheduleModel',
        fromJS(mergeState(state.toJS().scheduleModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(
        ['scheduleModel', action.name],
        fromJS({
          value: action.value,
          errorMessage: false,
        }),
      );
    case RESET_SCHEDULE_MODEL:
      return state.set('scheduleModel', initialState.get('scheduleModel'));
    case MAP_INFO_TO_MODEL:
      return state.set('scheduleModel', fromJS(mapScheduleApiToUI(action.info)));
    case TOGGLE_CHECKBOX:
      return state.updateIn(
        ['scheduleModel', action.name, 'value'],
        value => !value,
      );
    case GET_SCHEDULE_DATA_SUCCESS:
      return state
        .set('data', action.data)
        .set('ajaxSuccess', initialState.get('ajaxSuccess'));

    case GET_SORT_SCHEDULE:
      return state.setIn(['metaPaging', 'sortColumn'], action.sortColumn);

    case GET_SORT_DIRECTION_SCHEDULE:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');

    default:
      return state;
  }
}

export default scheduleReducer;

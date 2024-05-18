import { fromJS } from 'immutable';
import {
  GET_DEPARTMENT,
  SET_DEPARTMENT_SUCCESS,
  SET_META_DEPARTMENT,
  CHANGE_PAGE_NUMBER_DEPARTMENT,
  CHANGE_PAGE_SIZE_DEPARTMENT,
  DELETE_MULTIES_DEPARTMENT_SUCCESS,
  HIDE_NOTIFY_DEPARTMENT,
  DELETE_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_SUCCESS,
  REFRESH_PAGE,
  SHOW_MODAL,
  HIDE_MODAL,
  VALIDATE_DEPARTMENT_ERROR,
  CHANGE_TEXT_FIELD,
  SHOW_MODAL_UPDATE,
  GET_SORTED_DEPARTMENTS,
  GET_SORTED_DIRECTION_DEPARTMENTS,
  RESET_ALL_DATA,
  GET_ACCOUNT_SUCCESS,
  GET_USER_LIST_SUCCESS,
  CHANGE_USER_META,
} from './constants';
import { mergeMetaPaging, reformatHeaders } from '../App/appUtilities';
import { mergeState, reOderData } from './departmentUtilities';

export const initialState = fromJS({
  data: [],
  ajaxSuccess: { value: false, message: '' },
  metaDepartment: {
    recordsTotal: 1,
    recordsFiltered: 1,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 0,
    sortDirection: 'desc',
    search: null,
  },
  refresh: false,
  isOpenModal: false,
  departmentModel: {
    number: { value: '', errorMessage: false },
    name: { value: '', errorMessage: false },
    departmentManagerId: { value: '', errorMessage: false },
  },
  accounts: [],
  userData: [],
  userMeta: {
    recordsTotal: 1,
    recordsFiltered: 1,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 'name',
    sortDirection: 'asc',
    search: '',
  },
  userHeader: [],
});

function departmentReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DEPARTMENT:
      return state.set('refresh', false);
    case SET_DEPARTMENT_SUCCESS:
      return state.set('data', reOderData(action.data));
    case SET_META_DEPARTMENT:
      return state.set(
        'metaDepartment',
        fromJS(mergeMetaPaging(state.toJS().metaDepartment, action.meta)),
      );
    case DELETE_MULTIES_DEPARTMENT_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );

    case ADD_DEPARTMENT_SUCCESS:
    case UPDATE_DEPARTMENT_SUCCESS:
    case DELETE_DEPARTMENT_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case HIDE_NOTIFY_DEPARTMENT:
      return state.set('ajaxSuccess', fromJS({ value: false, message: '' }));
    case CHANGE_PAGE_NUMBER_DEPARTMENT:
      return state.setIn(['metaDepartment', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_DEPARTMENT:
      return state.setIn(['metaDepartment', 'pageSize'], action.pageSize);
    case REFRESH_PAGE:
      return state.set('refresh', true);
    case SHOW_MODAL:
      return state
        .setIn(['departmentModel', 'number'], {
          value: '',
          errorMessage: false,
        })
        .setIn(['departmentModel', 'name'], {
          value: '',
          errorMessage: false,
        })
        .set('isOpenModal', true);
    case SHOW_MODAL_UPDATE:
      return state
        .setIn(['departmentModel', 'number'], {
          value: action.number,
          errorMessage: false,
        })
        .setIn(['departmentModel', 'name'], {
          value: action.name,
          errorMessage: false,
        })
        .setIn(['departmentModel', 'departmentManagerId'], {
          value: action.departmentManagerId,
          errorMessage: false,
        })
        .set('isOpenModal', true);
    case HIDE_MODAL:
      return state.set('isOpenModal', false);
    case VALIDATE_DEPARTMENT_ERROR:
      return state.set(
        'departmentModel',
        fromJS(mergeState(state.toJS().departmentModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['departmentModel', action.name], {
        value: action.value,
        errorMessage: false,
      });

    case GET_SORTED_DEPARTMENTS:
      return state.setIn(['metaDepartment', 'sortColumn'], action.sortColumn);

    case GET_SORTED_DIRECTION_DEPARTMENTS:
      if (state.getIn(['metaDepartment', 'sortDirection']) === 'asc') {
        return state.setIn(['metaDepartment', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaDepartment', 'sortDirection'], 'asc');
    case RESET_ALL_DATA:
      return initialState;
    case GET_ACCOUNT_SUCCESS:
      return state.set('accounts', action.accounts);
    case GET_USER_LIST_SUCCESS:
      console.log(action);
      if (action.header) {
        return state
          .set('userData', fromJS(action.data))
          .set(
            'userMeta',
            fromJS(mergeMetaPaging(state.toJS().userMeta, action.meta)),
          )
          .set('userHeader', fromJS(reformatHeaders(action.header)));
      }
      return state
        .set('userData', fromJS(action.data))
        .set(
          'userMeta',
          fromJS(mergeMetaPaging(state.toJS().userMeta, action.meta)),
        );
    case CHANGE_USER_META:
      if (action.name === 'sortDirection') {
        if (state.getIn(['userMeta', 'sortDirection']) === 'asc') {
          return state.setIn(['userMeta', 'sortDirection'], 'desc');
        }
        return state.setIn(['userMeta', 'sortDirection'], 'asc');
      }
      return state.setIn(['userMeta', action.name], action.value);
    default:
      return state;
  }
}

export default departmentReducer;

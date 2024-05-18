import { fromJS } from 'immutable';

import { mapCategoryApiToUI, mergeState } from './categoryUtilities';
import {
  GET_CATEGORY_DATA_SUCCESS,
  CHANGE_TEXT_FIELD,
  RESET_CATEGORY_MODEL,
  MAP_INFO_TO_MODEL,
  TOGGLE_CHECKBOX,
  VALIDATE_CATEGORY_MODEL,
  VALIDATE_CATEGORY_ERROR,
  CREATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  DELETE_MULTIPLE_CATEGORY_SUCCESS,
  SET_META_CATEGORY,
  CHANGE_PAGE_NUMBER_CATEGORY,
  CHANGE_PAGE_SIZE_CATEGORY,
  OPEN_MODAL,
  CLOSE_MODAL,
  GET_SORT_CATEGORY,
  GET_SORT_DIRECTION_CATEGORY,
  VALIDATE_CATEGORY,
  SET_TYPE_LIST_CATEGORY
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  isOpenModal: false,
  ajaxSuccess: { value: false, message: '' },
  categoryModel: {
    id: { value: 0, errorMessage: false },
    name: { value: '', errorMessage: false },
    type: { value: 0, errorMessage: false },
    description: { value: '', errorMessage: false },
    color: { value: '#F17013FF', errorMessage: false },
  },
  metaPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    sortColumn: 'name',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  },
  typeList:[]
});

function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return state.set('isOpenModal', true);
    case CLOSE_MODAL:
      return state.set('isOpenModal', false);
    case CHANGE_PAGE_NUMBER_CATEGORY:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_CATEGORY:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_CATEGORY:
      return state.mergeIn(['metaPaging'], action.meta);
    case SET_TYPE_LIST_CATEGORY:
      return state.set('typeList', action.typeList);
    case DELETE_MULTIPLE_CATEGORY_SUCCESS:
    case DELETE_CATEGORY_SUCCESS:
    case UPDATE_CATEGORY_SUCCESS:
    case CREATE_CATEGORY_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: true, message: action.message }))
        .set('isOpenModal', false);
    case VALIDATE_CATEGORY_MODEL:
      // Client validation
      return state.mergeDeepIn(['categoryModel'], action.model);
    case VALIDATE_CATEGORY_ERROR:
      // Error from api
      return state.set(
        'categoryModel',
        fromJS(mergeState(state.toJS().categoryModel, action.errors)),
      );
    case VALIDATE_CATEGORY:
      // Error from api
      return state.set(
        'categoryModel',
        fromJS(mergeState(state.toJS().categoryModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(
        ['categoryModel', action.name],
        fromJS({
          value: action.value,
          errorMessage: false,
        }),
      );
    case RESET_CATEGORY_MODEL:
      return state.set('categoryModel', initialState.get('categoryModel'));
    case MAP_INFO_TO_MODEL:
      return state.set('categoryModel', fromJS(mapCategoryApiToUI(action.info)));
    case TOGGLE_CHECKBOX:
      return state.updateIn(
        ['categoryModel', action.name, 'value'],
        value => !value,
      );
    case GET_CATEGORY_DATA_SUCCESS:
      return state
        .set('data', action.data)
        .set('ajaxSuccess', initialState.get('ajaxSuccess'));

    case GET_SORT_CATEGORY:
      return state.setIn(['metaPaging', 'sortColumn'], action.sortColumn);

    case GET_SORT_DIRECTION_CATEGORY:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');

    default:
      return state;
  }
}

export default categoryReducer;

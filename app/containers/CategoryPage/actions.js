import {
  GET_CATEGORY,
  GET_CATEGORY_DATA_SUCCESS,
  GET_CATEGORY_INFO,
  UPDATE_CATEGORY,
  ADD_CATEGORY,
  RESET_CATEGORY_MODEL,
  MAP_INFO_TO_MODEL,
  CHANGE_TEXT_FIELD,
  TOGGLE_CHECKBOX,
  DELETE_CATEGORY_ROW,
  VALIDATE_CATEGORY_MODEL,
  VALIDATE_CATEGORY_ERROR,
  CREATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  SET_META_CATEGORY,
  DELETE_MULTIPLE_CATEGORY,
  DELETE_MULTIPLE_CATEGORY_SUCCESS,
  CHANGE_PAGE_NUMBER_CATEGORY,
  CHANGE_PAGE_SIZE_CATEGORY,
  OPEN_MODAL,
  CLOSE_MODAL,
  GET_SORT_CATEGORY,
  GET_SORT_DIRECTION_CATEGORY,
  VALIDATE_CATEGORY,
  SET_TYPE_LIST_CATEGORY,
  GET_CATEGORY_INIT
} from './constants';

export function openModal() {
  return { type: OPEN_MODAL };
}
export function closeModal() {
  return { type: CLOSE_MODAL };
}

/**
 * Get category data when init page
 * @param {Object.<string, string>} queries - Info like page size, page number, search queries, etc...
 * @return {Object} An action Object with a type of GET_CATEGORY
 */
export function getCategoryData(queries) {
  return { type: GET_CATEGORY, queries };
}

/**
 * @param {Object.<string, any>} data response from api remote
 * @return {Object.<string, any>} An action Object with a type of GET_CATEGORY_DATA_SUCCESS
 */
export function getCategoryDataSuccess(data) {
  return {
    type: GET_CATEGORY_DATA_SUCCESS,
    data,
  };
}

/**
 * @param {number} id - Category id
 * @return {Object} An action Object with a type of GET_CATEGORY_INFO
 */
export function getCategoryInfo(id) {
  return { type: GET_CATEGORY_INFO, id };
}

/**
 * Get category data when init page
 *
 * @param {Object} meta contains info paging
 * @return {Object} An action Object with a type of GET_CATEGORY_DATA_SUCCESS
 */
export function setMetaPagingCategory(meta) {
  return {
    type: SET_META_CATEGORY,
    meta,
  };
}

/**
 * @param {string} id - Id of updated category
 * @param {Object.<string, string>} category contains updated info
 */
export function putCategoryUpdate(id, category) {
  return {
    type: UPDATE_CATEGORY,
    category,
    id,
  };
}
export function setTypeListCategory(typeList) {
  return {
    type: SET_TYPE_LIST_CATEGORY,
    typeList,
  };
}
/**
 * @param {Object.<string, string>} category contains newly created category info
 */
export function postCategoryAdd(
  category,
  callBack = () => {},
  errorCallBack = () => {},
) {
  return {
    type: ADD_CATEGORY,
    category,
    callBack,
    errorCallBack,
  };
}

/**
 * @param {string} name - name of field
 * @param {string} value - value of field
 */
export function changeTextField(name, value) {
  return {
    type: CHANGE_TEXT_FIELD,
    name,
    value,
  };
}

/**
 * Reset categoryModel back to empty state
 */
export function resetCategoryModel() {
  return { type: RESET_CATEGORY_MODEL };
}

/**
 * @param {Object.<string, any>} info - Object contains category info
 */
export function mapInfoToModel(info) {
  return {
    type: MAP_INFO_TO_MODEL,
    info,
  };
}

/**
 * @param {string} name - Name of checkbox
 */
export function toggleCheckbox(name) {
  return {
    type: TOGGLE_CHECKBOX,
    name,
  };
}

/**
 * @param {number} id - id of deleted category
 */
export function deleteCategory(id) {
  return {
    type: DELETE_CATEGORY_ROW,
    id,
  };
}
export function getCategoryInit() {
  return {
    type: GET_CATEGORY_INIT,
  };
}

/**
 * @param {number[]} ids - ids of deleted category
 */
export function deleteMultipleCategory(ids) {
  return {
    type: DELETE_MULTIPLE_CATEGORY,
    ids,
  };
}

/**
 * @param {number} pageNumber
 */
export function changePageNumberCategory(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_CATEGORY,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeCategory(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_CATEGORY,
    pageSize,
  };
}

/**
 * @param {Object.<string, Object>} model - Object contains new error messages
 */
export function validateModel(model) {
  return {
    type: VALIDATE_CATEGORY_MODEL,
    model,
  };
}

/**
 * @param(errors) Object: Object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_CATEGORY_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createCategorySuccess(message) {
  return {
    type: CREATE_CATEGORY_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateCategorySuccess(message) {
  return {
    type: UPDATE_CATEGORY_SUCCESS,
    message,
  };
}

/**
 * @param {string} message return from server when delete success
 * @param {number} id - id of deleted category
 */
export function deleteCategorySuccess(message) {
  return {
    type: DELETE_CATEGORY_SUCCESS,
    message,
  };
}

/**
 * @param {string} message return from server when delete success
 * @param {number[]} ids - ids of deleted category
 */
export function deleteMultipleCategorySuccess(message) {
  return {
    type: DELETE_MULTIPLE_CATEGORY_SUCCESS,
    message,
  };
}

export function getSortCategory(sortColumn) {
  return {
    type: GET_SORT_CATEGORY,
    sortColumn,
  };
}

export function getSortDirectionCategory() {
  return {
    type: GET_SORT_DIRECTION_CATEGORY,
  };
}

export function validateCategory(errors) {
  return {
    type: VALIDATE_CATEGORY,
    errors,
  };
}

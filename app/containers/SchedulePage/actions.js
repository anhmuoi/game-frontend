import {
    GET_SCHEDULE,
    GET_SCHEDULE_DATA_SUCCESS,
    GET_SCHEDULE_INFO,
    UPDATE_SCHEDULE,
    ADD_SCHEDULE,
    RESET_SCHEDULE_MODEL,
    MAP_INFO_TO_MODEL,
    CHANGE_TEXT_FIELD,
    TOGGLE_CHECKBOX,
    DELETE_SCHEDULE_ROW,
    VALIDATE_SCHEDULE_MODEL,
    VALIDATE_SCHEDULE_ERROR,
    CREATE_SCHEDULE_SUCCESS,
    UPDATE_SCHEDULE_SUCCESS,
    DELETE_SCHEDULE_SUCCESS,
    SET_META_SCHEDULE,
    DELETE_MULTIPLE_SCHEDULE,
    DELETE_MULTIPLE_SCHEDULE_SUCCESS,
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
    GET_SCHEDULE_INIT,
    GET_REMAINING_HOLIDAY,
    SET_REMAINING_HOLIDAY
  } from './constants';
  
  export function openModal() {
    return { type: OPEN_MODAL };
  }
  export function closeModal() {
    return { type: CLOSE_MODAL };
  }
  
  /**
   * Get schedule data when init page
   * @param {Object.<string, string>} queries - Info like page size, page number, search queries, etc...
   * @return {Object} An action Object with a type of GET_SCHEDULE
   */
  export function getScheduleData(queries) {
    return { type: GET_SCHEDULE, queries };
  }
  
  /**
   * @param {Object.<string, any>} data response from api remote
   * @return {Object.<string, any>} An action Object with a type of GET_SCHEDULE_DATA_SUCCESS
   */
  export function getScheduleDataSuccess(data) {
    return {
      type: GET_SCHEDULE_DATA_SUCCESS,
      data,
    };
  }
  
  /**
   * @param {number} id - Schedule id
   * @return {Object} An action Object with a type of GET_SCHEDULE_INFO
   */
  export function getScheduleInfo(id) {
    return { type: GET_SCHEDULE_INFO, id };
  }
  
  /**
   * Get schedule data when init page
   *
   * @param {Object} meta contains info paging
   * @return {Object} An action Object with a type of GET_SCHEDULE_DATA_SUCCESS
   */
  export function setMetaPagingSchedule(meta) {
    return {
      type: SET_META_SCHEDULE,
      meta,
    };
  }
  
  /**
   * @param {string} id - Id of updated schedule
   * @param {Object.<string, string>} schedule contains updated info
   */
  export function putScheduleUpdate(id, schedule) {
    return {
      type: UPDATE_SCHEDULE,
      schedule,
      id,
    };
  }
  export function setTypeListSchedule(typeList) {
    return {
      type: SET_TYPE_LIST_SCHEDULE,
      typeList,
    };
  }
  export function setCategoryList(categories) {
    return {
      type: SET_CATEGORY_LIST,
      categories,
    };
  }
  export function setCreatedBy(accounts) {
    return {
      type: SET_CREATEDBY_LIST,
      accounts,
    };
  }
  export function setDepartments(departments) {
    return {
      type: SET_DEPARTMENT_LIST,
      departments,
    };
  }
  export function setCategoryTypes(categoryTypes) {
    return {
      type: SET_CATEGORY_TYPES,
      categoryTypes,
    };
  }
  export function setRemainingHoliday(remainingHoliday) {
    return {
      type: SET_REMAINING_HOLIDAY,
      remainingHoliday,
    };
  }
  /**
   * @param {Object.<string, string>} schedule contains newly created schedule info
   */
  export function postScheduleAdd(
    schedule,
    callBack = () => {},
    errorCallBack = () => {},
  ) {
    return {
      type: ADD_SCHEDULE,
      schedule,
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
   * Reset scheduleModel back to empty state
   */
  export function resetScheduleModel() {
    return { type: RESET_SCHEDULE_MODEL };
  }
  
  /**
   * @param {Object.<string, any>} info - Object contains schedule info
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
   * @param {number} id - id of deleted schedule
   */
  export function deleteSchedule(id) {
    return {
      type: DELETE_SCHEDULE_ROW,
      id,
    };
  }
  export function getScheduleInit() {
    return {
      type: GET_SCHEDULE_INIT,
    };
  }
  export function getRemainingHoliday() {
    return {
      type: GET_REMAINING_HOLIDAY,
    };
  }
  
  /**
   * @param {number[]} ids - ids of deleted schedule
   */
  export function deleteMultipleSchedule(ids) {
    return {
      type: DELETE_MULTIPLE_SCHEDULE,
      ids,
    };
  }
  
  /**
   * @param {number} pageNumber
   */
  export function changePageNumberSchedule(pageNumber) {
    return {
      type: CHANGE_PAGE_NUMBER_SCHEDULE,
      pageNumber,
    };
  }
  
  /**
   * @param(pageSize) number
   */
  export function changePageSizeSchedule(pageSize) {
    return {
      type: CHANGE_PAGE_SIZE_SCHEDULE,
      pageSize,
    };
  }
  
  /**
   * @param {Object.<string, Object>} model - Object contains new error messages
   */
  export function validateModel(model) {
    return {
      type: VALIDATE_SCHEDULE_MODEL,
      model,
    };
  }
  
  /**
   * @param(errors) Object: Object contains error info validation
   */
  export function invalidModel(errors) {
    return {
      type: VALIDATE_SCHEDULE_ERROR,
      errors,
    };
  }
  
  /**
   * @param(message) string: message return from server when create success
   */
  export function createScheduleSuccess(message) {
    return {
      type: CREATE_SCHEDULE_SUCCESS,
      message,
    };
  }
  
  /**
   * @param(message) string: message return from server when update success
   */
  export function updateScheduleSuccess(message) {
    return {
      type: UPDATE_SCHEDULE_SUCCESS,
      message,
    };
  }
  
  /**
   * @param {string} message return from server when delete success
   * @param {number} id - id of deleted schedule
   */
  export function deleteScheduleSuccess(message) {
    return {
      type: DELETE_SCHEDULE_SUCCESS,
      message,
    };
  }
  
  /**
   * @param {string} message return from server when delete success
   * @param {number[]} ids - ids of deleted schedule
   */
  export function deleteMultipleScheduleSuccess(message) {
    return {
      type: DELETE_MULTIPLE_SCHEDULE_SUCCESS,
      message,
    };
  }
  
  export function getSortSchedule(sortColumn) {
    return {
      type: GET_SORT_SCHEDULE,
      sortColumn,
    };
  }
  
  export function getSortDirectionSchedule() {
    return {
      type: GET_SORT_DIRECTION_SCHEDULE,
    };
  }
  
  export function validateSchedule(errors) {
    return {
      type: VALIDATE_SCHEDULE,
      errors,
    };
  }
  
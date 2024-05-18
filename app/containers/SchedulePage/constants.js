/*
 * ScheduleConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const colorDelete = '#B23535';

export const GET_SCHEDULE = 'demasterpro/Schedule/GET_SCHEDULE';
export const GET_SCHEDULE_DATA_SUCCESS =
  'demasterpro/Schedule/GET_SCHEDULE_DATA_SUCCESS';
export const GET_SCHEDULE_INFO = 'demasterpro/Schedule/GET_SCHEDULE_INFO';
export const UPDATE_SCHEDULE = 'demasterpro/Schedule/UPDATE_SCHEDULE';
export const ADD_SCHEDULE = 'demasterpro/Schedule/ADD_SCHEDULE';
export const CHANGE_TEXT_FIELD = 'demasterpro/Schedule/CHANGE_TEXT_FIELD';
export const RESET_SCHEDULE_MODEL = 'demasterpro/Schedule/RESET_SCHEDULE_MODEL';
export const MAP_INFO_TO_MODEL = 'demasterpro/Schedule/MAP_INFO_TO_MODEL';
export const TOGGLE_CHECKBOX = 'demasterpro/Schedule/TOGGLE_CHECKBOX';
export const DELETE_SCHEDULE_ROW = 'demasterpro/Schedule/DELETE_SCHEDULE_ROW';
export const VALIDATE_SCHEDULE_MODEL =
  'demasterpro/Schedule/VALIDATE_SCHEDULE_MODEL';
export const VALIDATE_SCHEDULE_ERROR =
  'demasterpro/Schedule/VALIDATE_SCHEDULE_ERROR';
export const CREATE_SCHEDULE_SUCCESS =
  'demasterpro/Schedule/CREATE_SCHEDULE_SUCCESS';
export const UPDATE_SCHEDULE_SUCCESS =
  'demasterpro/Schedule/UPDATE_SCHEDULE_SUCCESS';
export const DELETE_SCHEDULE_SUCCESS =
  'demasterpro/Schedule/DELETE_SCHEDULE_SUCCESS';
export const SET_META_SCHEDULE = 'demasterpro/Schedule/SET_META_SCHEDULE';
export const DELETE_MULTIPLE_SCHEDULE =
  'demasterpro/Schedule/DELETE_MULTIPLE_SCHEDULE';
export const DELETE_MULTIPLE_SCHEDULE_SUCCESS =
  'demasterpro/Schedule/DELETE_MULTIPLE_SCHEDULE_SUCCESS';

export const CHANGE_PAGE_NUMBER_SCHEDULE =
  'demasterpro/Schedule/CHANGE_PAGE_NUMBER_SCHEDULE';
export const CHANGE_PAGE_SIZE_SCHEDULE =
  'demasterpro/Schedule/CHANGE_PAGE_SIZE_SCHEDULE';

export const OPEN_MODAL = 'demasterpro/Schedule/OPEN_MODAL';
export const CLOSE_MODAL = 'demasterpro/Schedule/CLOSE_MODAL';

export const GET_SORT_SCHEDULE = 'demasterpro/Schedule/GET_SORT_SCHEDULE';
export const GET_SORT_DIRECTION_SCHEDULE =
  'demasterpro/Schedule/GET_SORT_DIRECTION_SCHEDULE';
export const VALIDATE_SCHEDULE = 'demasterpro/Schedule/VALIDATE_SCHEDULE';
export const GET_PUBLIC_SCHEDULES = 'demasterpro/Schedule/GET_PUBLIC_SCHEDULES';
export const GET_SCHEDULE_INIT = 'demasterpro/Schedule/GET_SCHEDULE_INIT';
export const SET_TYPE_LIST_SCHEDULE = 'demasterpro/Schedule/SET_TYPE_LIST_SCHEDULE';
export const SET_CATEGORY_LIST = 'demasterpro/Schedule/SET_CATEGORY_LIST';
export const SET_CREATEDBY_LIST = 'demasterpro/Schedule/SET_CREATEDBY_LIST';
export const SET_DEPARTMENT_LIST = 'demasterpro/Schedule/SET_DEPARTMENT_LIST';
export const SET_CATEGORY_TYPES = 'demasterpro/Schedule/SET_CATEGORY_TYPES';
export const GET_REMAINING_HOLIDAY = 'demasterpro/Schedule/GET_REMAINING_HOLIDAY';
export const SET_REMAINING_HOLIDAY = 'demasterpro/Schedule/SET_REMAINING_HOLIDAY';
export const SCHEDULE_TYPES = {
  PUBLIC: 0,
  PRIVATE: 1
}
export const CATEGORY_TYPES = {
  SCHEDULE: 0,
  HOLIDAY: 1
}

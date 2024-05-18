/*
 * USERConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_USER_DATA_SUCCESS = 'demasterpro/USER/GET_USER_DATA_SUCCESS';
export const UPDATE_USER = 'demasterpro/USER/UPDATE_USER';
export const ADD_USER = 'demasterpro/USER/ADD_USER';
export const INIT_INDEX_USER = 'demasterpro/USER/INIT_INDEX_USER';
export const INIT_INDEX_USER_SUCCESS =
  'demasterpro/USER/INIT_INDEX_USER_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/USER/CHANGE_TEXT_FIELD';
export const DELETE_USER_ROW = 'demasterpro/USER/DELETE_USER_ROW';
export const VALIDATE_USER_ERROR = 'demasterpro/USER/VALIDATE_USER_ERROR';
export const CREATE_USER_SUCCESS = 'demasterpro/USER/CREATE_USER_SUCCESS';
export const UPDATE_USER_SUCCESS = 'demasterpro/USER/UPDATE_USER_SUCCESS';
export const DELETE_USER_SUCCESS = 'demasterpro/USER/DELETE_USER_SUCCESS';
export const SET_META_USER = 'demasterpro/USER/SET_META_USER';
export const DELETE_MULTIES_USER = 'demasterpro/USER/DELETE_MULTIES_USER';
export const DELETE_MULTIES_USER_SUCCESS =
  'demasterpro/USER/DELETE_MULTIES_USER_SUCCESS';
export const CHANGE_PAGE_NUMBER_USER =
  'demasterpro/USER/CHANGE_PAGE_NUMBER_USER';
export const CHANGE_PAGE_SIZE_USER = 'demasterpro/USER/CHANGE_PAGE_SIZE_USER';
export const FETCH_USER_DATA = 'demasterpro/USER/FETCH_USER_DATA';
export const FETCH_USER_INIT = 'demasterpro/USER/FETCH_USER_INIT';
export const GET_SORT_USER_LIST = 'demasterpro/USER/GET_SORT_USER_LIST';
export const GET_SORT_DIRECTION_USER_LIST =
  'demasterpro/USER/GET_SORT_DIRECTION_USER_LIST';
export const VALIDATE_USER = 'demasterpro/USER/VALIDATE_USER';
export const EXPORT_USER = 'demasterpro/USER/EXPORT_USER';
export const IMPORT_USER = 'demasterpro/USER/IMPORT_USER';
export const SET_STATUS_LIST_USER = 'demasterpro/USER/SET_STATUS_LIST_USER';
export const SET_GENDER_LIST_USER = 'demasterpro/USER/SET_GENDER_LIST_USER';
export const SET_DEPARTMENTS_LIST_USER =
  'demasterpro/USER/SET_DEPARTMENTS_LIST_USER';
export const SET_ROLE_LIST_USER =
  'demasterpro/USER/SET_ROLE_LIST_USER';
export const UPDATE_AVATAR = 'demasterpro/USER/UPDATE_AVATAR';

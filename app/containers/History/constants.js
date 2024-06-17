/*
 * HISTORYConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_HISTORY_DATA_SUCCESS =
  'demasterpro/HISTORY/GET_HISTORY_DATA_SUCCESS';
export const UPDATE_HISTORY = 'demasterpro/HISTORY/UPDATE_HISTORY';
export const ADD_HISTORY = 'demasterpro/HISTORY/ADD_HISTORY';
export const INIT_INDEX_HISTORY = 'demasterpro/HISTORY/INIT_INDEX_HISTORY';
export const INIT_INDEX_HISTORY_SUCCESS =
  'demasterpro/HISTORY/INIT_INDEX_HISTORY_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/HISTORY/CHANGE_TEXT_FIELD';
export const DELETE_HISTORY_ROW = 'demasterpro/HISTORY/DELETE_HISTORY_ROW';
export const VALIDATE_HISTORY_ERROR =
  'demasterpro/HISTORY/VALIDATE_HISTORY_ERROR';
export const CREATE_HISTORY_SUCCESS =
  'demasterpro/HISTORY/CREATE_HISTORY_SUCCESS';
export const UPDATE_HISTORY_SUCCESS =
  'demasterpro/HISTORY/UPDATE_HISTORY_SUCCESS';
export const DELETE_HISTORY_SUCCESS =
  'demasterpro/HISTORY/DELETE_HISTORY_SUCCESS';
export const SET_META_HISTORY = 'demasterpro/HISTORY/SET_META_HISTORY';
export const DELETE_MULTIES_HISTORY =
  'demasterpro/HISTORY/DELETE_MULTIES_HISTORY';
export const DELETE_MULTIES_HISTORY_SUCCESS =
  'demasterpro/HISTORY/DELETE_MULTIES_HISTORY_SUCCESS';
export const CHANGE_PAGE_NUMBER_HISTORY =
  'demasterpro/HISTORY/CHANGE_PAGE_NUMBER_HISTORY';
export const CHANGE_PAGE_SIZE_HISTORY =
  'demasterpro/HISTORY/CHANGE_PAGE_SIZE_HISTORY';
export const FETCH_HISTORY_DATA = 'demasterpro/HISTORY/FETCH_HISTORY_DATA';
export const FETCH_HISTORY_INIT = 'demasterpro/HISTORY/FETCH_HISTORY_INIT';
export const GET_SORT_HISTORY_LIST =
  'demasterpro/HISTORY/GET_SORT_HISTORY_LIST';
export const GET_SORT_DIRECTION_HISTORY_LIST =
  'demasterpro/HISTORY/GET_SORT_DIRECTION_HISTORY_LIST';
export const VALIDATE_HISTORY = 'demasterpro/HISTORY/VALIDATE_HISTORY';
export const SET_STATUS_LIST_HISTORY =
  'demasterpro/HISTORY/SET_STATUS_LIST_HISTORY';
export const SET_GENDER_LIST_HISTORY =
  'demasterpro/HISTORY/SET_GENDER_LIST_HISTORY';
export const SET_DEPARTMENTS_LIST_HISTORY =
  'demasterpro/HISTORY/SET_DEPARTMENTS_LIST_HISTORY';
export const SET_WORKTYPES_LIST_HISTORY =
  'demasterpro/HISTORY/SET_WORKTYPES_LIST_HISTORY';
export const UPDATE_AVATAR = 'demasterpro/HISTORY/UPDATE_AVATAR';
export const SET_STORE_LIST_WAITING =
  'demasterpro/HISTORY/SET_STORE_LIST_WAITING';
export const SET_USER_HISTORY = 'demasterpro/HISTORY/SET_USER_HISTORY';

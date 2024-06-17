/*
 * RANKConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_RANK_DATA_SUCCESS = 'demasterpro/RANK/GET_RANK_DATA_SUCCESS';
export const UPDATE_RANK = 'demasterpro/RANK/UPDATE_RANK';
export const ADD_RANK = 'demasterpro/RANK/ADD_RANK';
export const INIT_INDEX_RANK = 'demasterpro/RANK/INIT_INDEX_RANK';
export const INIT_INDEX_RANK_SUCCESS =
  'demasterpro/RANK/INIT_INDEX_RANK_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/RANK/CHANGE_TEXT_FIELD';
export const DELETE_RANK_ROW = 'demasterpro/RANK/DELETE_RANK_ROW';
export const VALIDATE_RANK_ERROR = 'demasterpro/RANK/VALIDATE_RANK_ERROR';
export const CREATE_RANK_SUCCESS = 'demasterpro/RANK/CREATE_RANK_SUCCESS';
export const UPDATE_RANK_SUCCESS = 'demasterpro/RANK/UPDATE_RANK_SUCCESS';
export const DELETE_RANK_SUCCESS = 'demasterpro/RANK/DELETE_RANK_SUCCESS';
export const SET_META_RANK = 'demasterpro/RANK/SET_META_RANK';
export const DELETE_MULTIES_RANK = 'demasterpro/RANK/DELETE_MULTIES_RANK';
export const DELETE_MULTIES_RANK_SUCCESS =
  'demasterpro/RANK/DELETE_MULTIES_RANK_SUCCESS';
export const CHANGE_PAGE_NUMBER_RANK =
  'demasterpro/RANK/CHANGE_PAGE_NUMBER_RANK';
export const CHANGE_PAGE_SIZE_RANK = 'demasterpro/RANK/CHANGE_PAGE_SIZE_RANK';
export const FETCH_RANK_DATA = 'demasterpro/RANK/FETCH_RANK_DATA';
export const FETCH_RANK_INIT = 'demasterpro/RANK/FETCH_RANK_INIT';
export const GET_SORT_RANK_LIST = 'demasterpro/RANK/GET_SORT_RANK_LIST';
export const GET_SORT_DIRECTION_RANK_LIST =
  'demasterpro/RANK/GET_SORT_DIRECTION_RANK_LIST';
export const VALIDATE_RANK = 'demasterpro/RANK/VALIDATE_RANK';
export const SET_STATUS_LIST_RANK = 'demasterpro/RANK/SET_STATUS_LIST_RANK';
export const SET_GENDER_LIST_RANK = 'demasterpro/RANK/SET_GENDER_LIST_RANK';
export const SET_DEPARTMENTS_LIST_RANK =
  'demasterpro/RANK/SET_DEPARTMENTS_LIST_RANK';
export const SET_WORKTYPES_LIST_RANK =
  'demasterpro/RANK/SET_WORKTYPES_LIST_RANK';
export const UPDATE_AVATAR = 'demasterpro/RANK/UPDATE_AVATAR';
export const SET_STORE_LIST_WAITING = 'demasterpro/RANK/SET_STORE_LIST_WAITING';
export const SET_USER_RANK = 'demasterpro/RANK/SET_USER_RANK';

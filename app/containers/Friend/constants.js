/*
 * FRIENDConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_FRIEND_DATA_SUCCESS =
  'demasterpro/FRIEND/GET_FRIEND_DATA_SUCCESS';
export const UPDATE_FRIEND = 'demasterpro/FRIEND/UPDATE_FRIEND';
export const ADD_FRIEND = 'demasterpro/FRIEND/ADD_FRIEND';
export const INIT_INDEX_FRIEND = 'demasterpro/FRIEND/INIT_INDEX_FRIEND';
export const INIT_INDEX_FRIEND_SUCCESS =
  'demasterpro/FRIEND/INIT_INDEX_FRIEND_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/FRIEND/CHANGE_TEXT_FIELD';
export const DELETE_FRIEND_ROW = 'demasterpro/FRIEND/DELETE_FRIEND_ROW';
export const VALIDATE_FRIEND_ERROR = 'demasterpro/FRIEND/VALIDATE_FRIEND_ERROR';
export const CREATE_FRIEND_SUCCESS = 'demasterpro/FRIEND/CREATE_FRIEND_SUCCESS';
export const UPDATE_FRIEND_SUCCESS = 'demasterpro/FRIEND/UPDATE_FRIEND_SUCCESS';
export const DELETE_FRIEND_SUCCESS = 'demasterpro/FRIEND/DELETE_FRIEND_SUCCESS';
export const SET_META_FRIEND = 'demasterpro/FRIEND/SET_META_FRIEND';
export const DELETE_MULTIES_FRIEND = 'demasterpro/FRIEND/DELETE_MULTIES_FRIEND';
export const DELETE_MULTIES_FRIEND_SUCCESS =
  'demasterpro/FRIEND/DELETE_MULTIES_FRIEND_SUCCESS';
export const CHANGE_PAGE_NUMBER_FRIEND =
  'demasterpro/FRIEND/CHANGE_PAGE_NUMBER_FRIEND';
export const CHANGE_PAGE_SIZE_FRIEND =
  'demasterpro/FRIEND/CHANGE_PAGE_SIZE_FRIEND';
export const FETCH_FRIEND_DATA = 'demasterpro/FRIEND/FETCH_FRIEND_DATA';
export const FETCH_FRIEND_INIT = 'demasterpro/FRIEND/FETCH_FRIEND_INIT';
export const GET_SORT_FRIEND_LIST = 'demasterpro/FRIEND/GET_SORT_FRIEND_LIST';
export const GET_SORT_DIRECTION_FRIEND_LIST =
  'demasterpro/FRIEND/GET_SORT_DIRECTION_FRIEND_LIST';
export const VALIDATE_FRIEND = 'demasterpro/FRIEND/VALIDATE_FRIEND';
export const SET_STATUS_LIST_FRIEND =
  'demasterpro/FRIEND/SET_STATUS_LIST_FRIEND';
export const SET_GENDER_LIST_FRIEND =
  'demasterpro/FRIEND/SET_GENDER_LIST_FRIEND';
export const SET_DEPARTMENTS_LIST_FRIEND =
  'demasterpro/FRIEND/SET_DEPARTMENTS_LIST_FRIEND';
export const SET_WORKTYPES_LIST_FRIEND =
  'demasterpro/FRIEND/SET_WORKTYPES_LIST_FRIEND';
export const UPDATE_AVATAR = 'demasterpro/FRIEND/UPDATE_AVATAR';
export const SET_STORE_LIST_WAITING =
  'demasterpro/FRIEND/SET_STORE_LIST_WAITING';
export const SET_USER_FRIEND = 'demasterpro/FRIEND/SET_USER_FRIEND';

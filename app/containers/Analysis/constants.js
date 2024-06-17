/*
 * ANALYSISConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_ANALYSIS_DATA_SUCCESS =
  'demasterpro/ANALYSIS/GET_ANALYSIS_DATA_SUCCESS';
export const UPDATE_ANALYSIS = 'demasterpro/ANALYSIS/UPDATE_ANALYSIS';
export const ADD_ANALYSIS = 'demasterpro/ANALYSIS/ADD_ANALYSIS';
export const INIT_INDEX_ANALYSIS = 'demasterpro/ANALYSIS/INIT_INDEX_ANALYSIS';
export const INIT_INDEX_ANALYSIS_SUCCESS =
  'demasterpro/ANALYSIS/INIT_INDEX_ANALYSIS_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/ANALYSIS/CHANGE_TEXT_FIELD';
export const DELETE_ANALYSIS_ROW = 'demasterpro/ANALYSIS/DELETE_ANALYSIS_ROW';
export const VALIDATE_ANALYSIS_ERROR =
  'demasterpro/ANALYSIS/VALIDATE_ANALYSIS_ERROR';
export const CREATE_ANALYSIS_SUCCESS =
  'demasterpro/ANALYSIS/CREATE_ANALYSIS_SUCCESS';
export const UPDATE_ANALYSIS_SUCCESS =
  'demasterpro/ANALYSIS/UPDATE_ANALYSIS_SUCCESS';
export const DELETE_ANALYSIS_SUCCESS =
  'demasterpro/ANALYSIS/DELETE_ANALYSIS_SUCCESS';
export const SET_META_ANALYSIS = 'demasterpro/ANALYSIS/SET_META_ANALYSIS';
export const DELETE_MULTIES_ANALYSIS =
  'demasterpro/ANALYSIS/DELETE_MULTIES_ANALYSIS';
export const DELETE_MULTIES_ANALYSIS_SUCCESS =
  'demasterpro/ANALYSIS/DELETE_MULTIES_ANALYSIS_SUCCESS';
export const CHANGE_PAGE_NUMBER_ANALYSIS =
  'demasterpro/ANALYSIS/CHANGE_PAGE_NUMBER_ANALYSIS';
export const CHANGE_PAGE_SIZE_ANALYSIS =
  'demasterpro/ANALYSIS/CHANGE_PAGE_SIZE_ANALYSIS';
export const FETCH_ANALYSIS_DATA = 'demasterpro/ANALYSIS/FETCH_ANALYSIS_DATA';
export const FETCH_ANALYSIS_INIT = 'demasterpro/ANALYSIS/FETCH_ANALYSIS_INIT';
export const GET_SORT_ANALYSIS_LIST =
  'demasterpro/ANALYSIS/GET_SORT_ANALYSIS_LIST';
export const GET_SORT_DIRECTION_ANALYSIS_LIST =
  'demasterpro/ANALYSIS/GET_SORT_DIRECTION_ANALYSIS_LIST';
export const VALIDATE_ANALYSIS = 'demasterpro/ANALYSIS/VALIDATE_ANALYSIS';
export const SET_STATUS_LIST_ANALYSIS =
  'demasterpro/ANALYSIS/SET_STATUS_LIST_ANALYSIS';
export const SET_GENDER_LIST_ANALYSIS =
  'demasterpro/ANALYSIS/SET_GENDER_LIST_ANALYSIS';
export const SET_DEPARTMENTS_LIST_ANALYSIS =
  'demasterpro/ANALYSIS/SET_DEPARTMENTS_LIST_ANALYSIS';
export const SET_WORKTYPES_LIST_ANALYSIS =
  'demasterpro/ANALYSIS/SET_WORKTYPES_LIST_ANALYSIS';
export const UPDATE_AVATAR = 'demasterpro/ANALYSIS/UPDATE_AVATAR';
export const SET_STORE_LIST_WAITING =
  'demasterpro/ANALYSIS/SET_STORE_LIST_WAITING';
export const SET_USER_ANALYSIS = 'demasterpro/ANALYSIS/SET_USER_ANALYSIS';

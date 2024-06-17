/*
 * MARKETConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_MARKET_DATA_SUCCESS =
  'demasterpro/MARKET/GET_MARKET_DATA_SUCCESS';
export const UPDATE_MARKET = 'demasterpro/MARKET/UPDATE_MARKET';
export const ADD_MARKET = 'demasterpro/MARKET/ADD_MARKET';
export const INIT_INDEX_MARKET = 'demasterpro/MARKET/INIT_INDEX_MARKET';
export const INIT_INDEX_MARKET_SUCCESS =
  'demasterpro/MARKET/INIT_INDEX_MARKET_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/MARKET/CHANGE_TEXT_FIELD';
export const DELETE_MARKET_ROW = 'demasterpro/MARKET/DELETE_MARKET_ROW';
export const VALIDATE_MARKET_ERROR = 'demasterpro/MARKET/VALIDATE_MARKET_ERROR';
export const CREATE_MARKET_SUCCESS = 'demasterpro/MARKET/CREATE_MARKET_SUCCESS';
export const UPDATE_MARKET_SUCCESS = 'demasterpro/MARKET/UPDATE_MARKET_SUCCESS';
export const DELETE_MARKET_SUCCESS = 'demasterpro/MARKET/DELETE_MARKET_SUCCESS';
export const SET_META_MARKET = 'demasterpro/MARKET/SET_META_MARKET';
export const DELETE_MULTIES_MARKET = 'demasterpro/MARKET/DELETE_MULTIES_MARKET';
export const DELETE_MULTIES_MARKET_SUCCESS =
  'demasterpro/MARKET/DELETE_MULTIES_MARKET_SUCCESS';
export const CHANGE_PAGE_NUMBER_MARKET =
  'demasterpro/MARKET/CHANGE_PAGE_NUMBER_MARKET';
export const CHANGE_PAGE_SIZE_MARKET =
  'demasterpro/MARKET/CHANGE_PAGE_SIZE_MARKET';
export const FETCH_MARKET_DATA = 'demasterpro/MARKET/FETCH_MARKET_DATA';
export const FETCH_MARKET_INIT = 'demasterpro/MARKET/FETCH_MARKET_INIT';
export const GET_SORT_MARKET_LIST = 'demasterpro/MARKET/GET_SORT_MARKET_LIST';
export const GET_SORT_DIRECTION_MARKET_LIST =
  'demasterpro/MARKET/GET_SORT_DIRECTION_MARKET_LIST';
export const VALIDATE_MARKET = 'demasterpro/MARKET/VALIDATE_MARKET';
export const SET_STATUS_LIST_MARKET =
  'demasterpro/MARKET/SET_STATUS_LIST_MARKET';
export const SET_GENDER_LIST_MARKET =
  'demasterpro/MARKET/SET_GENDER_LIST_MARKET';
export const SET_DEPARTMENTS_LIST_MARKET =
  'demasterpro/MARKET/SET_DEPARTMENTS_LIST_MARKET';
export const SET_WORKTYPES_LIST_MARKET =
  'demasterpro/MARKET/SET_WORKTYPES_LIST_MARKET';
export const UPDATE_AVATAR = 'demasterpro/MARKET/UPDATE_AVATAR';
export const SET_STORE_LIST_WAITING =
  'demasterpro/MARKET/SET_STORE_LIST_WAITING';

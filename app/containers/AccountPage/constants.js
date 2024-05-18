/*
 * AccountConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_ACCOUNT_DATA_SUCCESS =
  'demasterpro/Account/GET_ACCOUNT_DATA_SUCCESS';
export const UPDATE_ACCOUNT = 'demasterpro/Account/UPDATE_ACCOUNT';
export const ADD_ACCOUNT = 'demasterpro/Account/ADD_ACCOUNT';
export const INIT_INDEX_ACCOUNT = 'demasterpro/Account/INIT_INDEX_ACCOUNT';
export const INIT_INDEX_ACCOUNT_SUCCESS =
  'demasterpro/Account/INIT_INDEX_ACCOUNT_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/Account/CHANGE_TEXT_FIELD';
export const DELETE_ACCOUNT_ROW = 'demasterpro/Account/DELETE_ACCOUNT_ROW';
export const VALIDATE_ACCOUNT_ERROR =
  'demasterpro/Account/VALIDATE_ACCOUNT_ERROR';
export const CREATE_ACCOUNT_SUCCESS =
  'demasterpro/Account/CREATE_ACCOUNT_SUCCESS';
export const UPDATE_ACCOUNT_SUCCESS =
  'demasterpro/Account/UPDATE_ACCOUNT_SUCCESS';
export const DELETE_ACCOUNT_SUCCESS =
  'demasterpro/Account/DELETE_ACCOUNT_SUCCESS';
export const SET_META_ACCOUNT = 'demasterpro/Account/SET_META_ACCOUNT';
export const DELETE_MULTIES_ACCOUNT =
  'demasterpro/Account/DELETE_MULTIES_ACCOUNT';
export const DELETE_MULTIES_ACCOUNT_SUCCESS =
  'demasterpro/Account/DELETE_MULTIES_ACCOUNT_SUCCESS';
export const CHANGE_PAGE_NUMBER_ACCOUNT =
  'demasterpro/Account/CHANGE_PAGE_NUMBER_ACCOUNT';
export const CHANGE_PAGE_SIZE_ACCOUNT =
  'demasterpro/Account/CHANGE_PAGE_SIZE_ACCOUNT';
export const FETCH_ACCOUNT_INIT = 'demasterpro/Account/FETCH_ACCOUNT_INIT';
export const GET_SORT_ACCOUNT_LIST =
  'demasterpro/Account/GET_SORT_ACCOUNT_LIST';
export const GET_SORT_DIRECTION_ACCOUNT_LIST =
  'demasterpro/Account/GET_SORT_DIRECTION_ACCOUNT_LIST';
export const VALIDATE_ACCOUNT = 'demasterpro/Account/VALIDATE_ACCOUNT';

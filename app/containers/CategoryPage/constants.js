/*
 * CategoryConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const colorDelete = '#B23535';

export const GET_CATEGORY = 'demasterpro/Category/GET_CATEGORY';
export const GET_CATEGORY_DATA_SUCCESS =
  'demasterpro/Category/GET_CATEGORY_DATA_SUCCESS';
export const GET_CATEGORY_INFO = 'demasterpro/Category/GET_CATEGORY_INFO';
export const UPDATE_CATEGORY = 'demasterpro/Category/UPDATE_CATEGORY';
export const ADD_CATEGORY = 'demasterpro/Category/ADD_CATEGORY';
export const CHANGE_TEXT_FIELD = 'demasterpro/Category/CHANGE_TEXT_FIELD';
export const RESET_CATEGORY_MODEL = 'demasterpro/Category/RESET_CATEGORY_MODEL';
export const MAP_INFO_TO_MODEL = 'demasterpro/Category/MAP_INFO_TO_MODEL';
export const TOGGLE_CHECKBOX = 'demasterpro/Category/TOGGLE_CHECKBOX';
export const DELETE_CATEGORY_ROW = 'demasterpro/Category/DELETE_CATEGORY_ROW';
export const VALIDATE_CATEGORY_MODEL =
  'demasterpro/Category/VALIDATE_CATEGORY_MODEL';
export const VALIDATE_CATEGORY_ERROR =
  'demasterpro/Category/VALIDATE_CATEGORY_ERROR';
export const CREATE_CATEGORY_SUCCESS =
  'demasterpro/Category/CREATE_CATEGORY_SUCCESS';
export const UPDATE_CATEGORY_SUCCESS =
  'demasterpro/Category/UPDATE_CATEGORY_SUCCESS';
export const DELETE_CATEGORY_SUCCESS =
  'demasterpro/Category/DELETE_CATEGORY_SUCCESS';
export const SET_META_CATEGORY = 'demasterpro/Category/SET_META_CATEGORY';
export const DELETE_MULTIPLE_CATEGORY =
  'demasterpro/Category/DELETE_MULTIPLE_CATEGORY';
export const DELETE_MULTIPLE_CATEGORY_SUCCESS =
  'demasterpro/Category/DELETE_MULTIPLE_CATEGORY_SUCCESS';

export const CHANGE_PAGE_NUMBER_CATEGORY =
  'demasterpro/Category/CHANGE_PAGE_NUMBER_CATEGORY';
export const CHANGE_PAGE_SIZE_CATEGORY =
  'demasterpro/Category/CHANGE_PAGE_SIZE_CATEGORY';

export const OPEN_MODAL = 'demasterpro/Category/OPEN_MODAL';
export const CLOSE_MODAL = 'demasterpro/Category/CLOSE_MODAL';

export const GET_SORT_CATEGORY = 'demasterpro/Category/GET_SORT_CATEGORY';
export const GET_SORT_DIRECTION_CATEGORY =
  'demasterpro/Category/GET_SORT_DIRECTION_CATEGORY';
export const VALIDATE_CATEGORY = 'demasterpro/Category/VALIDATE_CATEGORY';
export const GET_PUBLIC_CATEGORYS = 'demasterpro/Category/GET_PUBLIC_CATEGORYS';
export const GET_CATEGORY_INIT = 'demasterpro/Category/GET_CATEGORY_INIT';
export const SET_TYPE_LIST_CATEGORY = 'demasterpro/Category/SET_TYPE_LIST_CATEGORY';

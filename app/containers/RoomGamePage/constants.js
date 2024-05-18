/*
 * ROOM_GAMEConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_ROOM_GAME_DATA_SUCCESS =
  'demasterpro/ROOM_GAME/GET_ROOM_GAME_DATA_SUCCESS';
export const UPDATE_ROOM_GAME = 'demasterpro/ROOM_GAME/UPDATE_ROOM_GAME';
export const ADD_ROOM_GAME = 'demasterpro/ROOM_GAME/ADD_ROOM_GAME';
export const INIT_INDEX_ROOM_GAME =
  'demasterpro/ROOM_GAME/INIT_INDEX_ROOM_GAME';
export const INIT_INDEX_ROOM_GAME_SUCCESS =
  'demasterpro/ROOM_GAME/INIT_INDEX_ROOM_GAME_SUCCESS';
export const CHANGE_TEXT_FIELD = 'demasterpro/ROOM_GAME/CHANGE_TEXT_FIELD';
export const DELETE_ROOM_GAME_ROW =
  'demasterpro/ROOM_GAME/DELETE_ROOM_GAME_ROW';
export const VALIDATE_ROOM_GAME_ERROR =
  'demasterpro/ROOM_GAME/VALIDATE_ROOM_GAME_ERROR';
export const CREATE_ROOM_GAME_SUCCESS =
  'demasterpro/ROOM_GAME/CREATE_ROOM_GAME_SUCCESS';
export const UPDATE_ROOM_GAME_SUCCESS =
  'demasterpro/ROOM_GAME/UPDATE_ROOM_GAME_SUCCESS';
export const DELETE_ROOM_GAME_SUCCESS =
  'demasterpro/ROOM_GAME/DELETE_ROOM_GAME_SUCCESS';
export const SET_META_ROOM_GAME = 'demasterpro/ROOM_GAME/SET_META_ROOM_GAME';
export const DELETE_MULTIES_ROOM_GAME =
  'demasterpro/ROOM_GAME/DELETE_MULTIES_ROOM_GAME';
export const DELETE_MULTIES_ROOM_GAME_SUCCESS =
  'demasterpro/ROOM_GAME/DELETE_MULTIES_ROOM_GAME_SUCCESS';
export const CHANGE_PAGE_NUMBER_ROOM_GAME =
  'demasterpro/ROOM_GAME/CHANGE_PAGE_NUMBER_ROOM_GAME';
export const CHANGE_PAGE_SIZE_ROOM_GAME =
  'demasterpro/ROOM_GAME/CHANGE_PAGE_SIZE_ROOM_GAME';
export const FETCH_ROOM_GAME_DATA =
  'demasterpro/ROOM_GAME/FETCH_ROOM_GAME_DATA';
export const FETCH_ROOM_GAME_INIT =
  'demasterpro/ROOM_GAME/FETCH_ROOM_GAME_INIT';
export const GET_SORT_ROOM_GAME_LIST =
  'demasterpro/ROOM_GAME/GET_SORT_ROOM_GAME_LIST';
export const GET_SORT_DIRECTION_ROOM_GAME_LIST =
  'demasterpro/ROOM_GAME/GET_SORT_DIRECTION_ROOM_GAME_LIST';
export const VALIDATE_ROOM_GAME = 'demasterpro/ROOM_GAME/VALIDATE_ROOM_GAME';
export const SET_STATUS_LIST_ROOM_GAME =
  'demasterpro/ROOM_GAME/SET_STATUS_LIST_ROOM_GAME';
export const SET_GENDER_LIST_ROOM_GAME =
  'demasterpro/ROOM_GAME/SET_GENDER_LIST_ROOM_GAME';
export const SET_DEPARTMENTS_LIST_ROOM_GAME =
  'demasterpro/ROOM_GAME/SET_DEPARTMENTS_LIST_ROOM_GAME';
export const SET_WORKTYPES_LIST_ROOM_GAME =
  'demasterpro/ROOM_GAME/SET_WORKTYPES_LIST_ROOM_GAME';
export const UPDATE_AVATAR = 'demasterpro/ROOM_GAME/UPDATE_AVATAR';
export const SET_STORE_LIST_WAITING =
  'demasterpro/ROOM_GAME/SET_STORE_LIST_WAITING';

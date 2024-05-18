/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const GET_LOGO = 'demasterpro/App/GET_LOGO';
export const LOAD_REPOS = 'demasterpro/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'demasterpro/App/LOAD_REPOS_SUCCESS';
export const SUBMIT_LOGIN = 'demasterpro/Login/SUBMIT_LOGIN';
export const LOGIN_SUCCESS = 'demasterpro/Login/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'demasterpro/Login/LOGIN_ERROR';
export const FETCH_API = 'demasterpro/App/FETCH_API';
export const FETCH_API_ERROR = 'demasterpro/App/FETCH_API_ERROR';
export const INVALID_INPUT_LOGIN = 'demasterpro/Login/INVALID_INPUT_LOGIN';

export const LOAD_SUCCES = 'demasterpro/APP/LOAD_SUCCES';
export const HIDE_SHOW_NOTIFY_GLOBAL =
  'demasterpro/APP/HIDE_SHOW_NOTIFY_GLOBAL';
export const SEND_EMAIL_FORGOT_PASSWORD =
  'demasterpro/APP/SEND_EMAIL_FORGOT_PASSWORD';
export const OPEN_FORGOT_PASS_MODAL = 'demasterpro/APP/OPEN_FORGOT_PASS_MODAL';
export const SEND_EMAIL_SUCCESS = 'demasterpro/APP/SEND_EMAIL_SUCCESS';
export const GET_LOGO_SUCCESS = 'demasterpro/APP/GET_LOGO_SUCCESS';
export const RESET_ENQUEUE = 'demasterpro/APP/RESET_ENQUEUE';
export const NOTIFY_SUCCESS = 'demasterpro/APP/NOTIFY_SUCCESS';
export const RESET_NOTIFY_SUCCESS = 'demasterpro/APP/RESET_NOTIFY_SUCCESS';
export const UPDATE_PROGRESS = 'demasterpro/APP/UPDATE_PROGRESS';
export const CLEAR_PROCESSES = 'demasterpro/APP/CLEAR_PROCESSES';
export const STOP_PROCESSES = 'demasterpro/APP/STOP_PROCESSES';
export const CREATE_PROCESSES = 'demasterpro/APP/CREATE_PROCESSES';
// export const HIDE_PROCESSES = 'demasterpro/APP/HIDE_PROCESSES';
export const PUSH_PROCESSOBJ = 'demasterpro/APP/PUSH_PROCESSOBJ';
export const POP_PROCESSOBJ = 'demasterpro/APP/POP_PROCESSOBJ';
export const GET_ACCOUNT_TZ = 'demasterpro/APP/GET_ACCOUNT_TZ';
export const GET_ACCOUNT_TZ_SUCCESS = 'demasterpro/APP/GET_ACCOUNT_TZ_SUCCESS';
export const PATCH_ACCOUNT_TZ = 'demasterpro/APP/PATCH_ACCOUNT_TZ';
export const PATCH_ACCOUNT_TZ_SUCCESS =
  'demasterpro/APP/PATCH_ACCOUNT_TZ_SUCCESS';
export const PATCH_HEADER_COLUMNS = 'demasterpro/APP/PATCH_HEADER_COLUMNS';

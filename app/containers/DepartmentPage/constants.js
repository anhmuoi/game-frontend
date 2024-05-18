import { fade } from '@material-ui/core/styles/colorManipulator';
// constants for get data
export const GET_DEPARTMENT = 'demasterpro/Department/GET_DEPARTMENT';
export const REFRESH_PAGE = 'demasterpro/Department/REFRESH_PAGE';
export const SET_DEPARTMENT_SUCCESS =
  'demasterpro/Department/SET_DEPARTMENT_SUCCESS';

// constants for update department
export const UPDATE_DEPARTMENT_SUCCESS =
  'demasterpro/Department/UPDATE_DEPARTMENT_SUCCESS';
export const VALIDATE_DEPARTMENT_ERROR =
  'demasterpro/Department/VALIDATE_DEPARTMENT_ERROR';
export const UPDATE_DEPARTMENT = 'demasterpro/Department/UPDATE_DEPARTMENT';

// constants for add and update department
export const SHOW_MODAL = 'demasterpro/Department/SHOW_MODAL';
export const SHOW_MODAL_UPDATE = 'demasterpro/Department/SHOW_MODAL_UPDATE';
export const HIDE_MODAL = 'demasterpro/Department/HIDE_MODAL';

// constants for add department
export const ADD_DEPARTMENT = 'demasterpro/Department/ADD_DEPARTMENT';
export const CHANGE_TEXT_FIELD = 'demasterpro/Department/CHANGE_TEXT_FIELD';
export const ADD_DEPARTMENT_SUCCESS =
  'demasterpro/Department/ADD_DEPARTMENT_SUCCESS';

// constants for show data
export const SET_META_DEPARTMENT = 'demasterpro/Department/SET_META_DEPARTMENT';
export const CHANGE_PAGE_NUMBER_DEPARTMENT =
  'demasterpro/Department/CHANGE_PAGE_NUMBER_DEPARTMENT';
export const CHANGE_PAGE_SIZE_DEPARTMENT =
  'demasterpro/Department/CHANGE_PAGE_SIZE_DEPARTMENT';

// constants for delete department
export const DELETE_DEPARTMENT_ROW =
  'demasterpro/Department/DELETE_DEPARTMENT_ROW';
export const DELETE_DEPARTMENT_SUCCESS =
  'demasterpro/Department/DELETE_DEPARTMENT_SUCCESS';
export const DELETE_MULTIES_DEPARTMENT =
  'demasterpro/Department/DELETE_MULTIES_DEPARTMENT';
export const DELETE_MULTIES_DEPARTMENT_SUCCESS =
  'demasterpro/Department/DELETE_MULTIES_DEPARTMENT_SUCCESS';

// constants for notify
export const HIDE_NOTIFY_DEPARTMENT =
  'demasterpro/Department/HIDE_NOTIFY_DEPARTMENT';
export const EXPORT_DEPARTMENT = 'demasterpro/Department/EXPORT_DEPARTMENT';
export const IMPORT_DEPARTMENT = 'demasterpro/Department/IMPORT_DEPARTMENT';

export const GET_SORTED_DEPARTMENTS =
  'demasterpro/Department/GET_SORTED_DEPARTMENTS';
export const GET_SORTED_DIRECTION_DEPARTMENTS =
  'demasterpro/Department/GET_SORTED_DIRECTION_DEPARTMENTS';
export const RESET_ALL_DATA = 'demasterpro/Department/RESET_ALL_DATA';
export const GET_ACCOUNT_SUCCESS = 'demasterpro/Department/GET_ACCOUNT_SUCCESS';
export const GET_USER_LIST = 'demasterpro/Department/GET_USER_LIST';
export const GET_USER_LIST_SUCCESS =
  'demasterpro/Department/GET_USER_LIST_SUCCESS';
export const CHANGE_USER_META = 'demasterpro/Department/CHANGE_USER_META';

export const styles = (theme) => ({
  hiddenPagingRight: { visibility: 'hidden' },
  noPaddingLeftRight: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  active: { backgroundColor: `${theme.palette.background.default} !important` },
  groupTitle: { textAlign: 'center', fontWeight: 'bold' },
  borderRadius: { borderRadius: 10 },
  halfMarginTop: { marginTop: theme.spacing.unit * 2 },
  halfMarginBottom: { marginBottom: theme.spacing.unit * 2 },
  defaultPadding: {
    padding: theme.spacing.unit * 2,
  },
  defaultBackground: { backgroundColor: theme.palette.background.default },
  halfPaddingRight: { paddingRight: theme.spacing.unit },
  halfPaddingLeft: { paddingLeft: theme.spacing.unit },
  fab: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  modalTitle: {
    marginBottom: theme.spacing.unit,
  },
  warningDialog: {
    width: '40%',
    left: '30%',
  },
  extendTableWrapper: {
    height: 'calc(100vh - 450px)',
  },
  extendTableWrapperAssign: {
    height: 'calc(80vh - 290px)',
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  hiddenDoorList: {
    display: 'none',
  },
  alertDialog: {
    zIndex: 1400,
  },
  normalFontSize: {
    fontSize: '0.85em',
    fontWeight: '700',
  },
  scrollList: { overflow: 'scroll', height: 'calc(100vh - 290px)' },
  hiddenButton: { visibility: 'hidden' },
  headers: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
  },
  headerText: {
    fontWeight: '700',
  },
  list: {
    height: 'calc(100vh - 320px)',
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  title: {
    flex: '0 0 auto',
  },
});

export const modalStyle = { width: '50%' };

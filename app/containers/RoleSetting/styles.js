import { fade } from '@material-ui/core/styles/colorManipulator';
export const styles = (theme) => ({
  defaultPadding: {
    padding: theme.spacing.unit * 2,
  },
  defaultBackground: { backgroundColor: theme.palette.background.default },
  borderRadius: { borderRadius: 10 },
  searchIcon: {
    top: 6,
    width: theme.spacing.unit * 9,
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: '-60px',
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
    // paddingTop: theme.spacing.unit,
    // paddingRight: theme.spacing.unit,
    // paddingBottom: theme.spacing.unit,
    // paddingLeft: theme.spacing.unit * 4,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  fab: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
    pointerEvents: 'auto !important',
    cursor: 'pointer !important',
    boxShadow:
      '0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.07), 0px 1px 18px 0px rgba(0,0,0,0.06)',
  },
  active: { backgroundColor: `${theme.palette.background.default} !important` },
  noPaddingLeftRight: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  halfMarginBottom: { marginBottom: theme.spacing.unit * 2 },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  center: {
    textAlign: 'center',
  },
  panel: { boxShadow: 'none', marginBottom: '3%', paddingTop: '3%' },
  permission: {
    background: '#3b4756',
    color: 'white',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    flexBasis: '100%',
    flexShrink: 0,
    color: 'white',
  },
  groupTitle: { fontWeight: 'bold', marginBottom: '1%' },
  modalGrids: { marginTop: '2%' },
  button: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  permissionListPaper: {
    height: 'calc(100vh - 240px)',
    overflowY: 'scroll',
  },
  hiddenButton: { visibility: 'hidden' },
  headerText: {
    fontWeight: '700',
  },
});

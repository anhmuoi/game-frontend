import { fade } from '@material-ui/core/styles/colorManipulator';
export const styles = (theme) => ({
  eventPublic: {
      // backgroundColor: 'rgb(53, 124, 210)', 
      padding: 2, 
      borderRadius: 2,
      height: 'inherit'
    },
  eventPrivate: {
      backgroundColor: 'rgb(234, 122, 87)', 
      padding: 2, 
      borderRadius: 2,
      height: 'inherit'
    },
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
  iconActionInCell: {
    padding: 3,
    minWidth: '2.5em',
  },
  ePopup: {
    
  },
  epopupHeader: {

  },
  eHeaderIcon: {
    textAlign: '-webkit-right',
    padding: '10px',
  },
  eHeaderTitle: {
  },
  eTitleWrap: {
    marginLeft: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    color: '#212529',
    cursor: 'default',
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: '1.5',
    maxHeight: '87px',
    padding: '10px',
  },
  ePublicTitleWrap:{
    background: 'rgba(13, 110, 253, .3)',
    borderLeft: '6px solid #0d6efd',
  },
  ePrivateTitleWrap:{
    background: 'rgba(234, 122, 87, 0.3)',
    borderLeft: '6px solid rgb(234, 122, 87)',
  },
  epopupContent: {
    margin: '10px',
    borderRadius: '4px',
    color: '#212529',
    cursor: 'default',
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: '1.5',
    maxHeight: '87px',
  },
  calendar:{
    gridRow: '3 / 5',
    border: 'none !important',
    width: 'auto !important',
  },
  roundedCorner: {
    borderRadius: '10px',
  },
  btnAddSchedule:{
    width: '45%'
    // margin: '30px',
    // border: '1px solid rgb(189 189 189)' , 
    // backgroundColor: '#e6e6e6'
  },
  subBtnAdd:{
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  detailEvent:{
    marginTop: '10px', 
    display: 'flex', 
    alignItems: 'flex-end'
  },
  detailEventText:{
    paddingLeft: '10px'
  },
  inputRoot: {
    color: 'inherit',
    width: '80%',
  },
  inputInput: {
    transition: theme.transitions.create('width'),
    width: '80%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  filterCreatedBy:{
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center'
  },
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  contextMenu: {
    width: '160px',
    height: '80px', 
    position: 'fixed',
    zIndex: 9999,
    boxShadow:
    '0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.07), 0px 1px 18px 0px rgba(0,0,0,0.06)',
  },
  contextMenuButton: {
    width: '100%',
    height: '50%',
    boxShadow: 'none ',
    backgroundColor: 'white'
  }
});


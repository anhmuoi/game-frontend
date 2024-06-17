import { lighten, fade } from '@material-ui/core/styles/colorManipulator';

export const toolbarStyles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    height: 64,
  },
  leftPane: {
    marginTop: 14,
  },
  extendTableWrapperAssign: {
    height: 'calc(80vh - 290px)',
  },
  buttonContainer: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  textAlert: {
    color: 'red',
  },
  dateTimeError: {
    textAlign: 'center',
  },
  buttonExport: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
  buttonToolbar: {
    marginLeft: 15,
  },
  title: {
    paddingTop: 30,
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },

  // assign modal
  halfPaddingRight: { paddingRight: theme.spacing.unit },
  halfPaddingLeft: { paddingLeft: theme.spacing.unit },
  hiddenPagingRight: { visibility: 'hidden' },
  // hiddenPagingLeft: { visibility: 'hidden' },
  defaultBackground: { backgroundColor: theme.palette.background.default },
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

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    // marginLeft: 0,
    // width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //   marginLeft: theme.spacing.unit,
    //   width: 'auto',
    // },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    // height: '100%',
    // position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
});

export const mainStyle = (theme) => ({
  extendTableWrapper: {
    height: 'calc(100vh - 535px)',
  },
  extendUserTableWrapper: {
    height: 'calc(100vh - 600px)',
  },
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit,
    textAlign: 'center',
  },
  modalButton: {
    width: 100,
    marginTop: theme.spacing.unit,
  },
  couponList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridGap: '50px 30px',

    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(5, 1fr)',
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },

    overflow: 'scroll',
    marginTop: -100,
    maxHeight: '80vh',
    padding: 50,
    borderRadius: 20,
  },
  couponItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardCoupon: {
    position: 'relative',
    // '&::before': {
    //   content: '""',
    //   background:
    //     'linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%);',
    //   position: 'absolute',
    //   top: 10,
    //   right: 0,
    //   bottom: 0,
    //   left: 10,
    //   width: '100%',
    //   height: '100%',
    //   zIndex: -1,
    //   borderRadius: '5px',
    // },
    boxShadow: ' 0px 0px 10px 1px #C0C3C1',
    zIndex: 1,
    backgroundColor: 'white',
    overflow: 'unset',
    borderRadius: '5px',
  },
  point12: {
    [theme.breakpoints.down('md')]: {
      marginLeft: 40,
    },
  },
  point23: {
    [theme.breakpoints.down('md')]: {
      marginLeft: 40,
    },
  },
  point33: {
    [theme.breakpoints.down('md')]: {
      marginLeft: 40,
    },
  },
  buttonToolbar: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
  showGridCouponGroup: {
    border: '3px solid #ededed',
    borderRadius: '10px',
    backgroundColor: '#ededed',
    marginBottom: '30px',
  },
  showGridCoupon: {
    backgroundColor: theme.palette.primary.main,
    color: 'white !important',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    // paddingTop: 0
  },
  notShowGridCoupon: {
    backgroundColor: '#ededed',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 10,
  },
});

const TabletSize = 768;
const WidthWindow = window.innerWidth;

export const stylesMarketModify = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: WidthWindow >= TabletSize ? theme.spacing.unit * 10 : 0,
    paddingRight: WidthWindow >= TabletSize ? theme.spacing.unit * 10 : 0,
    paddingBottom:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 10
        : theme.spacing.unit * 5,
    paddingTop: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing.unit,
    width: 100,
  },
  linkCancel: {
    textDecoration: 'none',
  },
  input: {
    display: 'none',
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  smallIcon: {
    fontSize: 20,
  },
  wrapper: {
    margin: 12,
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
  tooltip: {
    padding: theme.spacing.unit,
    color: theme.palette.primary.main,
  },
});

export const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
    paddingRight: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
    paddingBottom:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 2
        : theme.spacing.unit * 2,
    paddingTop: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
  },
  defaultBackground: { backgroundColor: theme.palette.background.default },
  noPaddingLeftRight: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  appBar: {
    background: theme.palette.background.menu,
    marginBottom: '50px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing.unit,
    width: 100,
  },
  fab: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
  tab: {
    display: 'flex',
    justifyContent: 'center',
  },
  linkCancel: {
    textDecoration: 'none',
  },
  buttonAvata: {
    margin: theme.spacing.unit,
    border: '1px dashed gray',
    padding: theme.spacing.unit * 5,
  },
  input: {
    display: 'none',
  },
  containerAvata: {
    textAlign: 'center',
  },
  isMasterCardTitle: {
    paddingRight: 140,
  },
  userCardListTitle: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
  accessGroupTitle: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
  accessDoorWrapper: {
    border: '1px solid black',
  },
  accessDoorContent: {
    margin: 10,
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  gender: {
    display: 'block',
  },
  extendTableWrapper: {
    height: 'calc(100vh - 480px)',
  },
  extendTableWrapper2: {
    height: 'calc(100vh - 586px)',
  },
  title: {
    flex: '0 0 auto',
  },

  heading: {
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  modalItem: {
    marginTop: '3%',
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
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  melloGauge: {
    display: 'flex',
    position: 'relative',
  },
  numberPercentMelloGauge: {
    display: 'flex',
    position: 'absolute',
    left: '47%',

    top: '50%',
    transform: 'translateY(-50%)',
  },
});

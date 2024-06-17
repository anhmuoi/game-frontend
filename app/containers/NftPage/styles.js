import { lighten, fade } from '@material-ui/core/styles/colorManipulator';

const TabletSize = 768;
const WidthWindow = window.innerWidth;

export const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    // backgroundColor: theme.palette.background.paper,
    paddingLeft: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
    paddingRight: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
    paddingBottom:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 2
        : theme.spacing.unit * 2,
    paddingTop: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
    borderRadius: '4px',
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
    marginTop: 36,
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
    marginLeft: '30px',
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

  inline: {
    display: 'inline',
  },
  radioGroup: {
    display: 'inline',
    marginLeft: '80px',
  },

  appBar: {
    background: theme.palette.background.menu,
    marginBottom: '50px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 36,
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
  couponList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridGap: '50px 0',

    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(5, 1fr)',
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
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
    marginLeft: 10
  },
});

export const stylesCouponModify = (theme) => ({
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
    marginTop: 36,
  },
  button: {
    margin: theme.spacing.unit,
    width: 100,
  },
  buttonToolbar: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
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
  uploadImg: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    fontSize: '12px',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    lineHeight: 1,
  },
  appBar: {
    background: theme.palette.background.menu,
    marginBottom: '50px',
  },
});

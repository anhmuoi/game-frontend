export const WINDOW_WIDTH = window.innerWidth;

export const styles = (theme) => ({
  root: {
    width: '100%',
    border: 'none',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
  },
  toolbar: {
    width: '100%',
    border: 'none',
    paddingLeft: 0,
    paddingRight: 0,
    // paddingBottom: theme.spacing.unit * 5,
    paddingTop: theme.spacing.unit * 2,
    // borderBottom: '1px solid #000',
  },
  avatar: {
    marginRight: theme.spacing.unit,
    width: 50,
    height: 50,
  },
  category: {
    background: '#3b4756',
    color: 'white',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    flexBasis: '100%',
    flexShrink: 0,
    color: 'white',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  buttons: {
    // display: 'flex',
    // justifyContent: 'flex-end',
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing.unit,
    height: 40,
    width: 40,
  },
  hidden: {
    display: 'none',
  },
  description: {
    fontSize: '12px',
  },
  boolType: {
    padding: 0,
  },
  settingTab: {
    padding: 10,
  },
  wrapper: {
    width: '100%',
    marginBottom: 10,
  },
  input: { width: '100%' },
  panel: { boxShadow: 'none' },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  buttonLogo: {
    border: '1px dashed gray',
    width: 180,
    height: 60,
    textAlign: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  title: {
    flex: '0 0 auto',
  },
  actions: {
    color: theme.palette.text.secondary,
    width: WINDOW_WIDTH >= 768 ? WINDOW_WIDTH / 6 : WINDOW_WIDTH / 2,
    textAlign: 'right',
  },
  spacer: {
    flex: '1 1 90%',
  },
  table: {
    minWidth: 'auto',
  },
  tableWrapper: {
    height: 'calc(100vh - 305px)',
    // borderBottom: `1px solid ${theme.palette.primary.border}`,
  },
  tableHeader: {
    color: theme.palette.primary.color,
    textAlign: 'left',
    flexDirection: 'row',
    fontWeight: 'bold',
    // border: '1px solid red',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    padding: '5px',
    cursor: 'pointer',
  },
  tableSubHeader: {
    color: theme.palette.primary.color,
    flexDirection: 'row',
    fontWeight: 'bold',
    // border: '1px solid red',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '10px',
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    // borderLeft: `2px solid ${theme.palette.primary.border}`,
    // borderRight: `2px solid ${theme.palette.primary.border}`,
    // padding: '5px'
  },
  tableHeaderLeft: {
    marginLeft: '15px',
    textAlign: 'left',
  },
  cellTableCheckBoxHeader: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    width: '50px',
    padding: '1px',
    textAlign: 'left',
    flexDirection: 'row',
    fontWeight: 'bold',
    // border: '1px solid red',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `2px solid ${theme.palette.primary.border}`,
  },
  cellTableCheckBox: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    width: '50px',
    padding: '1px',
    // border: '1px solid red',
  },
  cellTableBody: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    minWidth: 'auto',
    // border: 'none',
    // whiteSpace: 'nowrap',
    padding: '5px',
    fontWeight: 'normal',
  },
  cellTableBodyCenter: {
    color: theme.palette.primary.color,
    // border: 'none',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    minHeight: '40px',
    height: '40px',
    // border: '1px solid black',
  },
  iconActionInCell: {
    padding: 3,
    minWidth: '1.3em',
  },
  buttonContainer: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  buttonToolbar: {
    marginLeft: 15,
    fontSize: 15,
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
  appBar: {
    background: theme.palette.background.menu,
  },
  previewImage: {
    padding: 10,
    maxWidth: '100%',
  },
});

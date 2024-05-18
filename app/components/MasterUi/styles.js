export const drawerWidth = 290;

export const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  logo: {
    width: 50,
    marginLeft: 80,
    // marginRight: 20,
  },
  appBar: {
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // position: 'fixed',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 12,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    maxHeight: '100vh',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.background.menu,
    color: '#ebeced',
    border: 'none',
  },
  drawerPaper2: {
    width: drawerWidth,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: -70, // fixed replace with dynamic size
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  logo_toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    background: '#f1f1f1',
  },
  content: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)', // 64px is appbar height
    marginTop: '64px',
    backgroundColor: theme.palette.background.default,
    padding: window.innerWidth >= 768 ? theme.spacing.unit * 2 : 0,
    overflow: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)', // 64px is appbar height
    marginTop: '64px',
    backgroundColor: theme.palette.background.default,
    padding: window.innerWidth >= 768 ? theme.spacing.unit * 2 : 0,
    overflow: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  grow: {
    flexGrow: 1,
  },
  menuIconLangage: {
    vertical: 'top',
    horizontal: 'right',
  },
  profileBtn: {
    margin: '0 0.5%',
  },
  profileUserName: {
    marginRight: '8%',
  },
});

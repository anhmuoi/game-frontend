/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { Provider, Subscribe } from 'unstated';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import DepartmentStore from './DepartmentStore';
import DepartmentList from './DepartmentList';
import UserList from './UserList';
import AddDepartmentModal from './AddDepartmentModal';
import { localstoreUtilites } from '../../utils/persistenceData';
import reducer from './reducer';
import saga from './saga';
import { getUserData, getUserMeta, getUserHeader } from './selectors';
import { changeUserMeta, getUserList } from './actions';

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
  buttonContainer: {
    textAlign: 'center',
    marginTop: '3%',
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
    minWidth: '320px',
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
  nested: {
    paddingLeft: theme.spacing.unit * 2,
  },
  input: {
    marginTop: '3%',
  },
  fontSize: {
    fontSize: '0.85rem',
  },
  secondItemFont: {
    fontSize: '0.8rem',
  },
});

export class DepartmentPage extends React.Component {
  componentDidMount() {
    // console.log('DepartmentPage');
  }

  render() {
    const {
      classes,
      enqueueSnackbar,
      role,
      userData,
      userMeta,
      userHeader,
      onChangeUserMeta,
      onGetUserData,
    } = this.props;

    return (
      <Provider>
        <Subscribe to={[DepartmentStore]}>
          {(store) => (
            <Paper className={classes.defaultPadding}>
              <Grid container>
                <Grid item md={3} xs={12} sm={12}>
                  <DepartmentList
                    role={role}
                    store={store}
                    classes={classes}
                    enqueueSnackbar={enqueueSnackbar}
                  />
                </Grid>
                <Grid
                  className={`${classes.defaultPadding} ${classes.defaultBackground} ${classes.borderRadius}`}
                  item
                  md={9}
                  xs={12}
                  sm={12}
                >
                  {store.state.showUserList && (
                    <UserList store={store} enqueueSnackbar={enqueueSnackbar} />
                  )}
                </Grid>
              </Grid>
              <AddDepartmentModal
                store={store}
                classes={classes}
                enqueueSnackbar={enqueueSnackbar}
                show={store.state.isOpenAddDepartment}
                userData={userData.toJS()}
                userMeta={userMeta}
                userHeader={userHeader.toJS()}
                onChangeUserMeta={onChangeUserMeta}
                onGetUserData={onGetUserData}
              />
            </Paper>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

DepartmentPage.propTypes = {
  classes: PropTypes.object,
  // history: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
  role: PropTypes.number,
  userData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  userMeta: PropTypes.object,
  userHeader: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeUserMeta: PropTypes.func,
  onGetUserData: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onChangeUserMeta: (name, value) => dispatch(changeUserMeta(name, value)),
    onGetUserData: () => dispatch(getUserList()),
  };
}

const mapStateToProps = createStructuredSelector({
  userData: getUserData(),
  userMeta: getUserMeta(),
  userHeader: getUserHeader(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'department', reducer });
const withSaga = injectSaga({
  key: 'department',
  saga,
  mode: RESTART_ON_REMOUNT,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(DepartmentPage));

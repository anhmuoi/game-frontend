/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unneeded-ternary */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';

import Launch from '@material-ui/icons/Launch';
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ReactHtmlParser from 'react-html-parser';

import { localstoreUtilites } from 'utils/persistenceData';
import ErrorBoundary from 'components/ErrorBoundary';
import { styles } from './styles';
import DrawerMenu from './drawerMenu';
import { TYPE_ACCOUNT } from '../../utils/constants';
import NotificationUI from '../Notification';
import logoSmore from 'images/logo.jpg';
const scrollbarClass = 'scrollbar';

const MyComponent = (props) => <div>{props.message}</div>;
MyComponent.propTypes = {
  message: PropTypes.string,
};

class MasterUI extends React.Component {
  constructor(props) {
    super(props);
    const { role } = props;
    this.state = {
      open: true,
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentDidUpdate() {
    if (this.props.notifySuccess) {
      this.props.enqueueSnackbar(ReactHtmlParser(this.props.notifySuccess), {
        variant: 'success',
      });
      this.props.onResetNotifySuccess();
    }
    if (this.props.error) {
      if (this.props.error.errors && this.props.error.errors.length > 0) {
        this.props.error.errors.forEach((error) => {
          this.props.enqueueSnackbar(ReactHtmlParser(error.message), {
            variant: 'error',
            autoHideDuration: 1000,
            persist: true, // 스낵바 지속 여부
          });
        });
      } else {
        this.props.enqueueSnackbar(ReactHtmlParser(this.props.error.message), {
          variant: 'error',
          autoHideDuration: 1000,
          persist: true, // 스낵바 지속 여부
        });
      }
      this.props.onResetEnqueue();
    }
  }

  makeLogo = (role, classes, logo) => {
    return (
      <a
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          width: 200,
          overflow: 'hidden',
        }}
      >
        <img
          className={classNames(classes.logo, this.state.open && classes.hide)}
          src={logoSmore}
          alt="Game"
        />
      </a>
    );
  };

  render() {
    const {
      classes,
      loading,
      // error,
      // notifySuccess,
      history,
      location,
      childPage,
      role,
      logo,
      countReview,
      updateCountReview,
    } = this.props;
    // const { anchorEl, anchorElTz } = this.state;
    // const open = Boolean(anchorEl);
    // const open2 = Boolean(anchorElTz);
    const { accountType } = localstoreUtilites.getAuthFromLocalStorage();
    // const lastLogin =
    //   localStorage.getItem('lastLogin') !== 'undefined'
    //     ? JSON.parse(localStorage.getItem('lastLogin'))
    //     : null;
    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar
            position="absolute"
            color="default"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: this.state.open,
            })}
          >
            <div>
              <Toolbar disableGutters={!this.state.open}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  // className={classNames(
                  //   classes.menuButton,
                  //   this.state.open && classes.hide,
                  // )}
                  className={clsx(
                    classes.menuButton,
                    this.state.open && classes.hide,
                  )}
                  id="menuButton"
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  color="inherit"
                  className={classes.grow}
                >
                  {logo &&
                    (role === TYPE_ACCOUNT.primaryManager ? (
                      <a href="/device-monitoring">
                        <img
                          className={classNames(
                            classes.logo,
                            this.state.open && classes.hide,
                          )}
                          src={logo}
                          alt="Game"
                        />
                      </a>
                    ) : (
                      this.makeLogo(role, classes, logo)
                    ))}
                </Typography>
                {/* {lastLogin && lastLogin.time && lastLogin.ipAddress && <Typography>
                  <FormattedMessage {...messages.lastLogin} />: {format(new Date(lastLogin.time), 'MM/dd HH:mm (aa)')} [{lastLogin.ipAddress}]
                </Typography>} */}
                <Button
                  color="primary"
                  id="userProfileBtn"
                  onClick={() => history.push('/profile')}
                  className={classes.profileBtn}
                >
                  <PersonIcon className={classes.profileUserName} />
                  {this.props.username}
                </Button>
                {/* <a href="#">{this.props.username}</a> */}
                {accountType === TYPE_ACCOUNT.primaryManager ? (
                  <NotificationUI history={history} />
                ) : (
                  ''
                )}

                {/* <LocaleToggle
                  open={open}
                  anchorEl={anchorEl}
                  handleClose={this.handleClose}
                  handleMenu={this.handleMenu}
                />

                <LocaleTzToggle
                  open={open2}
                  anchorEl={anchorElTz}
                  handleClose={this.handleCloseTz}
                  handleMenu={this.handleMenuTz}
                /> */}

                <IconButton
                  aria-owns="menu-appbar"
                  aria-haspopup="true"
                  id="logoutBtn"
                  onClick={this.props.logout}
                  color="inherit"
                  title="Logout"
                >
                  <Launch fontSize="inherit" />
                </IconButton>
              </Toolbar>
              {loading ? <LinearProgress /> : null}
            </div>
          </AppBar>
          <Drawer
            variant="persistent"
            anchor="left"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !this.state.open && classes.drawerPaperClose,
                scrollbarClass,
              ),
            }}
            // classes={{
            //   paper: classes.drawerPaper,
            // }}
            className={classes.drawer}
            open={this.state.open}
            onClose={this.handleDrawerClose}
          >
            <div className={classes.logo_toolbar}>
              {role === TYPE_ACCOUNT.primaryManager ? (
                <a href="device-monitoring">
                  <img className={classes.logo} src={logo} alt="Game" />
                </a>
              ) : (
                <a
                  href="/room-game"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    width: 200,
                    overflow: 'hidden',
                  }}
                >
                  <img className={classes.logo} src={logoSmore} alt="Game" />
                </a>
              )}
              <IconButton
                color="default"
                aria-label="Close Drawer"
                onClick={this.handleDrawerClose}
              >
                <ArrowBackIcon />
              </IconButton>
            </div>
            {/* <Divider /> */}
            <DrawerMenu
              onClose={this.handleDrawerClose}
              history={history}
              location={location}
              role={role}
              countReview={countReview}
              updateCountReview={updateCountReview}
            />
          </Drawer>
          {/* <main className={classNames(classes.content, scrollbarClass)}> */}
          <main
            className={this.state.open ? classes.content : classes.contentShift}
          >
            {/* <div className={classes.toolbar} /> */}
            <ErrorBoundary>{childPage}</ErrorBoundary>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

MasterUI.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  role: PropTypes.number,
  childPage: PropTypes.element,
  location: PropTypes.object,
  history: PropTypes.object,
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  logo: PropTypes.string,
  onResetEnqueue: PropTypes.func,
  onResetNotifySuccess: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  notifySuccess: PropTypes.string,
  username: PropTypes.string,
  logout: PropTypes.func,
};

export default withRouter(
  withStyles(styles, { withTheme: true })(MasterUI),
  // compose(withConnect)(withStyles(styles, { withTheme: true })(MaterUI)),
);

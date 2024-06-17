/* eslint-disable indent */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Email from '@material-ui/icons/Email';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import WorkIcon from '@material-ui/icons/Work';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import ModalMaterialUi from 'components/Modal';
import {
  makeSelectLoading,
  makeSelectError,
  getAuthInfo,
  makeSelectLocation,
  makeSelectSuccess,
} from 'containers/App/selectors';
import InputUI from 'components/InputUI';
import {
  submitLogin,
  invalidInput,
  sendMailForgotPass,
  openForgotPassModal,
} from 'containers/App/actions';
import { isPluginEnabled } from 'utils/plugins';
import messages from './messages';
import saga from './saga';
import {
  SCREEN_SIZE,
  RESTART_ON_REMOUNT,
  TYPE_ACCOUNT,
  PAGE_TITLE,
} from '../../utils/constants';
import { localstoreUtilites } from '../../utils/persistenceData';
import ApiClient from './api';
import { battlegrounds } from '../../images/people/index.js';
import { useWeb3React } from '@web3-react/core';
import Header from '../../components/Header';
const styles = (theme) => ({
  formWidth: {
    maxWidth: '100%',
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px
        ${theme.spacing.unit * 3}px
        ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing.unit * 9,
    height: theme.spacing.unit * 9,
  },
  formPassword: {
    marginTop: theme.spacing.unit * 5,
  },
  paperPassword: {
    marginTop: -20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px
        ${theme.spacing.unit}px
        ${theme.spacing.unit}px`,
  },
  avatarPassword: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing.unit * 10,
    height: theme.spacing.unit * 10,
    boxShadow: '1px 5px 5px #C0C3C1',
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
    maxHeight: window.innerHeight / 2,
    overflow: 'scroll',
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  messageError: {
    color: '#f50057',
  },
  messageSuccess: {
    color: '#4EA03E',
  },
  passwordBlock: {
    padding: '20px 0',
  },
  btnPassword: {
    color: theme.palette.primary.main,
  },
});

const getModalSize = () => {
  let size = {
    width: '25%',
    top: '10%',
    left: '37.5%',
    borderRadius: 5,
    height: '50%',
  };
  if (window.innerWidth <= SCREEN_SIZE.SM) {
    size = {
      width: '70%',
      top: '10%',
      left: '15%',
      borderRadius: 5,
      height: '50%',
    };
  } else if (
    window.innerWidth > SCREEN_SIZE.SM &&
    window.innerWidth <= SCREEN_SIZE.MD
  ) {
    size = {
      width: '40%',
      top: '10%',
      left: '30%',
      borderRadius: 5,
      height: '50%',
    };
  }

  return size;
};

const AccountInfo = ({ loginByAddress, history }) => {
  const { account } = useWeb3React();
  // const [toggle, setToggle] = useState(false)
  console.log(account);
  useEffect(() => {
    if (account) {
      loginByAddress(account);
    }
  }, [account]);
  const handleLoginByAddress = async () => {
    if (account) {
      const res = await loginByAddress(account);
    }
  };

  return (
    <div style={{ zIndex: 11 }}>
      <Header loginByAddress={() => handleLoginByAddress()} history={history} />
    </div>
  );
};

class SignIn extends React.Component {
  state = {
    username: localstoreUtilites.getUsernameFromLocalStorage(),
    password: '',
    openModal: false,
    email: '',
    messageValidEmail: null,
    rememberMe: false,
    temporaryToken: '',
    companies: [],
    enableRemoveOldSession: false,
    pageContinueLoginNewSession: false,
  };

  loginStep1 = async (evt) => {
    evt.preventDefault();
    // handle submit login call
    const { username, password, enableRemoveOldSession } = this.state;
    if (username && password) {
      try {
        const res = await ApiClient.login({
          username,
          password,
          enableRemoveOldSession,
        });
        if (res.statusCode === 1005) {
          await this.setState({
            pageContinueLoginNewSession: true,
            enableRemoveOldSession: true,
          });
          return;
        } else {
          await this.setState({
            pageContinueLoginNewSession: false,
            enableRemoveOldSession: false,
          });
        }

        if (res.temporaryToken) {
          this.setState({
            temporaryToken: res.temporaryToken,
            companies: res.companies,
          });
        } else {
          this.login();
        }
      } catch (error) {
        this.props.inValid({
          message: error.message,
        });
      }
    } else {
      this.props.inValid({
        message: <FormattedMessage {...messages.mesInvalidLogin} />,
      });
    }
  };

  loginStep2 = (companyId) => {
    // handle submit login call
    const { username, temporaryToken, rememberMe } = this.state;
    if (companyId && temporaryToken) {
      this.props.onLogin(
        companyId,
        temporaryToken,
        username,
        rememberMe,
        false,
      );
    } else {
      this.props.inValid({
        message: <FormattedMessage {...messages.mesInvalidLogin} />,
      });
    }
  };

  login = (address) => {
    const { username, password, rememberMe } = this.state;
    console.log(address ? true : false);
    if (username && password) {
      this.props.onOldLogin(
        username,
        password,
        rememberMe,
        address ? true : false,
      );
    } else {
      this.props.inValid({
        message: <FormattedMessage {...messages.mesInvalidLogin} />,
      });
    }
  };

  changeInput = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
      messageValidEmail: null,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isAuth) {
      localStorage.setItem('isNewLogin', true);
      const data = localstoreUtilites.getAuthFromLocalStorage();

      // 2020.10.30 KWC
      // For now, WebApp could not know
      // what user who is not both system admin and primary manager has permission
      // So it sends profile page temporarily
      window.location.assign('/room-game');
    }
  }

  onCloseModal = () => {
    this.props.onOpenForgotPassModal();
    this.setState({ openModal: false });
  };
  openModal = () => {
    this.setState({ openModal: true });
    this.props.onOpenForgotPassModal();
  };

  registerInAdvance = () => {
    this.props.history.push('/visit/in-advance');
  };

  sendEmailForgotPassWord = () => {
    const { email } = this.state;
    if (!email) {
      this.setState({
        messageValidEmail: <FormattedMessage {...messages.messageValidEmail} />,
      });

      return;
    }
    this.props.onSendMailForgotPass(email);
  };

  displayMessage = (error, success, classes) => (
    <React.Fragment>
      {error ? (
        <React.Fragment>
          <br />
          <Typography variant="subtitle1" className={classes.messageError}>
            {error.message}
          </Typography>
        </React.Fragment>
      ) : null}
      {success ? (
        <React.Fragment>
          <Typography variant="subtitle1" className={classes.messageSuccess}>
            {success.message}
          </Typography>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );

  checkRememberMe = (event) => {
    this.setState({ rememberMe: event.target.checked });
  };

  handleLoginByAddress = async (address) => {
    this.setState({
      username: address,
      password: '123456789',
    });

    this.login(address);
  };

  render() {
    const {
      openModal,
      email,
      messageValidEmail,
      rememberMe,
      temporaryToken,
      companies,
      pageContinueLoginNewSession,
    } = this.state;
    const { classes, loading, error, success, history } = this.props;

    const send = true;
    const stopSendEmail = success ? send : false;
    // console.log(loading);

    if (pageContinueLoginNewSession) {
      return (
        <React.Fragment>
          <Helmet>
            <title>Login</title>
            <meta name="description" content="DeMasterPro" />
          </Helmet>
          <CssBaseline />
          {loading ? <LinearProgress /> : null}
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockIcon />
              </Avatar>
              <Typography variant="h5">
                <FormattedMessage
                  {...messages.titleFormLogin}
                  values={{ title: PAGE_TITLE }}
                />
              </Typography>
              <React.Fragment>
                <br />
                <Typography
                  variant="subtitle1"
                  className={classes.messageError}
                >
                  <FormattedMessage {...messages.labelContinueNewSession} />
                </Typography>
                <br />
                <div style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="basic"
                    onClick={() => {
                      this.setState({
                        pageContinueLoginNewSession: false,
                        enableRemoveOldSession: false,
                      });
                    }}
                  >
                    <FormattedMessage {...messages.btnCancel} />
                  </Button>{' '}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.loginStep1}
                  >
                    <FormattedMessage {...messages.btnContinue} />
                  </Button>
                </div>
              </React.Fragment>
            </Paper>
          </main>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <AccountInfo
          loginByAddress={this.handleLoginByAddress}
          history={history}
        />
        <img
          style={{
            width: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          src={battlegrounds[0].image}
          alt=""
        />
        <Helmet>
          <title>Login</title>
          <meta name="description" content="DeMasterPro" />
        </Helmet>
        <CssBaseline />
        {loading ? <LinearProgress /> : null}
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {/* <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="h5">
              <FormattedMessage
                {...messages.titleFormLogin}
                values={{ title: PAGE_TITLE }}
              />
            </Typography> */}
            {temporaryToken && companies.length > 1 && (
              <List className={classes.form}>
                {companies.map((company) => (
                  <React.Fragment>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => this.loginStep2(company.id)}
                    >
                      <Avatar color="primary">
                        {!company.logo ? (
                          <WorkIcon />
                        ) : (
                          <img
                            src={company.logo}
                            style={{
                              objectFit: 'contain',
                              maxHeight: '40px',
                            }}
                          />
                        )}
                      </Avatar>
                      <ListItemText
                        primary={company.name}
                        secondary={
                          <FormattedMessage {...messages.selectToLogin} />
                        }
                      />
                      <ListItemSecondaryAction style={{ textAlign: 'right' }}>
                        <IconButton color="primary" aria-label="Login">
                          <SendIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
            {!temporaryToken && (
              <React.Fragment>
                {this.displayMessage(error, success, classes)}
                <form method="POST" className={classes.formWidth}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="username">
                      <FormattedMessage {...messages.username} />
                    </InputLabel>
                    <Input
                      value={this.state.username}
                      id="username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      onChange={this.changeInput}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">
                      <FormattedMessage {...messages.password} />
                    </InputLabel>
                    <Input
                      value={this.state.password}
                      name="password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={this.changeInput}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    id="btn-login"
                    className={classes.submit}
                    onClick={this.loginStep1}
                  >
                    <FormattedMessage {...messages.signIn} />
                  </Button>
                </form>
                <Grid
                  container
                  className={classes.passwordBlock}
                  justify="flex-end"
                >
                  {/* <Grid item xs={12} md={6}>
                    <Button
                      id="btn-req-visit"
                      className={classes.btnPassword}
                      onClick={this.registerInAdvance}
                    >
                      <FormattedMessage {...messages.requestVisit} />
                    </Button>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Button
                      id="btn-forgot-pass"
                      className={classes.btnPassword}
                      onClick={this.openModal}
                      fullWidth
                      style={{ color: 'white' }}
                    >
                      <FormattedMessage {...messages.forgotPassword} />
                    </Button>
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
          </Paper>
        </main>
        <ModalMaterialUi
          isOpenModal={openModal}
          onCloseModal={this.onCloseModal}
          isLoading={false}
          shapeModal={getModalSize()}
        >
          <Paper className={classes.paperPassword}>
            <Avatar className={classes.avatarPassword}>
              <Email />
            </Avatar>
            {this.displayMessage(error, success, classes)}
            <InputUI
              required
              label={<FormattedMessage {...messages.emailAddress} />}
              value={email}
              typeInput="email"
              id="email"
              name="email"
              autoFocus
              onChange={this.changeInput}
              textHelperError={messageValidEmail}
            />
            <Button
              disabled={stopSendEmail}
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              id="btn-send-email"
              className={classes.submit}
              onClick={this.sendEmailForgotPassWord}
            >
              <FormattedMessage {...messages.btnSend} />
            </Button>
          </Paper>
        </ModalMaterialUi>
      </React.Fragment>
    );
  }

  static get propTypes() {
    return {
      history: PropTypes.object, // from withRouter
      loading: PropTypes.bool,
      error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
      classes: PropTypes.object.isRequired,
      onLogin: PropTypes.func,
      onOldLogin: PropTypes.func,
      inValid: PropTypes.func,
      isAuth: PropTypes.bool,
      onSendMailForgotPass: PropTypes.func,
      onOpenForgotPassModal: PropTypes.func,
      success: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    };
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onOpenForgotPassModal: () => dispatch(openForgotPassModal()),
    inValid: (err) => dispatch(invalidInput(err)),
    onLogin: (companyId, temporaryToken, username, rememberMe, haveAddress) =>
      dispatch(
        submitLogin(
          { companyId, temporaryToken, username },
          rememberMe,
          haveAddress,
        ),
      ),
    onOldLogin: (username, password, rememberMe, haveAddress) =>
      dispatch(submitLogin({ username, password }, rememberMe, haveAddress)),
    onSendMailForgotPass: (email) => dispatch(sendMailForgotPass(email)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  isAuth: getAuthInfo(),
  location: makeSelectLocation(),
  success: makeSelectSuccess(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'global', saga, mode: RESTART_ON_REMOUNT });

export const SignInTest = withStyles(styles)(SignIn);

export default withRouter(
  compose(withSaga, withConnect)(withStyles(styles)(SignIn)),
);

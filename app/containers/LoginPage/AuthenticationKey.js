/* eslint-disable indent */
import React from 'react';
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
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
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
import messages from './messages';
import saga from './saga';
import {
  SCREEN_SIZE,
  RESTART_ON_REMOUNT,
  TYPE_ACCOUNT,
} from '../../utils/constants';
import ApiClient from './api';

const styles = theme => ({
  formWidth: {
    maxWidth: '100%',
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
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

class AuthenticationKey extends React.Component {
  state = {
    licenseKey: null,
    messageError: null,
    messageSuccess: null,
  };

  changeInput = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  submitVerify = async () => {
    try{
      const res = await ApiClient.verifyLicenseKey({licenseKey: this.state.licenseKey});
      if(res.statusCode === 200) {
        this.setState({
          messageSuccess: res.message,
          messageError: null,
        });
        return;
      }
      throw res;
    }
    catch(error){
      console.log('console.log: ', error)
      this.setState({
        messageSuccess: null,
        messageError: error.message,
      });
    }
  }

  returnPageLogin = () => {
    this.setState({
      messageSuccess: null,
      messageError: null,
    })
    // window.location.assign('/login');
  }

  displayMessage = (error, success, classes) => (
    <React.Fragment>
      {error ? (
        <React.Fragment>
          <br />
          <Typography variant="subtitle1" className={classes.messageError}>
            {error}
          </Typography>
        </React.Fragment>
      ) : null}
      {success ? (
        <React.Fragment>
          <Typography variant="subtitle1" className={classes.messageSuccess}>
            {success}
          </Typography>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );

  render() {
    const {
      openModal,
      email,
      messageValidEmail,
      rememberMe,
      temporaryToken,
      companies,
    } = this.state;
    const { classes, loading } = this.props;
    const { messageSuccess, messageError } = this.state;

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
              <FormattedMessage {...messages.titleFormAuthenticationKey} />
            </Typography>
            <Typography variant="h10">
              <FormattedMessage {...messages.desFormAuthenticationKey} />
            </Typography>
              <React.Fragment>
                <Typography variant="subtitle1" className={classes.messageError}>
                  {messageError}
                </Typography>
                <Typography variant="subtitle1" className={classes.messageSuccess}>
                  {messageSuccess}
                </Typography>
                  {!messageSuccess ? <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="username">
                      <FormattedMessage {...messages.licenseKey} />
                    </InputLabel>
                    <Input
                      autoComplete='off'
                      value={this.state.licenseKey}
                      id="licenseKey"
                      name="licenseKey"
                      onChange={this.changeInput}
                    />
                  </FormControl> : ''}
                  {messageSuccess
                  ? <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    id="btn-login"
                    className={classes.submit}
                    onClick={this.returnPageLogin}
                  >
                    <FormattedMessage {...messages.returnPageLogin} />
                  </Button>
                  : <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    id="btn-login"
                    className={classes.submit}
                    onClick={this.submitVerify}
                  >
                    <FormattedMessage {...messages.verifyKey} />
                  </Button>}
                {/* </form> */}
              </React.Fragment>
          </Paper>
        </main>
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
    inValid: err => dispatch(invalidInput(err)),
    onLogin: (companyId, temporaryToken, username, rememberMe) =>
      dispatch(
        submitLogin({ companyId, temporaryToken, username }, rememberMe),
      ),
    onOldLogin: (username, password, rememberMe) =>
      dispatch(submitLogin({ username, password }, rememberMe)),
    onSendMailForgotPass: email => dispatch(sendMailForgotPass(email)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  isAuth: getAuthInfo(),
  location: makeSelectLocation(),
  success: makeSelectSuccess(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'global', saga, mode: RESTART_ON_REMOUNT });

export default withRouter(
  compose(
    withSaga,
    withConnect,
  )(withStyles(styles)(AuthenticationKey)),
);

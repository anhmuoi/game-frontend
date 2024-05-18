import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputUI from 'components/InputUI';
import reducer from './reducer';
import saga from './saga';
import {
  changeInput,
  resetPassword,
  changePassword,
  resetDataModels,
} from './actions';
import { makeSelectorPassword, getRedirect } from './selectors';
import messages from './messages';

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 10,
    marginLeft: '25%',
    width: '50%',
  },
  marginTopElement: {
    marginTop: theme.spacing.unit,
  },
  btnChangePass: {
    marginTop: theme.spacing.unit * 3,
  },
});

class ResetPassword extends React.Component {
  changeInput = (evt) =>
    this.props.onChangeInput(evt.target.name, evt.target.value);

  changePassword = () => {
    const {
      match,
      passwordModel,
      onResetPassword,
      onChangePassword,
    } = this.props;
    const {
      newPassword,
      confirmNewPassword,
      username,
      password,
    } = passwordModel.toJS();

    if (match.params.codeHash === 'change_password') {
      onChangePassword({
        username: username.value,
        password: password.value,
        newPassword: newPassword.value,
        confirmNewPassword: confirmNewPassword.value,
      });
    } else {
      onResetPassword(
        match.params.codeHash,
        newPassword.value,
        confirmNewPassword.value,
      );
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { redirectInfo } = nextProps;
    const { value, route } = redirectInfo.toJS();
    if (value) {
      this.props.onResetDataModels();
      this.props.history.push(route);
    }
  }

  render() {
    const { classes, passwordModel, match } = this.props;
    // const { classes, passwordModel, redirectInfo, match } = this.props;
    const {
      username,
      password,
      newPassword,
      confirmNewPassword,
    } = passwordModel.toJS();
    // const { value, route } = redirectInfo.toJS();
    const { codeHash } = match.params;
    const isChangePW = codeHash === 'change_password';
    // if (value) {
    //   return <Redirect exact to={route} />;
    // }

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          {isChangePW ? (
            <FormattedMessage {...messages.titleChangePassword} />
          ) : (
            <FormattedMessage {...messages.titleResetPassword} />
          )}
        </Typography>
        <Typography component="p">
          <FormattedMessage {...messages.notifyPage} />
        </Typography>
        <main className={classes.marginTopElement}>
          <Grid container spacing={24}>
            {isChangePW && (
              <React.Fragment>
                <Grid item xs={12} lg={12} sm={12}>
                  <InputUI
                    required
                    label={<FormattedMessage {...messages.loginId} />}
                    value={username.value}
                    id="username"
                    name="username"
                    autoFocus
                    onChange={this.changeInput}
                    textHelperError={username.errorMessage}
                  />
                </Grid>
                <Grid item xs={12} lg={12} sm={12}>
                  <InputUI
                    required
                    typeInput="password"
                    label={<FormattedMessage {...messages.currentPassword} />}
                    value={password.value}
                    id="password"
                    name="password"
                    onChange={this.changeInput}
                    textHelperError={password.errorMessage}
                  />
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12} lg={12} sm={12}>
              <InputUI
                required
                label={<FormattedMessage {...messages.newPassword} />}
                value={newPassword.value}
                typeInput="password"
                id="newPassword"
                name="newPassword"
                autoFocus={codeHash !== 'change_password'}
                onChange={this.changeInput}
                textHelperError={newPassword.errorMessage}
              />
            </Grid>
            <Grid item xs={12} lg={12} sm={12}>
              <InputUI
                required
                label={<FormattedMessage {...messages.confirmNewPassword} />}
                value={confirmNewPassword.value}
                typeInput="password"
                id="confirmPassword"
                name="confirmNewPassword"
                onChange={this.changeInput}
                textHelperError={confirmNewPassword.errorMessage}
              />
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              id="btn-change-pass"
              className={classes.btnChangePass}
              onClick={this.changePassword}
            >
              {isChangePW ? (
                <FormattedMessage {...messages.titleChangePassword} />
              ) : (
                <FormattedMessage {...messages.titleResetPassword} />
              )}
            </Button>
          </Grid>
        </main>
      </Paper>
    );
  }
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
  passwordModel: PropTypes.object,
  redirectInfo: PropTypes.object,
  onChangeInput: PropTypes.func,
  onResetPassword: PropTypes.func,
  onChangePassword: PropTypes.func,
  history: PropTypes.object,
  onResetDataModels: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeInput: (name, value) => dispatch(changeInput(name, value)),
    onResetPassword: (token, newPass, confirmPass) =>
      dispatch(resetPassword(token, newPass, confirmPass)),
    onChangePassword: (model) => dispatch(changePassword(model)),
    onResetDataModels: () => dispatch(resetDataModels()),
  };
}

const mapStateToProps = createStructuredSelector({
  passwordModel: makeSelectorPassword(),
  redirectInfo: getRedirect(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'resetPassword', reducer });
const withSaga = injectSaga({
  key: 'resetPassword',
  saga,
  mode: RESTART_ON_REMOUNT,
});

export const ResetPasswordTest = withStyles(styles)(ResetPassword);

export default withRouter(
  compose(
    withReducer,
    withSaga,
    withConnect,
  )(withStyles(styles)(ResetPassword)),
);

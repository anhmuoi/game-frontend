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
  joinGroup,
  changePassword,
  resetDataModels,
  getUserData,
  confirmJoinGroup,
} from './actions';
import {
  makeSelectorPassword,
  getRedirect,
  getUserListData,
} from './selectors';
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

class JoinGroup extends React.Component {
  state = {
    done: false,
  };
  changeInput = (evt) =>
    this.props.onChangeInput(evt.target.name, evt.target.value);

  changePassword = () => {
    const { match, passwordModel, onJoinGroup, onChangePassword } = this.props;
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
      onJoinGroup(
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
  componentDidMount = () => {
    const { match } = this.props;
    console.log(match.params);
    this.props.onGetUserData();
  };

  render() {
    const { done } = this.state;
    const { classes, passwordModel, match, userListSelector } = this.props;

    const { codeHash, userIdRequest, departmentId } = match.params;
    // if (value) {
    //   return <Redirect exact to={route} />;
    // }
    console.log(userListSelector);
    const user = userListSelector.find((i) => i.id === Number(userIdRequest));

    return (
      <Paper className={classes.root} elevation={1}>
        {user ? (
          <div style={{ textAlign: 'center' }}>
            <img
              src={user.avatar}
              alt=""
              style={{ width: 50, height: 50, borderRadius: '100%' }}
            />
            <Typography variant="h4">{user.name}</Typography>
            <br />
            <Typography variant="h4">
              {done ? (
                <FormattedMessage {...messages.thanks} />
              ) : (
                <FormattedMessage {...messages.askAgreeJoinGroup} />
              )}
            </Typography>
          </div>
        ) : null}
        <main className={classes.marginTopElement}>
          {done ? null : (
            <Grid container spacing={24} justify="center">
              <Grid item>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  id="btn-change-pass"
                  className={classes.btnChangePass}
                  onClick={() => {
                    this.props.onConfirmJoinGroup(
                      departmentId,
                      userIdRequest,
                      true,
                      codeHash,
                    );

                    this.setState({
                      done: true,
                    });
                  }}
                >
                  <FormattedMessage {...messages.agree} />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  id="btn-change-pass"
                  className={classes.btnChangePass}
                  onClick={() => {
                    this.props.onConfirmJoinGroup(
                      departmentId,
                      userIdRequest,
                      false,
                      codeHash,
                    );
                    this.setState({
                      done: true,
                    });
                  }}
                >
                  <FormattedMessage {...messages.reject} />
                </Button>
              </Grid>
            </Grid>
          )}
        </main>
      </Paper>
    );
  }
}

JoinGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
  passwordModel: PropTypes.object,
  redirectInfo: PropTypes.object,
  onChangeInput: PropTypes.func,
  onJoinGroup: PropTypes.func,
  onChangePassword: PropTypes.func,
  history: PropTypes.object,
  onResetDataModels: PropTypes.func,
  onGetUserData: PropTypes.func,
  onConfirmJoinGroup: PropTypes.func,
  userListSelector: PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeInput: (name, value) => dispatch(changeInput(name, value)),
    onJoinGroup: (token, newPass, confirmPass) =>
      dispatch(joinGroup(token, newPass, confirmPass)),
    onChangePassword: (model) => dispatch(changePassword(model)),
    onResetDataModels: () => dispatch(resetDataModels()),
    onGetUserData: () => dispatch(getUserData()),
    onConfirmJoinGroup: (departmentId, userId, confirm, token) =>
      dispatch(confirmJoinGroup(departmentId, userId, confirm, token)),
  };
}

const mapStateToProps = createStructuredSelector({
  passwordModel: makeSelectorPassword(),
  redirectInfo: getRedirect(),
  userListSelector: getUserListData(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'joinGroup', reducer });
const withSaga = injectSaga({
  key: 'joinGroup',
  saga,
  mode: RESTART_ON_REMOUNT,
});

export const JoinGroupTest = withStyles(styles)(JoinGroup);

export default withRouter(
  compose(withReducer, withSaga, withConnect)(withStyles(styles)(JoinGroup)),
);

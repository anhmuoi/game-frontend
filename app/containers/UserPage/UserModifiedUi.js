/* eslint-disable jsx-a11y/alt-text */
import {
  AppBar,
  Button,
  FormControlLabel,
  Grid,
  Hidden,
  Paper,
  RadioGroup,
  Tab,
  Tabs,
  Typography,
  withStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import DatePickerUI from 'components/DatePickerUI';
import SelectUI from 'components/SelectUI';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { styles } from './styles';
import Autocomplete from 'components/Autocomplete';
import tzIds from 'tz-ids';
import Radio from '@material-ui/core/Radio';
import { ShopTwo, Sync } from '@material-ui/icons';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import classNames from 'classnames';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import InputUI from 'components/InputUI';
import { FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import { formatDateToSend, formatDateUtils } from '../../utils/utils.js';
import { getBase64, urlParam } from '../App/appUtilities.js';
import {
  changeTextField,
  getInitIndexUser,
  getUserInit,
  postUserAdd,
  putUserUpdate,
  updateAvatar,
  validateUser,
} from './actions';
import { mapModelUserUiToApi } from './functions.js';
import messages from './messages.js';
import {
  getDepartmentsListModify,
  getUserDataModified,
  getRidirectInfo,
  getStatusListModify,
  getRolesListModify,
} from './selectors';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export class UserModifiedUi extends React.Component {
  state = {
    tabSelected: 0,
    showDialog: false,
  };

  componentDidMount() {
    this.props.getUserInit();
    if (this.props.match.params.userId) {
      this.props.onInitIndexUser(this.props.match.params.userId);
    } else {
      this.props.onInitIndexUser(null);
    }
  }

  addUser = () => {
    this.props.onInitIndexUser(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  onSaveUser = () => {
    this.setState({
      showDialog: true,
    });
    return true;
  };

  onCloseDialog = () => {
    this.setState({
      showDialog: false,
    });
  };
  getTimezones = () => tzIds.map((tz) => ({ id: tz, label: tz }));

  onActionAgreeConfirm = () => {
    // update or add with condition match.params.userId
    const userApi = mapModelUserUiToApi(this.props.userDataModified.toJS());
    const { match, onUpdateUser, onAddUser } = this.props;
    const idUser = match.params.userId;

    const { rowsSelectedId, onValidateUser } = this.props;

    const errorList = [];
    let isValid = true;

    if (userApi.password || userApi.confirmPassword) {
      if (rowsSelectedId) {
        if (userApi.password !== userApi.confirmPassword) {
          this.props.enqueueSnackbar(
            <FormattedMessage {...messages.passwordNotMatch} />,
            {
              variant: 'error',
            },
          );

          isValid = false;
        }
      } else {
        if (!userApi.password) {
          this.props.enqueueSnackbar(
            <FormattedMessage {...messages.invalidPassword} />,
            {
              variant: 'error',
            },
          );
          isValid = false;
        }

        if (!userApi.confirmPassword) {
          this.props.enqueueSnackbar(
            <FormattedMessage {...messages.invalidConfirmPassword} />,
            {
              variant: 'error',
            },
          );
          isValid = false;
        } else if (userApi.password !== userApi.confirmPassword) {
          this.props.enqueueSnackbar(
            <FormattedMessage {...messages.passwordNotMatch} />,
            {
              variant: 'error',
            },
          );

          isValid = false;
        }
      }
    }

    if (!isValid) {
      onValidateUser(errorList);
      return false;
    }

    if (idUser) {
      onUpdateUser(idUser, userApi);
    } else {
      onAddUser(userApi);
    }

    return true;
  };

  /**
   * The function that change avatar (User Image)
   * @author WooCheol KIM
   */
  onChangeAvatar = (file) => {
    if (file) {
      getBase64(file).then((file64) => {
        this.props.onChangeTextField('avatar', file64);
      });
    }
  };

  render() {
    const { showDialog } = this.state;
    const {
      classes,

      onChangeTextField,

      userDataModified,

      history,
      redirect,
      listStatus,
      listDepartment,

      listRole,
      rowsSelectedId,
    } = this.props;

    const {
      id,
      avatar,
      createdOn,
      departmentId,
      name,
      phone,
      holiday,
      position,
      email,
      status,
      password,
      confirmPassword,
      userName,
      roleId,
      walletAddress,
    } = userDataModified.toJS();
    const { tabSelected } = this.state;

    const redirectInfo = redirect.toJS();
    if (redirectInfo.value) {
      return <Redirect exact to={redirectInfo.route} />;
    }

    let dialogMessage = '';
    if (history.location.pathname === '/user/add') {
      dialogMessage = <FormattedMessage {...messages.confirmAddUser} />;
    } else {
      dialogMessage = <FormattedMessage {...messages.confirmEditUser} />;
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          <AlertDialogSlideUI
            onOpen={showDialog}
            messsage={<span />}
            title={<span>{dialogMessage}</span>}
            onActionAgree={this.onActionAgreeConfirm}
            onCloseDialog={this.onCloseDialog}
          />

          <form>
            <AppBar position="static" className={classes.appBar}>
              <Tabs value={tabSelected} onChange={this.onChangeTab}>
                <Grid
                  /* md={2} className={classes.tab} */ item
                  sm={12}
                  style={{ textAlign: 'center' }}
                >
                  <Tab
                    centerRipple
                    icon={<PersonPinIcon />}
                    label={
                      <FormattedMessage {...messages.personalInfo}>
                        {(title) => title}
                      </FormattedMessage>
                    }
                    id="titleUser"
                  />
                </Grid>
              </Tabs>
            </AppBar>

            {tabSelected === 0 ? (
              <TabContainer>
                <React.Fragment>
                  {/* The area of Images */}
                  <Grid style={{ marginBottom: 30 }}>
                    <div style={{ textAlign: 'center' }}>
                      <label htmlFor="avatar">
                        <input
                          ref={this.inputFile}
                          style={{ display: 'none' }}
                          accept="image/*"
                          id="avatar"
                          multiple
                          type="file"
                          onChange={(e) =>
                            this.onChangeAvatar(e.target.files[0])
                          }
                        />
                        <a href={null} style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              avatar.value === ''
                                ? 'data:image/(.*?);base64,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'
                                : avatar.value
                            }
                            alt="User_photo"
                            width="120"
                            height="160"
                            style={{ border: 'solid 1px #ccc' }}
                          />
                        </a>
                      </label>
                    </div>
                  </Grid>
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <InputUI
                        id="name"
                        name="name"
                        value={name.value}
                        onChange={onChangeTextField}
                        label={<FormattedMessage {...messages.name} />}
                        textHelperError={name.errorMessage}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputUI
                        id="walletAddress"
                        name="walletAddress"
                        value={walletAddress.value}
                        onChange={onChangeTextField}
                        label={<FormattedMessage {...messages.walletAddress} />}
                        textHelperError={walletAddress.errorMessage}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputUI
                        id="email"
                        name="email"
                        required
                        onChange={onChangeTextField}
                        value={email.value}
                        label={<FormattedMessage {...messages.email} />}
                        textHelperError={email.errorMessage}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputUI
                        id="userName"
                        name="userName"
                        required
                        onChange={onChangeTextField}
                        value={userName.value}
                        label={<FormattedMessage {...messages.userName} />}
                        textHelperError={userName.errorMessage}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ alignSelf: 'center' }}>
                      <SelectUI
                        value={departmentId.value}
                        onChange={onChangeTextField}
                        label={<FormattedMessage {...messages.departmentId} />}
                        options={listDepartment}
                        name="departmentId"
                        id="departmentId"
                        textHelperError={departmentId.errorMessage}
                        // required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <SelectUI
                        value={roleId.value}
                        onChange={onChangeTextField}
                        label={<FormattedMessage {...messages.role} />}
                        options={listRole}
                        name="roleId"
                        id="roleId"
                        textHelperError={roleId.errorMessage}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputUI
                        id="position"
                        name="position"
                        onChange={onChangeTextField}
                        value={position.value}
                        label={<FormattedMessage {...messages.position} />}
                        textHelperError={position.errorMessage}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <SelectUI
                        value={status.value}
                        onChange={onChangeTextField}
                        label={<FormattedMessage {...messages.status} />}
                        options={listStatus}
                        name="status"
                        id="status"
                        textHelperError={status.errorMessage}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputUI
                        id="phone"
                        name="phone"
                        onChange={onChangeTextField}
                        value={phone.value}
                        label={<FormattedMessage {...messages.phone} />}
                        textHelperError={phone.errorMessage}
                      />
                    </Grid>
                    <Grid item md container>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() =>
                          (window.location.href = `https://testnet.bscscan.com/address/${userName.value}`)
                        }
                        id="btnCheckHistory"
                      >
                        <FormattedMessage
                          {...messages.checkTransactionHistory}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </React.Fragment>
              </TabContainer>
            ) : null}
            {/* <Paper className={classes.paper}>
              <FormattedMessage {...messages.authInfo} />
              <Grid container spacing={32}>
                <Grid item xs={12} sm={6}>
                  <InputUI
                    typeInput="password"
                    id="password"
                    name="password"
                    value={password.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.password} />}
                    required={history.location.pathname === '/user/add'}
                    textHelperError={password.errorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputUI
                    typeInput="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword.value}
                    onChange={onChangeTextField}
                    required={!!password.value}
                    label={<FormattedMessage {...messages.confirmPassword} />}
                    textHelperError={confirmPassword.errorMessage}
                  />
                </Grid>
              </Grid>
            </Paper> */}
          </form>
          <React.Fragment>
            <div className={classes.buttons}>
              <Button
                color="default"
                variant="contained"
                className={classes.button} // classes.linkCancel
                onClick={() => history.push('/user')}
                id="btnCancel"
              >
                <CancelIcon
                  className={classNames(classes.rightIcon, classes.iconSmall)}
                />
                <FormattedMessage {...messages.btnCancel} />
              </Button>
              {(id.value !== 0 &&
                id.value ===
                  Number(localstoreUtilites.getUserIdFromLocalStorage())) ||
              id.value === 0 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onSaveUser}
                  className={classes.button}
                  id="btnSave"
                  disabled={!name.value || !userName.value}
                >
                  <SaveIcon
                    className={classNames(classes.rightIcon, classes.iconSmall)}
                  />
                  <FormattedMessage {...messages.btnSave} />
                </Button>
              ) : null}
            </div>
          </React.Fragment>
        </div>
      </React.Fragment>
    );
  }
}

UserModifiedUi.propTypes = {
  classes: PropTypes.object,

  redirect: PropTypes.object,

  onUpdateUser: PropTypes.func,
  onAddUser: PropTypes.func,
  onInitIndexUser: PropTypes.func,

  getUserInit: PropTypes.func,

  onChangeTextField: PropTypes.func,
  onValidateUser: PropTypes.func,

  userDataModified: PropTypes.object,
  loading: PropTypes.bool,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    onValidateUser: (errors) => dispatch(validateUser(errors)),
    // modified User
    onUpdateUser: (id, user) => dispatch(putUserUpdate(id, user)),
    onAddUser: (user) => dispatch(postUserAdd(user)),
    onInitIndexUser: (id) => dispatch(getInitIndexUser(id)),
    // User index
    getUserInit: () => dispatch(getUserInit()),
    updateAvatar: (file) => dispatch(updateAvatar(file)),
    onChangeTextField: (evt, date) => {
      if (!evt.target) {
        dispatch(changeTextField(evt, date));
      } else {
        dispatch(changeTextField(evt.target.name, evt.target.value));
      }
    },
  };
}

const mapStateToProps = createStructuredSelector({
  userDataModified: getUserDataModified(),

  redirect: getRidirectInfo(),
  listRole: getRolesListModify(),
  listStatus: getStatusListModify(),
  listDepartment: getDepartmentsListModify(),
});

const withReducer = injectReducer({ key: 'userModify', reducer });
const withSaga = injectSaga({
  key: 'userModify',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  // injectIntl,
)(withStyles(styles)(UserModifiedUi));

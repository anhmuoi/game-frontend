/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginSuccess } from 'containers/App/actions';
import classNames from 'classnames';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import {
  withStyles,
  Grid,
  Paper,
  Typography,
  Button,
  TablePagination,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import WorkIcon from '@material-ui/icons/Work';
import SelectUI from 'components/SelectUI';
import Autocomplete from 'components/Autocomplete';
import InputUI from 'components/InputUI';
import SaveIcon from '@material-ui/icons/Save';
import FileBase64 from 'react-file-base64';

import tzIds from 'tz-ids';
import { isPluginEnabled } from 'utils/plugins';
import ProfileStore from './ProfileStore';
import messages from './messages';
import { styles } from './styles';
import { localstoreUtilites } from '../../utils/persistenceData';
import { Add, Delete } from '@material-ui/icons';
import { colorDelete } from '../../utils/constants.js';

const LANGUAGE = [
  { id: 'en-US', name: <FormattedMessage {...messages.languageEnglish} /> },
  { id: 'ko-KR', name: <FormattedMessage {...messages.languageKorean} /> },
  { id: 'vi-VN', name: <FormattedMessage {...messages.languageVietnamese} /> },
];

const lang = localstoreUtilites.getLanguageFromLocalStorage();

class ProfilePage extends React.Component {
  state = {
    password: '',
    confirmPassword: '',
    language: lang || 'en-US',
    timeZone: localstoreUtilites.getAccountTzFromLocalStorage(),
    preferredSystem:
      localstoreUtilites.getPreferredSystemFromLocalStorage() || 0,
    avatar: null,
    fileName: null,
  };

  onChangeAvatar = async () => {
    const { store, enqueueSnackbar } = this.props;
    const { avatar } = this.state;
    const { fileName } = this.state;

    try {
      const data = await store.changeAvatar({ avatar });
      await enqueueSnackbar(data.message, {
        variant: 'success',
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  onCheckAvatar = (name, value) => {
    const { enqueueSnackbar } = this.props;
    // console.log('file name', name, value);
    if (name.match(/\.(jpg|jpeg|png)$/)) {
      this.setState({ avatar: value, fileName: name });
    } else {
      enqueueSnackbar('Please use image has type in JPEG, JPG, PNG', {
        variant: 'error',
      });
    }
  };
  handleChangeAvatar = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.onCheckAvatar(file.name, reader.result);
    };
    reader.readAsDataURL(file);
  };

  loginStep2 = async (companyId) => {
    const { store, onLoginSuccess, enqueueSnackbar } = this.props;
    const { temporaryToken } = store.state;
    const username = localstoreUtilites.getUsernameFromLocalStorage();

    if (companyId && temporaryToken) {
      try {
        const res = await store.loginStep2({ companyId, temporaryToken });
        console.log(res);
        localstoreUtilites.saveToLocalStorage(res.authToken, res.accountType);
        localstoreUtilites.saveRefreshTokenToLocalStorage(res.refreshToken);
        localstoreUtilites.saveConfigWSToLocalStorage(res.queueService);
        localstoreUtilites.savePluginsToLocalStorage(res.plugIn);
        localstoreUtilites.saveUserIdToLocalStorage(res.accountId);
        localstoreUtilites.saveUsernameToLocalStorage(username);
        localstoreUtilites.saveCompanycodeToLocalStorage(res.companyCode);
        localstoreUtilites.saveAccountTzToLocalStorage(res.userTimeZone);
        localstoreUtilites.savePermissionsToLocalStorage(res.permissions);
        localstoreUtilites.savePreferredSystemToLocalStorage(
          res.userPreferredSystem,
        );
        await onLoginSuccess(
          username,
          res.authToken,
          res.accountType,
          res.companyCode,
          res.userTimeZone,
        );
        window.location.assign('/');
      } catch (error) {
        console.log(error);
        enqueueSnackbar(error.errors.map((e) => e.message).join('\n'), {
          variant: 'error',
        });
      }
    }
  };

  onChangePreference = (name, value) => {
    this.setState({ [name]: value });
  };

  onSavePreference = async () => {
    const { store, enqueueSnackbar } = this.props;
    const { language, timeZone, preferredSystem } = this.state;
    try {
      await store.updatePreference({ language, timeZone, preferredSystem });
      localstoreUtilites.saveAccountTzToLocalStorage(timeZone);
      localstoreUtilites.saveLanguageToLocalStorage(language);
      localstoreUtilites.savePreferredSystemToLocalStorage(preferredSystem);
      document.location.reload(true);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.errors.map((e) => e.message).join('\n\r'), {
        variant: 'error',
      });
    }
  };

  onChangePassword = async () => {
    const { store, enqueueSnackbar } = this.props;
    const { password, confirmPassword } = this.state;

    try {
      await store.changePassword({ password, confirmPassword });
      document.location.reload(true);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.errors.map((e) => e.message).join('\n'), {
        variant: 'error',
      });
    }
  };

  getTimezones = () => tzIds.map((tz) => ({ id: tz, label: tz }));

  async componentDidMount() {
    const { store } = this.props;
    const id = localstoreUtilites.getUserIdFromLocalStorage();

    await store.getAccount(id);
    await store.getAvatar();
  }

  render() {
    const { classes, store } = this.props;
    const { language, timeZone, preferredSystem, avatar } = this.state;

    const { temporaryToken, companies, pagination } = store.state;

    // console.log('render', avatar+"?a="+Math.random());

    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Grid container spacing={24}>
            <Grid
              item
              xs={12}
              sm={12}
              className={classes.toolbar}
              style={{ paddingBottom: 0 }}
            >
              <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                  <FormattedMessage {...messages.avatar} />
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <label htmlFor="imagePopup" className={classes.uploadImg}>
                <FormattedMessage {...messages.avatarCondition} />
              </label>{' '}
              <label htmlFor="imagePopup">
                <input
                  style={{ display: 'none' }}
                  accept="image/*"
                  id="imagePopup"
                  multiple
                  type="file"
                  onChange={(e) => this.handleChangeAvatar(e)}
                />

                <a href={null} style={{ cursor: 'pointer' }}>
                  {avatar || store.state.avatar ? (
                    <div
                      style={{
                        width: '150px',
                        height: '200px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ECECEC',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={
                          avatar
                            ? avatar
                            : store.state.avatar
                            ? store.state.avatar
                            : null
                        }
                        width="150"
                        height="200"
                        style={{
                          borderRadius: '5px',
                          marginTop: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      />
                      <IconButton
                        className={classes.addImageBtn}
                        onClick={() => {
                          this.setState({ avatar: '', fileName: '' });
                          store.setAvatar(null);
                        }}
                        style={{ color: colorDelete }}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '150px',
                        height: '200px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ECECEC',
                        position: 'relative',
                      }}
                    >
                      <Typography>
                        <FormattedMessage {...messages.noImage} />
                      </Typography>
                      <IconButton className={classes.addImageBtn}>
                        <label
                          htmlFor="imagePopup"
                          style={{ display: 'flex', cursor: 'pointer' }}
                        >
                          <Add />
                        </label>
                      </IconButton>
                    </div>
                  )}
                </a>
              </label>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onChangeAvatar}
                  className={classes.button}
                  style={{ margin: 0 }}
                  id="btnSave"
                >
                  {/* <SaveIcon
                    className={classNames(classes.rightIcon, classes.smallIcon)}
                  /> */}
                  <FormattedMessage {...messages.btnSave} />
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12} className={classes.toolbar}>
              <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                  <FormattedMessage {...messages.preference} />
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={12}>
              <SelectUI
                value={language}
                label={<FormattedMessage {...messages.language} />}
                onChange={(evt) =>
                  this.onChangePreference('language', evt.target.value)
                }
                options={LANGUAGE}
                name="language"
                id="language"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Autocomplete
                required
                id="timeZone"
                name="timeZone"
                classes={classes}
                placeholder={timeZone}
                label={<FormattedMessage {...messages.timezone} />}
                getSuggestions={this.getTimezones}
                onSelect={(item) =>
                  item && this.onChangePreference('timeZone', item.id)
                }
              />
            </Grid>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.onSavePreference}
                className={classes.button}
                id="btnSavePreference"
              >
                {/* <SaveIcon
                  className={classNames(classes.rightIcon, classes.smallIcon)}
                /> */}
                <FormattedMessage {...messages.btnSave} />
              </Button>
            </div>
          </Grid>
        </Paper>
        <Paper className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12} className={classes.toolbar}>
              <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                  <FormattedMessage {...messages.changePassword} />
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputUI
                typeInput="password"
                id="password"
                name="password"
                value={this.state.password}
                onChange={(evt) =>
                  this.setState({ password: evt.target.value })
                }
                label={<FormattedMessage {...messages.password} />}
                required
                // textHelperError={password.errorMessage}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputUI
                typeInput="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={this.state.confirmPassword}
                onChange={(evt) =>
                  this.setState({ confirmPassword: evt.target.value })
                }
                label={<FormattedMessage {...messages.confirmPassword} />}
                // textHelperError={confirmPassword.errorMessage}
              />
            </Grid>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.onChangePassword}
                className={classes.button}
                id="btnSave"
              >
                {/* <SaveIcon
                  className={classNames(classes.rightIcon, classes.smallIcon)}
                /> */}
                <FormattedMessage {...messages.btnSave} />
              </Button>
            </div>
          </Grid>
        </Paper>
      </React.Fragment>
    );
  }
}

ProfilePage.propTypes = {
  store: PropTypes.object,
  classes: PropTypes.object,
  history: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

const ProfilePageWrapper = (props) => (
  <Provider>
    <Subscribe to={[ProfileStore]}>
      {(store) => <ProfilePage store={store} {...props} />}
    </Subscribe>
  </Provider>
);

const mapStateToProps = () => ({});

function mapDispatchToProps(dispatch) {
  return {
    onLoginSuccess: (
      username,
      authToken,
      accountType,
      companyCode,
      userTimeZone,
    ) =>
      dispatch(
        loginSuccess(
          username,
          authToken,
          accountType,
          companyCode,
          userTimeZone,
        ),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ProfilePageWrapper));

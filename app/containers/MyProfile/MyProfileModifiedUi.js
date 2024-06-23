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
import imgAttack from 'images/people/attack.png';

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
import reducer from './reducer.js';
import saga from './saga.js';
import { styles } from './styles.js';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  changeTextField,
  getInitIndexMyProfile,
  getMyProfileInit,
  postMyProfileAdd,
  putMyProfileUpdate,
  updateAvatar,
  validateMyProfile,
} from './actions.js';
import { mapModelMyProfileUiToApi } from './functions.js';
import messages from './messages.js';
import {
  getDepartmentsListModify,
  getMyProfileDataModified,
  getRidirectInfo,
  getStatusListModify,
  getRolesListModify,
  getAjaxInfo,
} from './selectors.js';
import Sidebar from './Sidebar.js';
import Header from '../../components/Header/index.js';
toast.configure();
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

export class MyProfileModifiedUi extends React.Component {
  state = {
    tabSelected: 0,
    showDialog: false,
    collapse: true,
    toggle: false,
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      toast.success(ajaxSuccess.message, {
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        autoClose: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }

  componentDidMount() {
    this.props.getMyProfileInit();
    if (localstoreUtilites.getUserIdFromLocalStorage()) {
      this.props.onInitIndexMyProfile(
        localstoreUtilites.getUserIdFromLocalStorage(),
      );
    } else {
      this.props.onInitIndexMyProfile(null);
    }
  }

  addMyProfile = () => {
    this.props.onInitIndexMyProfile(null);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  onSaveMyProfile = () => {
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
    const myProfileApi = mapModelMyProfileUiToApi(
      this.props.myProfileDataModified.toJS(),
    );
    const { match, onUpdateMyProfile, onAddMyProfile } = this.props;
    const idMyProfile = localstoreUtilites.getUserIdFromLocalStorage();

    const { rowsSelectedId, onValidateMyProfile } = this.props;

    const errorList = [];
    let isValid = true;

    if (myProfileApi.password || myProfileApi.confirmPassword) {
      if (rowsSelectedId) {
        if (myProfileApi.password !== myProfileApi.confirmPassword) {
          this.props.enqueueSnackbar(
            <FormattedMessage {...messages.passwordNotMatch} />,
            {
              variant: 'error',
            },
          );

          isValid = false;
        }
      } else {
        if (!myProfileApi.password) {
          this.props.enqueueSnackbar(
            <FormattedMessage {...messages.invalidPassword} />,
            {
              variant: 'error',
            },
          );
          isValid = false;
        }

        if (!myProfileApi.confirmPassword) {
          this.props.enqueueSnackbar(
            <FormattedMessage {...messages.invalidConfirmPassword} />,
            {
              variant: 'error',
            },
          );
          isValid = false;
        } else if (myProfileApi.password !== myProfileApi.confirmPassword) {
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
      onValidateMyProfile(errorList);
      return false;
    }

    if (idMyProfile) {
      onUpdateMyProfile(idMyProfile, myProfileApi);
    } else {
      onAddMyProfile(myProfileApi);
    }

    return true;
  };

  /**
   * The function that change avatar (MyProfile Image)
   * @author WooCheol KIM
   */
  onChangeAvatar = (file) => {
    if (file) {
      getBase64(file).then((file64) => {
        this.props.onChangeTextField('avatar', file64);
      });
    }
  };

  setCollapse = (value) => {
    this.setState({
      collapse: value,
    });
  };
  setToggle = (value) => {
    this.setState({
      toggle: value,
    });
  };
  render() {
    const { showDialog, collapse, toggle } = this.state;
    const {
      classes,

      onChangeTextField,

      myProfileDataModified,

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
    } = myProfileDataModified.toJS();
    const { tabSelected } = this.state;

    const redirectInfo = redirect.toJS();
    if (redirectInfo.value) {
      return <Redirect exact to={redirectInfo.route} />;
    }

    let dialogMessage = '';
    if (history.location.pathname === '/myProfile/add') {
      dialogMessage = <FormattedMessage {...messages.confirmAddMyProfile} />;
    } else {
      dialogMessage = <FormattedMessage {...messages.confirmEditMyProfile} />;
    }

    return (
      <React.Fragment>
        <div className="room-game">
          <Sidebar
            collapse={collapse}
            setCollapse={this.setCollapse}
            toggle={toggle}
            setToggle={this.setToggle}
            history={history}
          />
          <Header loginByAddress={() => null} history={history} />
          <div className="room-game-logo">
            <img src={imgAttack} alt="" />
          </div>
          <Typography
            variant="h3"
            style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
          >
            <FormattedMessage {...messages.titleMyProfile} />
          </Typography>
          >
          <div
            className={classes.root}
            style={{
              width: '80%',
              margin: '0 auto',
              borderRadius: 20,
              background: 'rgb(0 214 206)',
              boxShadow: '1px 1px 14px 8px white',
            }}
          >
            <AlertDialogSlideUI
              onOpen={showDialog}
              messsage={<span />}
              title={<span>{dialogMessage}</span>}
              onActionAgree={this.onActionAgreeConfirm}
              onCloseDialog={this.onCloseDialog}
            />

            <form>
              {tabSelected === 0 ? (
                <TabContainer>
                  <React.Fragment>
                    <Grid container spacing={24}>
                      <Grid style={{ marginBottom: 30 }} item md={6}>
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
                                alt="MyProfile_photo"
                                width="120"
                                height="160"
                                style={{ border: 'solid 1px #ccc' }}
                              />
                            </a>
                          </label>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6} container direction="row">
                        <Grid item md={12}>
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
                        <Grid item md={12}>
                          <InputUI
                            id="walletAddress"
                            name="walletAddress"
                            value={walletAddress.value}
                            onChange={onChangeTextField}
                            label={
                              <FormattedMessage {...messages.walletAddress} />
                            }
                            textHelperError={walletAddress.errorMessage}
                            required
                          />
                        </Grid>
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
                        <InputUI
                          id="phone"
                          name="phone"
                          onChange={onChangeTextField}
                          value={phone.value}
                          label={<FormattedMessage {...messages.phone} />}
                          textHelperError={phone.errorMessage}
                        />
                      </Grid>
                    </Grid>
                  </React.Fragment>
                </TabContainer>
              ) : null}
            </form>
            <React.Fragment>
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onSaveMyProfile}
                  className={classes.button}
                  id="btnSave"
                  disabled={!name.value || !userName.value}
                >
                  <SaveIcon
                    className={classNames(classes.rightIcon, classes.iconSmall)}
                  />
                  <FormattedMessage {...messages.btnSave} />
                </Button>
              </div>
            </React.Fragment>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

MyProfileModifiedUi.propTypes = {
  classes: PropTypes.object,

  redirect: PropTypes.object,

  onUpdateMyProfile: PropTypes.func,
  onAddMyProfile: PropTypes.func,
  onInitIndexMyProfile: PropTypes.func,

  getMyProfileInit: PropTypes.func,

  onChangeTextField: PropTypes.func,
  onValidateMyProfile: PropTypes.func,

  myProfileDataModified: PropTypes.object,
  loading: PropTypes.bool,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    onValidateMyProfile: (errors) => dispatch(validateMyProfile(errors)),
    // modified MyProfile
    onUpdateMyProfile: (id, myProfile) =>
      dispatch(putMyProfileUpdate(id, myProfile)),
    onAddMyProfile: (myProfile) => dispatch(postMyProfileAdd(myProfile)),
    onInitIndexMyProfile: (id) => dispatch(getInitIndexMyProfile(id)),
    // MyProfile index
    getMyProfileInit: () => dispatch(getMyProfileInit()),
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
  myProfileDataModified: getMyProfileDataModified(),

  redirect: getRidirectInfo(),
  listRole: getRolesListModify(),
  listStatus: getStatusListModify(),
  listDepartment: getDepartmentsListModify(),
  ajaxInfo: getAjaxInfo(),
});

const withReducer = injectReducer({ key: 'myProfileModify', reducer });
const withSaga = injectSaga({
  key: 'myProfileModify',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  // injectIntl,
)(withStyles(styles)(MyProfileModifiedUi));

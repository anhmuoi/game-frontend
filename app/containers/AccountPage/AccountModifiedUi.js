import React from 'react';
import PropTypes from 'prop-types';
import ModalMaterialUi from 'components/Modal';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Tooltip } from '@material-ui/core';
import { FaQuestionCircle } from 'react-icons/fa';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import classNames from 'classnames';
import InputUI from 'components/InputUI';
import SelectUI from 'components/SelectUI';
import { validateEmail } from 'utils/utils';
import {
  stylesAccountModify,
  mapModelAccountUiToApi,
} from './accountUtilities';
import messages from './messages';
import reducer from './reducer';
import { validateAccount } from './actions';
import { localstoreUtilites } from '../../utils/persistenceData';
const isArmyManagement =
  localstoreUtilites.getPluginsFromLocalStorage().armyManagement || false;

// const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
class AccountModifiedUi extends React.PureComponent {
  onSaveAccount = () => {
    /**
     * check if user selected a row
     * it should call onUpdateAccount props
     * else should call onAddAccount props
     */
    const {
      rowsSelectedId,
      onUpdateAccount,
      onAddAccount,
      accountDataModified,
      intl,
      onValidateAccount,
    } = this.props;

    const accountApi = mapModelAccountUiToApi(accountDataModified);

    const errorList = [];
    let isValid = true;
    if (!accountApi.username) {
      errorList.push({
        field: 'username',
        message: intl.formatMessage({ ...messages.invalidEmail }),
      });
      isValid = false;
    } /* else if (!isArmyManagement && !validateEmail(accountApi.username)) {
      errorList.push({
        field: 'username',
        message: intl.formatMessage({ ...messages.invalidEmailFormat }),
      });
      isValid = false;
    } */

    if (accountApi.password || accountApi.confirmPassword) {
      if (rowsSelectedId) {
        if (accountApi.password !== accountApi.confirmPassword) {
          errorList.push({
            field: 'confirmPassword',
            message: intl.formatMessage({ ...messages.passwordNotMatch }),
          });
          isValid = false;
        }
      } else {
        if (!accountApi.password) {
          errorList.push({
            field: 'password',
            message: intl.formatMessage({ ...messages.invalidPassword }),
          });
          isValid = false;
        }

        if (!accountApi.confirmPassword) {
          errorList.push({
            field: 'confirmPassword',
            message: intl.formatMessage({ ...messages.invalidConfirmPassword }),
          });
          isValid = false;
        } else if (accountApi.password !== accountApi.confirmPassword) {
          errorList.push({
            field: 'confirmPassword',
            message: intl.formatMessage({ ...messages.passwordNotMatch }),
          });
          isValid = false;
        }
      }
    }

    if (!isValid) {
      onValidateAccount(errorList);
      return false;
    }

    if (rowsSelectedId) {
      onUpdateAccount(rowsSelectedId, accountApi);
    } else {
      onAddAccount(accountApi);
    }

    return true;
  };

  render() {
    const {
      openModal,
      onCloseModal,
      accountDataModified,
      onChangeTextField,
      classes,
      title,
      isLoading,
      rowsSelectedId,
    } = this.props;
    const {
      username,
      password,
      confirmPassword,
      role,
      // status,
      roleList,
      // statusList,
      militaryNumber,
    } = accountDataModified;
    const disibleUserName = false;

    return (
      <ModalMaterialUi
        isOpenModal={openModal}
        onCloseModal={onCloseModal}
        isLoading={isLoading}
      >
        <React.Fragment>
          <Typography variant="h5" id="modal-title">
            {title}
          </Typography>
          <br />
          <div className={classes.wrapper}>
            <form autoComplete="off" autoCorrect="off" autoCapitalize="off">
              <Grid container spacing={24}>
                <Grid item xs={12} sm={6}>
                  <InputUI
                    disabled={rowsSelectedId ? true : disibleUserName}
                    id="username"
                    name="username"
                    value={username.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.account} />}
                    required
                    textHelperError={username.errorMessage}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Grid
                    container
                    justify="space-between"
                    alignContent="space-between"
                  >
                    <Grid item sm={10} md={11}>
                      <SelectUI
                        // valueName={role.value}
                        value={role.value}
                        onChange={onChangeTextField}
                        label={<FormattedMessage {...messages.role} />}
                        options={roleList.value}
                        name="role"
                        id="role"
                        textHelperError={role.errorMessage}
                      />
                    </Grid>
                    <Grid item sm={2} md={1}>
                      <div className={classes.tooltip} style={{ padding: 9 }}>
                        <Tooltip
                          title={<FormattedMessage {...messages.roleTooltip} />}
                        >
                          <FaQuestionCircle size={24} />
                        </Tooltip>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputUI
                    typeInput="password"
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    value={password.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.password} />}
                    required
                    textHelperError={password.errorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputUI
                    typeInput="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    value={confirmPassword.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.confirmPassword} />}
                    textHelperError={confirmPassword.errorMessage}
                  />
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                  <RadioGroup
                    aria-label="Ringtone"
                    name="status"
                    value={`${status.value}`}
                    onChange={onChangeTextField}
                    row
                  >
                    {statusList.value &&
                      statusList.value.map(option => (
                        <FormControlLabel
                          disabled={username.value === localUsername}
                          value={option.value}
                          key={option.value}
                          control={<Radio />}
                          label={option.text}
                        />
                      ))}
                  </RadioGroup>
                </Grid> */}
              </Grid>
            </form>
          </div>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              onClick={onCloseModal}
              id="btnCancel"
            >
              <CancelIcon
                className={classNames(classes.rightIcon, classes.smallIcon)}
              />
              <FormattedMessage {...messages.btnCancel} />
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={this.onSaveAccount}
              className={classes.button}
              id="btnSave"
            >
              <SaveIcon
                className={classNames(classes.rightIcon, classes.smallIcon)}
              />
              <FormattedMessage {...messages.btnSave} />
            </Button>
          </div>
        </React.Fragment>
      </ModalMaterialUi>
    );
  }
}

AccountModifiedUi.propTypes = {
  isLoading: PropTypes.bool,
  openModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  /**
   * object (null) when add action
   * number : selected row id
   */
  rowsSelectedId: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  deviceDataModified: PropTypes.object,
  accountDataModified: PropTypes.object,
  onChangeTextField: PropTypes.func,
  classes: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onUpdateAccount: PropTypes.func,
  onAddAccount: PropTypes.func,
  onValidateAccount: PropTypes.func,
  intl: PropTypes.any,
};

AccountModifiedUi.defaultProps = {
  openModal: false,
  title: 'Add account',
};

export function mapDispatchToProps(dispatch) {
  return {
    onValidateAccount: (errors) => dispatch(validateAccount(errors)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'account', reducer });

export default compose(
  withConnect,
  withReducer,
  injectIntl,
)(withStyles(stylesAccountModify)(AccountModifiedUi));

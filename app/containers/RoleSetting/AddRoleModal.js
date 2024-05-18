import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Button, Typography } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import InputUI from 'components/InputUI';
import ModalMaterialUi from 'components/Modal';
import SelectUI from 'components/SelectUI';
import messages from './messages';
import {
  validateRole
} from './actions';
class AddRoleModal extends Component {
  state = {
    showDialog: false,
  };

  changeRoleName = (evt) => {
    const { onChangeRoleName } = this.props;
    onChangeRoleName(evt.target.name, evt.target.value);
  };

  onCloseModal = () => {
    this.props.onCloseModal();
    this.setState({
      showDialog: false,
    });
  };

  saveRole = () => {
    const { currentRoleId, roleModel, onValidateRole, intl } = this.props;

    let isValid = true;
    const errorList = [];
    if (!roleModel.roleName.value) {
      errorList.push({
        field: 'roleName',
        message: intl.formatMessage({ ...messages.invalidRoleName }),
      });
      isValid = false;
    }

    if (!isValid) {
      onValidateRole(errorList);
    }
    else{
      // Connect props which is for save role
      this.props.onSaveRole(currentRoleId === null ? 0 : currentRoleId); // add
      this.onCloseModal();
    }
  };

  onChangeSimilarId = (evt) => {
    this.props.onChangeSimilarId(evt.target.value);
  };

  render() {
    const { showDialog } = this.state;
    const {
      classes,
      isOpenModal,
      currentRoleId,
      roleModel,
      roleData,
      similarId,
    } = this.props;
    // console.log(`AddRoleModal ::: ${currentRoleId}`);
    const roleList = [];
    roleData.forEach((role, index) => {
      if (index === 0) {
        roleList.push({ id: 0, name: 'None' });
      }
      roleList.push({ id: role.id, name: role.roleName });
    });
    return (
      <ModalMaterialUi
        onOpenDialog={showDialog}
        onActionAgreeDialog={this.onAgreeChangeDefaultGroup}
        onCloseDialogDialog={this.onCloseDialogDialog}
        isOpenModal={isOpenModal}
        onCloseModal={this.onCloseModal}
      >
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6">
              {currentRoleId ? (
                <FormattedMessage {...messages.editRole} />
              ) : (
                <FormattedMessage {...messages.addNewRole} />
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} className={classes.modalGrids}>
            <InputUI
              value={roleModel.roleName.value}
              required
              autoFocus
              name="roleName"
              id="role-name"
              typeInput="text"
              onChange={this.changeRoleName}
              textHelperError={roleModel.roleName.errorMessage}
              label={<FormattedMessage {...messages.roleName} />}
              //   disabled={disableEditName}
            />
          </Grid>
          <Grid item xs={12} sm={12} className={classes.modalGrids}>
            <SelectUI
              value={similarId}
              label={<FormattedMessage {...messages.similarId} />}
              onChange={this.onChangeSimilarId}
              options={roleList}
              name="similarId"
              id="similarId"
              // textHelperError={operationType.errorMessage}
            />
          </Grid>
          <Grid
            item
            container
            sm={12}
            justify="center"
            className={classes.modalGrids}
          >
            <Button
              variant="contained"
              color="default"
              aria-label="Cancel"
              onClick={this.onCloseModal}
              className={classes.button}
              id="btnCancel"
            >
              <CancelIcon
                className={classNames(classes.rightIcon, classes.iconSmall)}
              />
              <FormattedMessage {...messages.cancel} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              aria-label="Save"
              onClick={this.saveRole}
              className={classes.button}
              id="btnSave"
            >
              <SaveIcon
                className={classNames(classes.rightIcon, classes.iconSmall)}
              />
              <FormattedMessage {...messages.save} />
            </Button>
          </Grid>
        </Grid>
      </ModalMaterialUi>
    );
  }
}

AddRoleModal.propTypes = {
  // PropTypes
  classes: PropTypes.object,
  isOpenModal: PropTypes.bool,
  currentRoleId: PropTypes.number,
  onCloseModal: PropTypes.func,
  roleModel: PropTypes.object,
  roleData: PropTypes.array,
  onChangeRoleName: PropTypes.func,
  onSaveRole: PropTypes.func,
  onChangeSimilarId: PropTypes.func,
  similarId: PropTypes.number,
  onValidateRole: PropTypes.func,
  intl: PropTypes.any,
};

export default AddRoleModal;

/* eslint-disable indent */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import PlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
// import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import tzlookup from 'tz-lookup';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import { Grid, Button, Typography, Paper, MenuItem } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
// import SelectUI from 'components/SelectUI';
import InputUI from 'components/InputUI';
import ModalMaterialUi from 'components/Modal';
import truncate from 'lodash/truncate';
import Autocomplete from 'components/Autocomplete';
import tzIds from 'tz-ids';
import messages from './messages';
import { modalStyle } from './constants';
import { convertGroupUItoApi } from './folderLogUtilities';
import { validateFolderLog } from './actions';
import reducer from './reducer';
import { localstoreUtilites } from '../../utils/persistenceData';

// const MapWithAMarker = withGoogleMap(props => (
//   <GoogleMap
//     defaultZoom={16}
//     center={{
//       lat: parseFloat(props.location.lat),
//       lng: parseFloat(props.location.lng),
//     }}
//     options={{
//       styles: [
//         {
//           featureType: 'poi',
//           stylers: [{ visibility: 'off' }],
//         },
//       ],
//     }}
//   >
//     <Marker
//       position={{
//         lat: parseFloat(props.location.lat),
//         lng: parseFloat(props.location.lng),
//       }}
//     />
//   </GoogleMap>
// ));

class AddFolderLogModal extends Component {
  state = {
    showDialog: false,
    groupState: null,
    address: '',
  };

  handleChange = (address) => {
    this.setState({ address });
    this.props.onChangeGroupModel(address, 'address');
  };

  changeCity = (event) => {
    this.props.onChangeGroupModel(event.target.value, event.target.name);
  };

  changeCountry = (event) => {
    this.props.onChangeGroupModel(event.target.value, event.target.name);
  };

  changePostalCode = (event) => {
    this.props.onChangeGroupModel(event.target.value, event.target.name);
  };

  selectDefaultGroup = (event) => {
    this.setState({
      showDialog: true,
      groupState: {
        value: !(event.target.value === 'true'),
        name: event.target.name,
      },
    });
  };

  changeNameGroup = (event) =>
    this.props.onChangeGroupModel(event.target.value, event.target.name);

  saveGroup = () => {
    const {
      groupModel,
      onSaveGroup,
      selectedGroupId,
      intl,
      onValidateFolderLog,
    } = this.props;
    if (!groupModel.name.value) {
      const errors = [];
      errors.push({
        field: 'name',
        message: intl.formatMessage({ ...messages.invalidFolderLogName }),
      });
      onValidateFolderLog(errors);
      return;
    }
    onSaveGroup(
      convertGroupUItoApi(groupModel, selectedGroupId),
      selectedGroupId,
    );
    this.onCloseDialogDialog();
  };

  onAgreeChangeDefaultGroup = () => {
    const { groupState } = this.state;
    this.props.onChangeGroupModel(groupState.value, groupState.name);
  };

  onCloseDialogDialog = () => {
    this.setState({
      showDialog: false,
    });
    this.props.closeModal();
  };

  getTimezones = () => tzIds.map((tz) => ({ id: tz, label: tz }));

  getChildrenFolderLog = (data, newData) => {
    data.map((item) => {
      if (item.children) {
        this.getChildrenFolderLog(item.children, newData);
      }
      newData.push(item);
    });
    return newData;
  };

  getFolderLog = (input) => {
    const { groupModel, groupData } = this.props;

    const dataFolderLog = this.getChildrenFolderLog(groupData, []);
    const allFolderLogs = dataFolderLog.filter((item) =>
      groupModel.id ? item.id !== groupModel.id.value : true,
    );

    const lang = localstoreUtilites.getLanguageFromLocalStorage();
    const notSelectObj = {
      'en-US': 'Not Select',
      'ko-KR': '선택 안함',
      'ja-JP': '選択しない',
      'vi-VN': 'Không chọn',
    };

    return [
      { id: 0, label: notSelectObj[lang] },
      ...allFolderLogs
        .filter((item) => item.name.toLowerCase().includes(input.toLowerCase()))
        // .slice(0, 5)
        .map((item) => ({
          id: item.id,
          label: `${item.name}`,
        })),
    ];
  };

  render() {
    const { showDialog } = this.state;
    const {
      classes,
      isOpenModal,
      selectedGroupId,
      groupModel,
      disableEditName,
    } = this.props;
    return (
      <ModalMaterialUi
        onOpenDialog={showDialog}
        onActionAgreeDialog={this.onAgreeChangeDefaultGroup}
        onCloseDialogDialog={this.onCloseDialogDialog}
        isOpenModal={isOpenModal}
        onCloseModal={this.onCloseDialogDialog}
        shapeModal={modalStyle}
      >
        <Grid container>
          <Grid item sm={12} className={classes.modalTitle}>
            <Typography variant="h6">
              {selectedGroupId > 0 ? (
                <FormattedMessage {...messages.editFolderLog} />
              ) : (
                <FormattedMessage {...messages.addFolder} />
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} className={classes.input}>
            <InputUI
              value={groupModel.name.value}
              required
              autoFocus
              name="name"
              id="folderLog-name"
              typeInput="text"
              onChange={this.changeNameGroup}
              textHelperError={groupModel.name.errorMessage}
              label={<FormattedMessage {...messages.folderLogName} />}
              disabled={disableEditName}
            />
          </Grid>
          <Grid item xs={12} sm={12} className={classes.input}>
            <InputUI
              value={groupModel.description.value}
              name="description"
              id="folderLog-description"
              typeInput="text"
              onChange={this.changeNameGroup}
              textHelperError={groupModel.description.errorMessage}
              label={<FormattedMessage {...messages.folderLogDescription} />}
              disabled={disableEditName}
            />
          </Grid>

          <Grid item xs={12} sm={12} className={classes.input}>
            <Autocomplete
              classes={classes}
              id="parentId"
              name="parentId"
              label={<FormattedMessage {...messages.parentFolderLog} />}
              getSuggestions={this.getFolderLog}
              onSelect={async (item) => {
                if (item) {
                  this.props.onChangeGroupModel(item.id, 'parentId');
                }
              }}
              placeholder={
                groupModel.parentFolderLogItem.value.find(
                  (el) => el.id === groupModel.parentId.value,
                ) &&
                groupModel.parentFolderLogItem.value.find(
                  (el) => el.id === groupModel.parentId.value,
                ).name
              }
            />
          </Grid>
          <Grid
            item
            container
            sm={12}
            justify="center"
            className={classes.input}
          >
            <Button
              variant="contained"
              color="default"
              aria-label="Cancel"
              onClick={this.onCloseDialogDialog}
              className={classes.button}
              id="btnCancel"
            >
              <CancelIcon
                className={classNames(classes.rightIcon, classes.iconSmall)}
              />
              <FormattedMessage {...messages.btnCancel} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              aria-label="Save"
              onClick={this.saveGroup}
              className={classes.button}
              id="btnSave"
            >
              <SaveIcon
                className={classNames(classes.rightIcon, classes.iconSmall)}
              />
              <FormattedMessage {...messages.btnSave} />
            </Button>
          </Grid>
        </Grid>
      </ModalMaterialUi>
    );
  }
}

AddFolderLogModal.propTypes = {
  classes: PropTypes.object,
  isOpenModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  selectedGroupId: PropTypes.number,
  groupModel: PropTypes.object,
  onChangeGroupModel: PropTypes.func,
  onSaveGroup: PropTypes.func,
  disableEditName: PropTypes.bool,
  onValidateFolderLog: PropTypes.func,
  intl: PropTypes.any,
};

export function mapDispatchToProps(dispatch) {
  return {
    onValidateFolderLog: (errors) => dispatch(validateFolderLog(errors)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'folderLog', reducer });

export default compose(withConnect, withReducer, injectIntl)(AddFolderLogModal);

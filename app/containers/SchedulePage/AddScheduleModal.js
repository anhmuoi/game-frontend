import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Button, Typography, Checkbox } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { Editor } from '@tinymce/tinymce-react';

import InputUI from 'components/InputUI';
import ModalMaterialUi from 'components/Modal';
import SelectUI from 'components/SelectUI';
import DateTimePickerUI from 'components/DateTimePickerUI';
import DatePickerUI from 'components/DatePickerUI';
import messages from './messages';
import {
  formatDateTimeToSend,
} from '../../utils/utils.js';
class AddScheduleModal extends Component {
  state = {
    showDialog: false,
  };
  onCloseModal = () => {
    this.props.onCloseModal();
    this.setState({
      showDialog: false,
    });
  };

  saveSchedule = () => {
    const { currentScheduleId, scheduleModel, onValidateSchedule, intl } = this.props;

    let isValid = true;
    const errorList = [];
    if (!scheduleModel.title.value) {
      errorList.push({
        field: 'title',
        message: intl.formatMessage({ ...messages.invalidTitle }),
      });
      isValid = false;
    }
    if (!scheduleModel.categoryId.value) {
      errorList.push({
        field: 'categoryId',
        message: intl.formatMessage({ ...messages.invalidCategory }),
      });
      isValid = false;
    }
    console.log(scheduleModel);
    if (formatDateTimeToSend(scheduleModel.startDate.value) > formatDateTimeToSend(scheduleModel.endDate.value)) {
      errorList.push({
        field: 'endDate',
        message: intl.formatMessage({ ...messages.invalidDate }),
      });
      isValid = false;
    }

    if (!isValid) {
      onValidateSchedule(errorList);
    }
    else{
      // Connect props which is for save role
      this.props.onSaveSchedule(currentScheduleId === null ? 0 : currentScheduleId); // add
      this.onCloseModal();
    }
  };

  onChangeSimilarId = (evt) => {
    this.props.onChangeSimilarId(evt.target.value);
  };
  handleChangeCheckbox = (event) => {
    this.props.onChangeTextField(
      'isAllDay',
      event.target.checked,
    )
  }

  render() {
    const { showDialog } = this.state;
    const {
      classes,
      isOpenModal,
      currentScheduleId,
      onCloseModal,
      scheduleModel,
      scheduleData,
      types,
      categories,
      onChangeTextField,
      isHoliday,
      remainingHoliday
    } = this.props;
    let categoryByType = [];

    const foundCategory = categories.find(category => category.id === scheduleModel.categoryId.value);
    if(isHoliday || (foundCategory && foundCategory.type === 1)){
      categoryByType = categories.filter(category => category.type === 1);
    }
    else{
      categoryByType = categories.filter(category => category.type === 0);
    }
    
    return (
      <ModalMaterialUi
        onOpenDialog={showDialog}
        onActionAgreeDialog={this.onAgreeChangeDefaultGroup}
        onCloseDialogDialog={this.onCloseDialogDialog}
        isOpenModal={isOpenModal}
        onCloseModal={this.onCloseModal}
      >
        <Grid container spacing={24} className={classes.grid}>
          <Grid item xs={2} sm={2} md={2}>
            {(isHoliday || (foundCategory && foundCategory.type === 1)) ? (<Typography variant="h6">
              {currentScheduleId !== 0 ? (
                <FormattedMessage {...messages.titleEditHoliday} />
              ) : (
                <FormattedMessage {...messages.addHoliday} />
              )}
            </Typography>) :
            (<Typography variant="h6">
              {currentScheduleId !== 0 ? (
                <FormattedMessage {...messages.titleEditSchedule} />
              ) : (
                <FormattedMessage {...messages.addSchedule} />
              )}
            </Typography>)
            }
          </Grid>
          <Grid item xs={10} sm={10} md={10}>
            {isHoliday && (<Typography variant="h6" style={{color: 'red'}}>
              <FormattedMessage {...messages.remainingHoliday} />{remainingHoliday}<FormattedMessage {...messages.days} />
            </Typography>)
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputUI
              value={scheduleModel.title.value}
              required
              autoFocus
              name="title"
              id="title"
              typeInput="text"
              onChange={onChangeTextField}
              textHelperError={scheduleModel.title.errorMessage}
              label={<FormattedMessage {...messages.scheduleTitle} />}
              //   disabled={disableEditName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectUI
              value={scheduleModel.type.value}
              label={<FormattedMessage {...messages.titleType} />}
              onChange={onChangeTextField}
              options={types}
              name="type"
              id="type"
              textHelperError={scheduleModel.type.errorMessage}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {scheduleModel.isAllDay.value ? (<DatePickerUI
              value={scheduleModel.startDate.value || ''}
              onChange={(date) =>
                onChangeTextField(
                  'startDate',
                  new Date(date),
                )
              }
              name="startDate"
              label={<FormattedMessage {...messages.titleStartDate} />}
              id="startDate"
              textHelperError={scheduleModel.startDate.errorMessage}
            />) : (<DateTimePickerUI
              value={scheduleModel.startDate.value || ''}
              onChange={(date) =>
                onChangeTextField(
                  'startDate',
                  new Date(date),
                )
              }
              name="startDate"
              label={<FormattedMessage {...messages.titleStartDate} />}
              id="startDate"
              textHelperError={scheduleModel.startDate.errorMessage}
            />)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {scheduleModel.isAllDay.value ? (<DatePickerUI
              value={scheduleModel.endDate.value || ''}
              onChange={(date) =>
                onChangeTextField(
                  'endDate',
                  new Date(date),
                )
              }
              name="endDate"
              label={<FormattedMessage {...messages.titleEndDate} />}
              id="endDate"
              textHelperError={scheduleModel.endDate.errorMessage}
            />) : (<DateTimePickerUI
              value={scheduleModel.endDate.value || ''}
              onChange={(date) =>
                onChangeTextField(
                  'endDate',
                  new Date(date),
                )
              }
              name="endDate"
              label={<FormattedMessage {...messages.titleEndDate} />}
              id="endDate"
              textHelperError={scheduleModel.endDate.errorMessage}
            />)}
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectUI
              value={scheduleModel.categoryId.value}
              label={<FormattedMessage {...messages.titleCategory} />}
              required
              icon={() => {}}
              onChange={onChangeTextField}
              options={categoryByType}
              name="categoryId"
              id="categoryId"
              textHelperError={scheduleModel.categoryId.errorMessage}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{display: 'flex', alignItems: 'flex-end'}}>
            <Checkbox
              style={{paddingLeft: '0px', paddingBottom: '0px'}}
              checked={scheduleModel.isAllDay.value}
              name="isAllDay"
              id="isAllDay"
              onChange={(event) => this.handleChangeCheckbox(event)}
            />
            <FormattedMessage {...messages.titleIsAllDay}/>
          </Grid>
          
          <Grid item md={12}>
            <Editor
              value={scheduleModel.content.value}
              apiKey="q4s5gv2f6brroclpx08k8jydm39k7iqgf79p6qp0mbcghwgb"
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image imagetools preview',
                  'searchreplace code',
                  'insertdatetime table paste code template',
                  'emoticons',
                ],
                toolbar:
                  'undo redo searchreplace | formatselect | bold italic backcolor bullist numlist | \
              alignleft aligncenter alignright alignjustify | \
              outdent indent | link image imagetools insertdatetime table template emoticons | code',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
              onEditorChange={(content) =>
                this.props.onChangeTextField('content', content)
              }
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
              <FormattedMessage {...messages.btnCancel}/>
            </Button>
            <Button
              variant="contained"
              color="primary"
              aria-label="Save"
              onClick={this.saveSchedule}
              className={classes.button}
              id="btnSave"
            >
              <SaveIcon
                className={classNames(classes.rightIcon, classes.iconSmall)}
              />
              <FormattedMessage {...messages.btnSave}/>
            </Button>
          </Grid>
        </Grid>
      </ModalMaterialUi>
    );
  }
}

AddScheduleModal.propTypes = {
  // PropTypes
  classes: PropTypes.object,
  isOpenModal: PropTypes.bool,
  currentScheduleId: PropTypes.number,
  onCloseModal: PropTypes.func,
  scheduleModel: PropTypes.object,
  scheduleData: PropTypes.array,
  types: PropTypes.array,
  categories: PropTypes.array,
  onChangeTextField: PropTypes.func,

  onSaveSchedule: PropTypes.func,
  onChangeSimilarId: PropTypes.func,
  similarId: PropTypes.number,
  onValidateSchedule: PropTypes.func,
  intl: PropTypes.any,
  isHoliday: PropTypes.bool,
  remainingHoliday: PropTypes.number
};

export default AddScheduleModal;

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ModalMaterialUi from 'components/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import SelectUI from 'components/SelectUI';
import DatePickerUI from 'components/DatePickerUI';

// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';
import InputUI from 'components/InputUI';
import MultiSelectUI from 'components/MultiSelectUI/MultiSelect';

import { Editor } from '@tinymce/tinymce-react';
import { validateDailyReport } from './actions.js';
import messages from './messages.js';
import reducer from './reducer.js';

import { mapModelDailyReportUiToApi } from './functions.js';
import { styles } from './styles.js';
import { formatDateUtils } from '../../utils/utils.js';
import { Paper } from '@material-ui/core';

// const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
class DailyReportModifiedUi extends React.PureComponent {
  onSaveDailyReport = () => {
    const {
      dailyReportDataModified,
      onUpdateDailyReport,
      onAddDailyReport,
      rowsSelectedId,
    } = this.props;
    const { id } = dailyReportDataModified;
    const dailyReportApi = mapModelDailyReportUiToApi(dailyReportDataModified);
    if (rowsSelectedId) {
      onUpdateDailyReport(rowsSelectedId, dailyReportApi);
    } else {
      onUpdateDailyReport(id.value, dailyReportApi);
      // onAddDailyReport(dailyReportApi);
    }
    return true;
  };

  onChangeTextField = (e) => {
    this.props.onChangeTextField('storeIds', e.target.value);
  };
  render() {
    const {
      openModal,
      onCloseModal,
      dailyReportDataModified,
      onChangeTextField,
      classes,
      titleTable,
      isLoading,
      rowsSelectedId,
      reporterList,
      userList,
      folderLogList,
      onClear,
      onGetIndexDailyReportByUser,
    } = this.props;
    const {
      title,
      content,
      folderLogId,
      userId,
      reporterId,
      date,
    } = dailyReportDataModified;

    return (
      <Grid className={classes.contentEdit}>
        <Paper style={{ padding: 20 }}>
          {/* <Typography variant="h5" id="modal-title">
          {titleTable}
        </Typography> */}
          <div className={classes.wrapper}>
            <form autoComplete="off" autoCorrect="off" autoCapitalize="off">
              <Grid container spacing={24}>
                {/* <Grid item xs={12} sm={6}>
                  <InputUI
                    id="title"
                    name="title"
                    value={title.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.title} />}
                    required
                    textHelperError={title.errorMessage}
                  />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <SelectUI
                    value={userId.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.author} />}
                    options={userList}
                    name="userId"
                    id="userId"
                    textHelperError={userId.errorMessage}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePickerUI
                    value={formatDateUtils(new Date(date.value), 4)}
                    name="date"
                    onChange={(date) =>
                      onGetIndexDailyReportByUser(userId.value, new Date(date))
                    }
                    label={<FormattedMessage {...messages.date} />}
                    id="date"
                    textHelperError={date.errorMessage}
                    maxDate={new Date()}
                  />
                </Grid>

                <Grid item md={12}>
                  <Editor
                    value={content.value}
                    apiKey="q4s5gv2f6brroclpx08k8jydm39k7iqgf79p6qp0mbcghwgb"
                    init={{
                      height: 570,
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
              </Grid>
            </form>
          </div>
        </Paper>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={onClear}
            id="btnCancel"
          >
            <CancelIcon
              className={classNames(classes.rightIcon, classes.smallIcon)}
            />
            <FormattedMessage {...messages.clear} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.onSaveDailyReport}
            className={classes.button}
            id="btnSave"
            disabled={!userId.value}
          >
            <SaveIcon
              className={classNames(classes.rightIcon, classes.iconSmall)}
            />
            <FormattedMessage {...messages.save} />
          </Button>
        </div>
      </Grid>
    );
  }
}

DailyReportModifiedUi.propTypes = {
  isLoading: PropTypes.bool,
  openModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  /**
   * object (null) when add action
   * number : selected row id
   */
  rowsSelectedId: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  deviceDataModified: PropTypes.object,
  dailyReportDataModified: PropTypes.object,
  onChangeTextField: PropTypes.func,
  classes: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onUpdateDailyReport: PropTypes.func,
  onAddDailyReport: PropTypes.func,
  onValidateDailyReport: PropTypes.func,
  onClear: PropTypes.func,
  intl: PropTypes.any,
  reporterList: PropTypes.array,
  userList: PropTypes.array,
  folderLogList: PropTypes.array,
  onGetIndexDailyReportByUser: PropTypes.func,
};

DailyReportModifiedUi.defaultProps = {
  openModal: false,
  title: 'Add dailyReport',
};

export function mapDispatchToProps(dispatch) {
  return {
    onValidateDailyReport: (errors) => dispatch(validateDailyReport(errors)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'dailyReport', reducer });

export default compose(
  withConnect,
  withReducer,
  injectIntl,
)(withStyles(styles)(DailyReportModifiedUi));

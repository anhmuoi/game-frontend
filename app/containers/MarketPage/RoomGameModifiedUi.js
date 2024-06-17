import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ModalMaterialUi from 'components/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
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
import { validateMarket } from './actions.js';
import messages from './messages.js';
import reducer from './reducer.js';

import { mapModelMarketUiToApi } from './functions.js';
import { styles } from './styles.js';

// const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
class MarketModifiedUi extends React.PureComponent {
  onSaveMarket = () => {
    const {
      marketDataModified,
      onUpdateMarket,
      onAddMarket,
      rowsSelectedId,
    } = this.props;
    const marketApi = mapModelMarketUiToApi(marketDataModified);
    if (rowsSelectedId) {
      onUpdateMarket(rowsSelectedId, marketApi);
    } else {
      onAddMarket(marketApi);
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
      marketDataModified,
      onChangeTextField,
      classes,
      titleTable,
      isLoading,
      storeList,
      rowsSelectedId,
    } = this.props;
    const {
      name,
      isRunning,
      description,
      totalPeople,
      currentPeople,
      price,
    } = marketDataModified;

    return (
      <ModalMaterialUi
        isOpenModal={openModal}
        onCloseModal={onCloseModal}
        isLoading={isLoading}
      >
        <React.Fragment>
          <Typography variant="h5" id="modal-title">
            {titleTable}
          </Typography>
          <br />
          <div className={classes.wrapper}>
            <form autoComplete="off" autoCorrect="off" autoCapitalize="off">
              <Grid container spacing={24}>
                <Grid item xs={12} sm={6}>
                  <InputUI
                    id="name"
                    name="name"
                    value={name.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.name} />}
                    required
                    textHelperError={name.errorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputUI
                    id="totalPeople"
                    name="totalPeople"
                    value={totalPeople.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.totalPeople} />}
                    required
                    textHelperError={totalPeople.errorMessage}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputUI
                    id="price"
                    name="price"
                    value={price.value}
                    onChange={onChangeTextField}
                    label={<FormattedMessage {...messages.price} />}
                    required
                    textHelperError={price.errorMessage}
                  />
                </Grid>

                <Grid item md={12}>
                  <Editor
                    value={description.value}
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
                      this.props.onChangeTextField('description', content)
                    }
                  />
                </Grid>
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
              onClick={this.onSaveMarket}
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

MarketModifiedUi.propTypes = {
  isLoading: PropTypes.bool,
  openModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  /**
   * object (null) when add action
   * number : selected row id
   */
  rowsSelectedId: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  deviceDataModified: PropTypes.object,
  marketDataModified: PropTypes.object,
  onChangeTextField: PropTypes.func,
  classes: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onUpdateMarket: PropTypes.func,
  onAddMarket: PropTypes.func,
  onValidateMarket: PropTypes.func,
  intl: PropTypes.any,
};

MarketModifiedUi.defaultProps = {
  openModal: false,
  title: 'Add market',
};

export function mapDispatchToProps(dispatch) {
  return {
    onValidateMarket: (errors) => dispatch(validateMarket(errors)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'market', reducer });

export default compose(
  withConnect,
  withReducer,
  injectIntl,
)(withStyles(styles)(MarketModifiedUi));

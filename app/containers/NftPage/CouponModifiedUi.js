import React from 'react';
import PropTypes from 'prop-types';
import ModalMaterialUi from 'components/Modal';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AppBar, Checkbox, Tab, Tabs, Tooltip } from '@material-ui/core';
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

import messages from './messages';
import DateTimePickerUI from 'components/DateTimePickerUI';
import reducer from './reducer';
import { changeTextFieldCoupon, validateCoupon } from './actions';
import { localstoreUtilites } from '../../utils/persistenceData';
import { stylesCouponModify } from './styles.js';
import { mapModelCouponUiToApi } from './functions.js';
import { Editor } from '@tinymce/tinymce-react';
import { isUseExpireDateOption } from '../../utils/translation.js';
import {
  ConfirmationNumber,
  Language,
  Settings,
  Translate,
} from '@material-ui/icons';

// const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
class CouponModifiedUi extends React.PureComponent {
  state = {
    tabSelected: 0,
  };
  onSaveCoupon = () => {
    const {
      onUpdateCoupon,
      onAddCoupon,
      couponDataModified,
      couponIdSelected,
      couponList,
    } = this.props;

    const couponApi = mapModelCouponUiToApi(couponDataModified);

    if (couponIdSelected) {
      onUpdateCoupon(couponIdSelected, couponApi);
    } else {
      onAddCoupon(couponApi);
    }
    this.setState({
      tabSelected: 0,
    });
    this.props.onCloseModal();
  };

  onChangeImageCoupon = (e, name) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.props.onChangeTextFieldCoupon(name, reader.result);
    };
    reader.readAsDataURL(file);
  };
  onChangeTab = (event, value) => {
    this.setState({ tabSelected: value });
  };
  onCloseModal = () => {
    this.props.onCloseModal();
    this.setState({
      tabSelected: 0,
    });
  };

  render() {
    const { tabSelected } = this.state;
    const {
      openModal,
      onCloseModal,
      couponDataModified,
      onChangeTextFieldCoupon,
      classes,
      titleModify,
      isLoading,
      couponIdSelected,
      expiredTypeCouponSelector,
      refundTypeCouponSelector,
    } = this.props;
    const { id, name, description, image, mana, aliasId } = couponDataModified;

    return (
      <ModalMaterialUi
        isOpenModal={openModal}
        onCloseModal={this.onCloseModal}
        isLoading={isLoading}
        onSave={this.onSaveCoupon}
        shapeModal={{
          width: '70%',
          top: '10%',
          left: '15%',
        }}
        onCancel={this.onCloseModal}
      >
        <React.Fragment>
          <Typography variant="h5" id="modal-title">
            {titleModify}
          </Typography>
          <br />

          <Grid container direction="row" spacing={24}>
            <Grid item md={6} sm={12}>
              <InputUI
                id="name"
                name="name"
                value={name.value}
                onChange={onChangeTextFieldCoupon}
                label={<FormattedMessage {...messages.name} />}
                // required
                textHelperError={name.errorMessage}
                autoFocus
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <InputUI
                id="description"
                name="description"
                value={description.value}
                onChange={onChangeTextFieldCoupon}
                label={<FormattedMessage {...messages.description} />}
                // required
                textHelperError={description.errorMessage}
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <InputUI
                id="mana"
                name="mana"
                value={mana.value}
                onChange={onChangeTextFieldCoupon}
                label={<FormattedMessage {...messages.mana} />}
                // required
                typeInput="number"
                textHelperError={mana.errorMessage}
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <InputUI
                id="aliasId"
                name="aliasId"
                value={aliasId.value}
                onChange={onChangeTextFieldCoupon}
                label={<FormattedMessage {...messages.aliasId} />}
                // required
                textHelperError={aliasId.errorMessage}
              />
            </Grid>

            <Grid item style={{ flex: 1 }}>
              <form autoComplete="off" autoCorrect="off" autoCapitalize="off">
                <Grid container spacing={24}>
                  <Grid item md={4} sm={12}>
                    <label htmlFor="image" className={classes.uploadImg}>
                      {<FormattedMessage {...messages.image} />}
                    </label>{' '}
                    <label htmlFor="image">
                      <input
                        style={{ display: 'none' }}
                        accept="image/*"
                        id="image"
                        multiple
                        type="file"
                        onChange={(e) => this.onChangeImageCoupon(e, 'image')}
                      />

                      <a href={null} style={{ cursor: 'pointer' }}>
                        {image.value ? (
                          <img
                            src={image.value ? image.value : null}
                            width="100%"
                            height="300"
                            style={{
                              borderRadius: '5px',
                              marginTop: '5px',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '300px',
                              border: '1px dashed gray',
                              textAlign: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography>
                              <FormattedMessage {...messages.chooseImage} />
                            </Typography>
                          </div>
                        )}
                      </a>
                    </label>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </React.Fragment>
      </ModalMaterialUi>
    );
  }
}

CouponModifiedUi.propTypes = {
  isLoading: PropTypes.bool,
  openModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  /**
   * object (null) when add action
   * number : selected row id
   */
  rowsSelectedId: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  deviceDataModified: PropTypes.object,
  couponDataModified: PropTypes.object,
  onChangeTextField: PropTypes.func,
  classes: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onUpdateCoupon: PropTypes.func,
  onAddCoupon: PropTypes.func,
  onValidateCoupon: PropTypes.func,
  intl: PropTypes.any,
  expiredTypeCouponSelector: PropTypes.array,
  refundTypeCouponSelector: PropTypes.array,
};

CouponModifiedUi.defaultProps = {
  openModal: false,
  title: 'Add coupon',
};

export function mapDispatchToProps(dispatch) {
  return {
    onValidateCoupon: (errors) => dispatch(validateCoupon(errors)),
    onChangeTextFieldCoupon: (evt, value) => {
      if (!evt.target) {
        dispatch(changeTextFieldCoupon(evt, value));
      } else {
        dispatch(changeTextFieldCoupon(evt.target.name, evt.target.value));
      }
    },
  };
}

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'itemNft', reducer });

export default compose(
  withConnect,
  withReducer,
  injectIntl,
)(withStyles(stylesCouponModify)(CouponModifiedUi));

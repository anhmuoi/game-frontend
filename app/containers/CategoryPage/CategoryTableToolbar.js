import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import reactCSS from 'reactcss'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { parse, format } from 'date-fns';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import {
  withStyles,
  Grid,
  Toolbar,
  Typography,
  Button,
  Input,
  Checkbox,
  FormControlLabel,
  Hidden,
  Fab,
  Tooltip,
  InputLabel
} from '@material-ui/core';
import { SketchPicker } from 'react-color'
import { lighten, fade } from '@material-ui/core/styles/colorManipulator';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import MultiSelectUI from 'components/MultiSelectUI/MultiSelect';

import InputUI from 'components/InputUI';
import SelectUI from 'components/SelectUI';
import DatePickerUI from 'components/DatePickerUI';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import ModalMaterialUi from 'components/Modal';
import { makeSelectError, makeSelectLoading } from 'containers/App/selectors';

import { getFieldsFromModel } from './categoryUtilities';
import { makeCategoryModelSelector } from './selectors';
import messages from './messages';
import reducer from './reducer';
import {
  changeTextField,
  toggleCheckbox,
  postCategoryAdd,
  putCategoryUpdate,
  resetCategoryModel,
  validateModel,
  validateCategory,
} from './actions';
// import AddCategoryModal from './AddCategoryModal';
import SearchUI from '../../components/SearchUI/index.js';
export const dateFormat = 'MM.dd.yyyy';
import { colorDelete } from '../../utils/constants.js';

export const toolbarStyles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  fab: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
    pointerEvents: 'auto !important',
    cursor: 'pointer !important',
    boxShadow:
      '0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.07), 0px 1px 18px 0px rgba(0,0,0,0.06)',
  },
  button: {
    margin: theme.spacing.unit,
    width: 100,
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  },
  search: {
    float: 'right',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: '-60px',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    // paddingTop: theme.spacing.unit,
    // paddingRight: theme.spacing.unit,
    // paddingBottom: theme.spacing.unit,
    // paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  grid: {
    // Fix overscroll bug
    width: '100%',
    margin: 0,
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  buttons: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'center',
  },
  styleLabel:{
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    fontSize: '1rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1,
    transform: 'translate(0, 1.5px) scale(0.75) !important',
    transformOrigin: 'top left',
  }
});

export class CategoryTableToolbar extends React.Component {
  state = {
    showDeleteConfirmation: false,
    showAddMultiesModal: false,
    displayColorPicker: false,
    categoryColor: '#000000'
  };

  onConfirmSaveCategory = () => {
    // only display confirmation on update
    const categoryApi = this.props.categoryModel.toJS();
    const { updateCategory, addCategory, intl, onValidateCategory } = this.props;

    const categoryId = categoryApi.id.value;

    const category = getFieldsFromModel(
      [
        'name',
        'description',
        'type',
        'color',
      ],
      categoryApi,
    );

    let isValid = true;
    const errorList = [];
    if (!category.name) {
      errorList.push({
        field: 'name',
        message: intl.formatMessage({ ...messages.invalidCategoryName }),
      });
      isValid = false;
    }

    console.log(category);
    if (!isValid) {
      onValidateCategory(errorList);
    } else if (categoryId > 0) {
      updateCategory(categoryId, category);
    } else {
      addCategory(category);
    }
  };

  addCategory = () => {
    this.props.resetModel();
    // this.props.getCategoryInfo(6);
    this.props.openModal();
  };

  handleInputSearchChange = (ev) => {
    this.props.searchCategory({
      pageNumber: 1,
      pageSize: 25,
      sortColumn: 0,
      sortDirection: 'desc',
      search: ev.target.value,
    });
  };
  onChangeNumberField = (ev) => {
    this.props.onChangeTextField(
      ev.target.name,
      ev.target.value.length > 0 ? Number(ev.target.value) : '',
    );
  };

  onCloseDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: false,
    });
  };
  onShowDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: true,
    });
  };

  ToggleMultiesModal = async () => {
    const { showAddMultiesModal } = this.state;
    await this.setState({
      showAddMultiesModal: !showAddMultiesModal,
    });
  };
  onChangeFilter = (name, value) => {
    this.setState({
      [name]: value,
    });
  };


  // change color
  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    console.log(color.hex);
    this.setState({categoryColor: color.hex});
    this.props.onChangeTextField(
      'color',
      color.hex
    );
  };

  render() {
    const { showAddMultiesModal, displayColorPicker } = this.state;
    const {
      classes,
      title,
      isSelectMultiesRow,
      categoryModel,
      onChangeTextField,
      isOpenModal,
      closeModal,
      loading,
      viewOnly,
      permission,
      // enqueueSnackbar,
      typeFilter,
      typeListSelector,

      onChangeFilter,
      onSearchDataTable
    } = this.props;
    const { showDeleteConfirmation } = this.state;
    const {
      id,
      name,
      type,
      description,
      color
    } = categoryModel.toJS();
    
    const styles = reactCSS({
      'default': {
        color: {
          width: '20px',
          height: '20px',
          borderRadius: '2px',
          background: `${color.value}`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          bottom: '99px',
          top: '10px',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <React.Fragment>
        {/* <AddCategoryModal
          classes={classes}
          isOpenModal={showAddMultiesModal}
          closeModal={this.ToggleMultiesModal}
          // enqueueSnackbar={enqueueSnackbar}
          addCategory={addCategory}
          typeListSelector={typeListSelector}
        /> */}
        <ModalMaterialUi
          isOpenModal={isOpenModal}
          onCloseModal={closeModal}
          isLoading={loading}
        >
          <React.Fragment>
            <Typography variant="h6" id="modalTitle">
              {id.value > 0 ? (
                <FormattedMessage {...messages.titleEdit} />
              ) : (
                <FormattedMessage {...messages.titleAdd} />
              )}
            </Typography>
            <Grid container spacing={24} className={classes.grid}>
              <Grid item xs={12} sm={6}>
                <InputUI
                  id="name"
                  name="name"
                  autoFocus
                  value={name.value}
                  onChange={onChangeTextField}
                  typeInput="text"
                  label={<FormattedMessage {...messages.name} />}
                  required
                  textHelperError={name.errorMessage}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <InputUI
                  id="description"
                  name="description"
                  // autoFocus
                  value={description.value}
                  onChange={onChangeTextField}
                  typeInput="text"
                  label={<FormattedMessage {...messages.description} />}
                  textHelperError={description.errorMessage}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectUI
                  value={type.value}
                  onChange={onChangeTextField}
                  label={<FormattedMessage {...messages.categoryType} />}
                  options={typeListSelector}
                  name="type"
                  id="type"
                  textHelperError={type.errorMessage}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                
                <Grid style={{display: 'flex', flexDirection: 'column'}}>
                  <InputLabel className={classes.styleLabel} shrink>
                    {<FormattedMessage {...messages.color} />}
                  </InputLabel>
                  <Grid style={{ paddingTop: 13}}>
                      <Grid style={ styles.color } onClick={ this.handleClick }></Grid>
                  </Grid>
                </Grid>
                { displayColorPicker ? <Grid style={ styles.popover }>
                  <Grid style={ styles.cover } onClick={ this.handleClose }/>
                  <SketchPicker color={ color.value } name='color' onChange={ this.handleChange } triangle='hide'/>
                </Grid> : null }
              </Grid>
            </Grid>
            <Grid className={classes.buttons}>
              <Button
                variant="contained"
                color="default"
                aria-label="Cancel"
                onClick={closeModal}
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
                onClick={this.onConfirmSaveCategory}
                className={classes.button}
                id="btnSave"
              >
                <SaveIcon
                  className={classNames(classes.rightIcon, classes.iconSmall)}
                />
                <FormattedMessage {...messages.btnSave} />
              </Button>
            </Grid>
          </React.Fragment>
        </ModalMaterialUi>
        <AlertDialogSlideUI
          onOpen={showDeleteConfirmation}
          messsage={<span />}
          title={
            <span>
              <FormattedMessage {...messages.confirmDelete} />
            </span>
          }
          onActionAgree={this.props.deleteMultipleCategory}
          onCloseDialog={this.onCloseDeleteConfirmation}
        />
        <Toolbar className={classes.root}>
          <Hidden smDown>
            <React.Fragment>
              <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                  {title}
                </Typography>
              </div>
            </React.Fragment>
          </Hidden>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Grid item style={{ marginRight: '16px' }}>
              <FormattedMessage {...messages.searchBox}>
                 {(searchBox) => (
                   <SearchUI onSearchData={(e) => onSearchDataTable(e.target.value)} placeholder={searchBox}/>
                 )}
               </FormattedMessage>
            </Grid>
            <Grid item md={2} style={{ marginRight: '16px' }}>
              <MultiSelectUI
                value={typeFilter}
                onChange={onChangeFilter}
                options={typeListSelector}
                name="typeFilter"
                label={<FormattedMessage {...messages.categoryType} />}
              />
            </Grid>
            {!viewOnly && (
              <Grid item>
                <div className={classes.actions}>
                  {permission.addCategory && (
                    <React.Fragment>
                      <Fab
                        color="primary"
                        aria-label="Add"
                        className={classes.fab}
                        onClick={this.addCategory}
                      >
                        <Tooltip
                          title={<FormattedMessage {...messages.addCategory} />}
                        >
                          <AddIcon />
                        </Tooltip>
                      </Fab>
                    </React.Fragment>
                  )}
                  {permission.deleteCategory && (
                    <Fab
                      color="secondary"
                      aria-label="DeleteAll"
                      className={classes.fab}
                      onClick={this.onShowDeleteConfirmation}
                      disabled={!isSelectMultiesRow}
                      style={
                        !isSelectMultiesRow
                          ? {}
                          : { color: 'white', background: colorDelete }
                      }
                    >
                      <Tooltip
                        title={<FormattedMessage {...messages.delete} />}
                      >
                        <DeleteIcon />
                      </Tooltip>
                    </Fab>
                  )}
                </div>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </React.Fragment>
    );
  }
}

CategoryTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  onDeleteMultiesRow: PropTypes.func,
  loading: PropTypes.bool,
  isOpenModal: PropTypes.bool,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isSelectMultiesRow: PropTypes.bool,
  categoryModel: PropTypes.object,
  // getCategoryInfo: PropTypes.func,
  onChangeTextField: PropTypes.func,
  onToggleCheckbox: PropTypes.func,
  validateModel: PropTypes.func,
  resetModel: PropTypes.func,
  addCategory: PropTypes.func,
  updateCategory: PropTypes.func,
  searchCategory: PropTypes.func,
  deleteMultipleCategory: PropTypes.func,
  viewOnly: PropTypes.bool,
  intl: PropTypes.any,
  onValidateCategory: PropTypes.func,
  permission: PropTypes.object,
  typeFilter: PropTypes.array,
  onChangeFilter: PropTypes.func,
  onSearchDataTable: PropTypes.func
  // enqueueSnackbar: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    validateModel: (newModel) => dispatch(validateModel(newModel)),
    onValidateCategory: (errors) => dispatch(validateCategory(errors)),
    resetModel: () => dispatch(resetCategoryModel()),
    addCategory: (category, callBack, errorCallBack) =>
      dispatch(postCategoryAdd(category, callBack, errorCallBack)),
    updateCategory: (id, category) => dispatch(putCategoryUpdate(id, category)),
    onChangeTextField: (ev, date) => {
      if (!ev.target) {
        dispatch(changeTextField(ev, date));
      } else {
        dispatch(changeTextField(ev.target.name, ev.target.value));
      }
    },
    onToggleCheckbox: (ev) => {
      dispatch(toggleCheckbox(ev.target.name));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  categoryModel: makeCategoryModelSelector(),
});

export const CategoryTableToolbarTest = withStyles(toolbarStyles)(
  CategoryTableToolbar,
);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'category', reducer });

export default compose(
  withConnect,
  withReducer,
  injectIntl,
)(withStyles(toolbarStyles)(CategoryTableToolbar));

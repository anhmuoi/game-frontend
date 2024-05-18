import React from 'react';
import ModalMaterialUi from 'components/Modal';
import { PropTypes } from 'prop-types';
import { Typography, Button, FormControl } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Save';
import InputUI from 'components/InputUI';
import SelectUI from 'components/SelectUI';
import Autocomplete from 'components/Autocomplete';
import { FormattedMessage, injectIntl } from 'react-intl';
import FindUserModal from 'components/FindUserModal/FindUserModal.js';
// import { FILE_PAGE_FIELD_HIDE_SETTING } from 'utils/constants';
import messages from './messages';

export const headers = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
  },

  {
    id: 'position',
    label: <FormattedMessage {...messages.position} />,
  },

  {
    id: 'phone',
    label: <FormattedMessage {...messages.phone} />,
  },
];

/* eslint-disable */
const flatDeep = (arr, d = 1) =>
  d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(
            val.children.length > 0
              ? [val, ...flatDeep(val.children, d - 1)]
              : val,
          ),
        [],
      )
    : arr.slice();
/* eslint-enable */
class AddDepartmentModal extends React.Component {
  state = {
    openFindUserModal: false,
  };
  onCloseModal = () => {
    const { store } = this.props;
    store.toogleAddDepartment();
  };

  onSubmit = async () => {
    const { store, enqueueSnackbar, intl } = this.props;
    const { edittingDeparment } = store.state;

    const errors = {};
    if (!edittingDeparment.name) {
      errors.name = intl.formatMessage({
        ...messages.invalidname,
      });
    }
    if (!edittingDeparment.number) {
      errors.number = intl.formatMessage({
        ...messages.invalidnumber,
      });
    }

    if (Object.keys(errors).length !== 0) {
      store.validateDepartment(errors);
      return false;
    }

    try {
      const data = edittingDeparment.isNew
        ? await store.addDepartment()
        : await store.updateDepartment();
      // console.log(data);
      await store.initData();
      await this.onCloseModal();
      await enqueueSnackbar(data.message, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(error.errors.map((err) => err.message).join(' '), {
        variant: 'error',
      });
      console.log(error);
    }

    return true;
  };

  getDepartment = (input) => {
    const { store } = this.props;
    const { departments } = store.state;
    const allDepartments = flatDeep(departments, Infinity);

    return (
      allDepartments
        .filter((item) => item.name.toLowerCase().includes(input.toLowerCase()))
        // .slice(0, 5)
        .map((item) => ({
          id: item.id,
          label: `${item.name}`,
        }))
    );
  };

  findUser = () => {
    this.setState({ openFindUserModal: true });
    this.props.onGetUserData();
  };

  onCloseFindUserModal = () => {
    this.setState({ openFindUserModal: false });
  };

  inputUser = async (user) => {
    const { store } = this.props;
    if (user) {
      const { accountId, name } = user;
      await store.onChangeField('departmentManagerId', accountId);
      await store.onChangeField('departmentManager', name);
    }
  };

  render() {
    const { openFindUserModal } = this.state;
    const {
      show,
      classes,
      store,
      userData,
      userMeta,
      userHeader,
      onGetUserData,
      onChangeUserMeta,
    } = this.props;
    const {
      departments,
      // accounts,
      edittingDeparment,
    } = store.state;
    const allDepartments = flatDeep(departments, Infinity);
    return (
      <ModalMaterialUi onCloseModal={this.onCloseModal} isOpenModal={show}>
        <React.Fragment>
          <FindUserModal
            data={userData}
            headers={headers}
            // orderHeader={makeTableArmyHeader(userHeaders)}
            meta={userMeta}
            classes={classes}
            open={openFindUserModal}
            close={this.onCloseFindUserModal}
            onInputUser={this.inputUser}
            onSearchUserDataTable={async (evt) => {
              await onChangeUserMeta('search', evt.target.value);
              onGetUserData();
            }}
            onChangePageNumber={(pageNumber) =>
              onChangeUserMeta('pageNumber', pageNumber)
            }
            onChangePageSize={(pageSize) =>
              onChangeUserMeta('pageSize', pageSize)
            }
            onChangePagingRemote={onGetUserData}
            title={<FormattedMessage {...messages.titleFindUser} />}
          />
          <Typography
            className={classes.dialogTitle}
            variant="h5"
            id="form-dialog-title"
          >
            {!edittingDeparment.isNew ? (
              <FormattedMessage {...messages.update} />
            ) : null}
            {edittingDeparment.isNew ? (
              <FormattedMessage {...messages.add} />
            ) : null}
          </Typography>
          <FormControl className={classes.input} fullWidth>
            <InputUI
              onChange={(evt) =>
                store.onChangeField('number', evt.target.value)
              }
              name="number"
              id="number"
              defaultValue={edittingDeparment && edittingDeparment.number}
              label={<FormattedMessage {...messages.number} />}
              textHelperError={edittingDeparment.errors.number}
              required
            />
          </FormControl>
          <FormControl className={classes.input} fullWidth>
            <InputUI
              name="name"
              id="name"
              onChange={(evt) => store.onChangeField('name', evt.target.value)}
              defaultValue={edittingDeparment && edittingDeparment.name}
              label={<FormattedMessage {...messages.name} />}
              textHelperError={edittingDeparment.errors.name}
              required
            />
          </FormControl>
          <FormControl className={classes.input} fullWidth>
            <SelectUI
              name="departmentManagerId"
              id="departmentManagerId"
              disabled
              // onChange={evt =>
              //   store.onChangeField('departmentManagerId', evt.target.value)
              // }
              value={edittingDeparment && edittingDeparment.departmentManagerId}
              options={[
                {
                  id: edittingDeparment.departmentManagerId,
                  name: edittingDeparment.departmentManager,
                },
              ]}
              label={<FormattedMessage {...messages.managerEmail} />}
              onClick={this.findUser}
            />
          </FormControl>
          <FormControl className={classes.input} fullWidth>
            <Autocomplete
              required
              classes={{}}
              id="parentId"
              name="parentId"
              label={<FormattedMessage {...messages.parentDepartment} />}
              getSuggestions={this.getDepartment}
              onSelect={async (item) => {
                if (item) {
                  store.onChangeField('parentId', item.id);
                }
              }}
              placeholder={
                allDepartments.find(
                  (dept) => dept.id === edittingDeparment.parentId,
                ) &&
                allDepartments.find(
                  (dept) => dept.id === edittingDeparment.parentId,
                ).name
              }
            />
            {/* <SelectUI
              name="parentId"
              id="parentId"
              onChange={evt =>
                store.onChangeField('parentId', evt.target.value)
              }
              value={(edittingDeparment && edittingDeparment.parentId) || 0}
              options={[
                { id: 0, name: 'None' },
                ...allDepartments.map(dept => ({
                  id: dept.id,
                  name: dept.name,
                })),
              ]}
              label={<FormattedMessage {...messages.parentDepartment} />}
            /> */}
          </FormControl>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.button}
              id="close"
              color="default"
              variant="contained"
              onClick={this.onCloseModal}
            >
              <DeleteIcon className={classes.rightIcon} />
              <FormattedMessage {...messages.cancel} />
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              id="submit"
              onClick={this.onSubmit}
            >
              <DoneIcon className={classes.rightIcon} />
              <FormattedMessage {...messages.ok} />
            </Button>
          </div>
        </React.Fragment>
      </ModalMaterialUi>
    );
  }
}

AddDepartmentModal.propTypes = {
  show: PropTypes.bool,
  id: PropTypes.string,
  classes: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  store: PropTypes.object,
  intl: PropTypes.any,
  userData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  userMeta: PropTypes.object,
  userHeader: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onGetUserData: PropTypes.func,
  onChangeUserMeta: PropTypes.func,
};
export default injectIntl(AddDepartmentModal);

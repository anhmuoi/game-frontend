import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Grid } from '@material-ui/core';
import ModalMaterialUi from 'components/Modal';
import PropTypes from 'prop-types';
import EnhancedTable from 'components/Datatables';
import FindUserTableToolbar from './FindUserTableToolbar';
import messages from './messages';
class FindSoldierModal extends React.Component {
  state = {
    selectedUser: [],
  };
  rowsSelected = (ids) => {
    // console.log(ids[0]);
    this.setState({ selectedUser: ids[0] });
  };
  onCloseModal = () => {
    this.props.close();
  };

  inputUser = () => {
    const { selectedUser } = this.state;
    const { data } = this.props;
    const getUser = data.find((item) => item.id === selectedUser);
    this.props.onInputUser(getUser);
    this.props.close();
  };

  clearUser = () => {
    this.props.onInputUser(null);
    this.props.close();
  };

  render() {
    const {
      classes,
      open,
      data,
      headers,
      meta,
      onSearchUserDataTable,
      onChangePageNumber,
      onChangePageSize,
      onChangePagingRemote,
      orderHeader,
      title,
      onChangeHeaderVisibles,
      onPatchHeaderColumns,
      id,
    } = this.props;
    const tableHeight = 'calc(100vh - 526px)';
    return (
      <ModalMaterialUi onCloseModal={this.onCloseModal} isOpenModal={open}>
        <React.Fragment>
          <EnhancedTable
            id={id || 'FindUserModal'}
            data={data}
            headers={headers}
            onPagingRemote={onChangePagingRemote}
            spanColum={headers.length + 1}
            onChangePageNumber={onChangePageNumber}
            onChangePageSize={onChangePageSize}
            meta={meta}
            isNotCheckedRow
            isEnableSelectedRow
            rowsSelected={this.rowsSelected}
            tableHeight={tableHeight}
            onAddCardUser={this.addCardInUser}
            orderHeader={orderHeader}
            onChangeHeaderVisibles={onChangeHeaderVisibles}
            onPatchHeaderColumns={onPatchHeaderColumns}
            onDoubleClick={this.inputUser}
          >
            <FindUserTableToolbar
              classes={classes}
              onSearchDataTable={onSearchUserDataTable}
              title={title}
              meta={meta}
            />
          </EnhancedTable>
          <div style={{ display: 'flex' }}>
            <Button
              id="btnInputUser"
              className={classes.modalButton}
              variant="contained"
              color="primary"
              onClick={this.inputUser}
              style={{ margin: '20px auto' }}
            >
              <FormattedMessage {...messages.btnSave} />
            </Button>
            <Button
              id="btnClearUser"
              className={classes.modalButton}
              variant="contained"
              color="default"
              onClick={this.clearUser}
              style={{ margin: '20px auto' }}
            >
              <FormattedMessage {...messages.clear} />
            </Button>
          </div>
        </React.Fragment>
      </ModalMaterialUi>
    );
  }
  static get propTypes() {
    return {
      classes: PropTypes.object,
      open: PropTypes.bool,
      title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      headers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      meta: PropTypes.object,
      close: PropTypes.func,
      onInputUser: PropTypes.func,
      onSearchUserDataTable: PropTypes.func,
      onChangePageNumber: PropTypes.func,
      onChangePageSize: PropTypes.func,
      onChangePagingRemote: PropTypes.func,
      orderHeader: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      onChangeHeaderVisibles: PropTypes.func,
      onPatchHeaderColumns: PropTypes.func,
      id: PropTypes.string,
    };
  }
}

export default FindSoldierModal;

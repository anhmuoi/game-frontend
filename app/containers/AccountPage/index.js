/*
 * AccountPage
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { RESTART_ON_REMOUNT, API_COLUMNS } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectError, makeSelectLoading } from 'containers/App/selectors';
import EnhancedTable from 'components/Datatables';

import AccountModifiedUi from './AccountModifiedUi';
import AccountTableToolbar from './AccountTableToolbar';
import {
  getAccountData,
  getAjaxInfo,
  getMetaPagingAccount,
  getAccountDataModified,
} from './selectors';
import {
  deleteAccount,
  deleteMultiesAccount,
  changePageNumberAccount,
  changePageSizeAccount,
  getAccountInit,
  changeTextField,
  putAccountUpdate,
  postAccountAdd,
  getInitIndexAccount,
  getSortAccountList,
  getSortDirectionAccountList,
} from './actions';

import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import { localstoreUtilites } from '../../utils/persistenceData';
import { makeTableHeader } from '../App/appUtilities';
const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
// const isArmyManagement = localstoreUtilites.getPluginsFromLocalStorage().armyManagement || false;
export const headers = [
  {
    id: 'email',
    label: <FormattedMessage {...messages.account} />,
  },
  {
    id: 'userName',
    label: <FormattedMessage {...messages.name} />,
  },
  {
    id: 'department',
    label: <FormattedMessage {...messages.department} />,
  },
  {
    id: 'role',
    label: <FormattedMessage {...messages.headerRole} />,
  },
  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: '##',
    width: '50px',
  },
];

export class AccountPage extends React.PureComponent {
  state = {
    accountsIdSelected: [],
    searchTxt: '',
    openModal: false,
    rowsSelectedId: null,
  };

  UNSAFE_componentWillMount() {
    this.getDataAccountTable(null);
  }

  getDataAccountTable(searchText) {
    this.props.onGetAccountData(searchText);
  }

  deleteMultiesAccount = () => {
    const { accountsIdSelected } = this.state;
    this.props.onDeleteMultiesAccount(accountsIdSelected);
  };

  rowsSelected = (ids) => this.setState({ accountsIdSelected: ids });
  deleteRow = (id) => this.props.onDeleteAccount(id);
  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      searchTxt,
    });
    // call props filter Account on table
    this.getDataAccountTable(searchTxt);
  };

  changePageNumber = (pageNumber) => this.props.onChangePageNumber(pageNumber);
  changePageSize = (pageSize) => this.props.onChangePageSize(pageSize);
  pagingRemote = () => this.props.onGetAccountData(this.state.searchTxt);

  UNSAFE_componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      this.props.enqueueSnackbar(ajaxSuccess.message, {
        variant: 'success',
      });

      this.onCloseModal();
    }
  }

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  addAccount = () => {
    /**
     * 0: add
     * else: edit
     */
    this.props.onInitIndexAccount(0);
    this.setState({ openModal: true, rowsSelectedId: null });
  };

  editRow = (id) => {
    this.props.onInitIndexAccount(id);
    this.setState({ openModal: true, rowsSelectedId: id });
  };

  getTitleModal = () => {
    const { rowsSelectedId } = this.state;
    return rowsSelectedId ? (
      <FormattedMessage {...messages.editTitleModal} />
    ) : (
      <FormattedMessage {...messages.addTitleModal} />
    );
  };

  getSortColumn = (sortColumn, value) => {
    const cloneSortColumn = API_COLUMNS.ACCOUNTS.indexOf(value);
    this.props.onGetSortColumn(sortColumn, cloneSortColumn);
  };

  getSortDirection = () => {
    this.props.onGetSortDirection();
  };
  render() {
    const { accountsIdSelected, openModal, rowsSelectedId } = this.state;
    const {
      datas,
      meta,
      accountDataModified,
      onChangeTextField,
      onUpdateAccount,
      onAddAccount,
      loading,
    } = this.props;

    return (
      <React.Fragment>
        <AccountModifiedUi
          title={this.getTitleModal()}
          accountDataModified={accountDataModified.toJS()}
          rowsSelectedId={rowsSelectedId}
          openModal={openModal}
          onCloseModal={this.onCloseModal}
          onChangeTextField={onChangeTextField}
          onAddAccount={onAddAccount}
          onUpdateAccount={onUpdateAccount}
          isLoading={loading}
        />
        <EnhancedTable
          id="AccountList"
          data={datas}
          headers={headers}
          onPagingRemote={this.pagingRemote}
          onEditRow={this.editRow}
          onDeleteRow={this.deleteRow}
          spanColum={headers.length + 1}
          rowsSelected={this.rowsSelected}
          onChangePageNumber={this.changePageNumber}
          onChangePageSize={this.changePageSize}
          meta={meta}
          localUsername={localUsername}
          isEditShowModal
          notViewAction={false}
          orderHeader={makeTableHeader(headers)}
          onChangeSortColumn={this.getSortColumn}
          onChangeSortDirection={this.getSortDirection}
          isFold
        >
          <AccountTableToolbar
            title={<FormattedMessage {...messages.titleTable} />}
            onSearchDataTable={this.searchDataTable}
            onDeleteMultiesRow={this.deleteMultiesAccount}
            isSelectMultiesRow={accountsIdSelected.length !== 0}
            onAddAccount={this.addAccount}
          />
        </EnhancedTable>
      </React.Fragment>
    );
  }
}

AccountPage.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  datas: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onGetAccountData: PropTypes.func,
  onEditAccount: PropTypes.func,
  onDeleteAccount: PropTypes.func,
  ajaxInfo: PropTypes.object,
  onDeleteMultiesAccount: PropTypes.func,
  meta: PropTypes.object,
  onChangePageNumber: PropTypes.func,
  onChangePageSize: PropTypes.func,
  accountDataModified: PropTypes.object,
  onChangeTextField: PropTypes.func,
  onUpdateAccount: PropTypes.func,
  onAddAccount: PropTypes.func,
  onInitIndexAccount: PropTypes.func,
  onGetSortColumn: PropTypes.func,
  onGetSortDirection: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    // modified account
    onUpdateAccount: (id, account) => dispatch(putAccountUpdate(id, account)),
    onAddAccount: (account) => dispatch(postAccountAdd(account)),
    onInitIndexAccount: (id) => dispatch(getInitIndexAccount(id)),
    // account index
    onGetAccountData: (searchText) => dispatch(getAccountInit(searchText)),
    onDeleteAccount: (id) => dispatch(deleteAccount(id)),
    onDeleteMultiesAccount: (ids) => dispatch(deleteMultiesAccount(ids)),
    onChangePageNumber: (pageNumber) =>
      dispatch(changePageNumberAccount(pageNumber)),
    onChangePageSize: (pageSize) => dispatch(changePageSizeAccount(pageSize)),
    onChangeTextField: (evt) =>
      dispatch(changeTextField(evt.target.name, evt.target.value)),
    onGetSortColumn: (sortColumn, cloneSortColumn) =>
      dispatch(getSortAccountList(sortColumn, cloneSortColumn)),
    onGetSortDirection: () => dispatch(getSortDirectionAccountList()),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  datas: getAccountData(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingAccount(),
  accountDataModified: getAccountDataModified(),
  loading: makeSelectLoading(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'account', reducer });
const withSaga = injectSaga({ key: 'account', saga, mode: RESTART_ON_REMOUNT });

export default compose(withReducer, withSaga, withConnect)(AccountPage);

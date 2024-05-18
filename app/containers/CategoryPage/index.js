import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectError } from 'containers/App/selectors';
import EnhancedTable from 'components/Datatables';
import { makeTableHeader } from '../App/appUtilities';
import CategoryTableToolbar from './CategoryTableToolbar';

import {
  getCategoryData,
  getCategoryInfo,
  deleteCategory,
  deleteMultipleCategory,
  changeTextField,
  changePageSizeCategory,
  changePageNumberCategory,
  openModal,
  closeModal,
  getSortCategory,
  getSortDirectionCategory,
  getCategoryInit
} from './actions';
import messages from './messages';
import {
  makeCategoryDataSelector,
  getAjaxInfo,
  getMetaPagingCategory,
  getTypeCategoryListData,
  makeModalStatusSelector,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { localstoreUtilites } from '../../utils/persistenceData';

const headers = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
  },
  {
    id: 'type',
    label: <FormattedMessage {...messages.categoryType} />,
  },
  {
    id: 'color',
    label: <FormattedMessage {...messages.color} />,
  },
  {
    id: 'description',
    label: <FormattedMessage {...messages.description} />,
  },
  
  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: '##',
    width: '100px',
  },
];

export class CategoryPage extends React.PureComponent {
  state = {
    selectedCategoryIds: [],
    typeFilter: [],
    search: '',
  };

  componentDidMount() {
    this.props.onGetCategoryData({
      pageNumber: 1,
      pageSize: 25,
      sortColumn: 0,
      sortDirection: 'desc',
      search: '',
    });
    this.props.onGetCategoryInit();
  }

  searchDataTable = (searchTxt) => {
    // save state of search box
    this.setState({
      search: searchTxt,
    });
    // call props filter User on table
    this.props.onGetCategoryData(
      {
        types: this.state.typeFilter,
        search: searchTxt,
      }
    );
  };
  onChangeFilter = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    console.log(this.state.search);
    this.props.onGetCategoryData(
      {
        types: this.state.typeFilter,
        search: this.state.search,
      }
    );
  };


  selectRow = ids =>
    this.setState({
      selectedCategoryIds: ids,
    });

  onEditRow = id => {
    this.props.onEditRow(id);
    this.props.onOpenModal();
  };

  deleteMultipleCategory = () =>
    this.props.onDeleteMultipleCategory(this.state.selectedCategoryIds);

  componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      this.props.enqueueSnackbar(ajaxSuccess.message, {
        variant: 'success',
      });
      this.props.onGetCategoryData({ search: '' });
      this.props.onCloseModal();
    }
  }

  getSortCategory = sortColumn => {
    this.props.onGetSortCategory(sortColumn);
  };

  getSortDirectionCategory = () => {
    this.props.onGetSortDirectionCategory();
  };
  render() {
    const { selectedCategoryIds } = this.state;
    const {
      data,
      onOpenModal,
      onCloseModal,
      onDeleteCategory,
      meta,
      onGetCategoryData,
      onEditRow,
      onChangePageNumber,
      onChangePageSize,
      isOpenModal,
      viewOnly,
      enqueueSnackbar,
      typeListSelector
    } = this.props;
    const permission = localstoreUtilites.getPermissionsFromLocalStorage().category;

    if (data && typeListSelector.length > 0) {
      const tmpStatus = [...typeListSelector];
      data.map((item) => {
        tmpStatus.map((stt) => {
          if (item.type === stt.id) {
            item.type = stt.name;
          }
        });
      });
    }

    return (
      <EnhancedTable
        id="Category"
        data={data}
        headers={viewOnly ? headers.slice(0, headers.length - 1) : headers}
        onPagingRemote={onGetCategoryData}
        isEditShowModal // So that onEditRow will use a custom function
        onEditRow={permission.editCategory && this.onEditRow}
        onDeleteRow={permission.deleteCategory && onDeleteCategory}
        spanColum={headers.length + 1}
        rowsSelected={this.selectRow}
        onChangePageNumber={onChangePageNumber}
        onChangePageSize={onChangePageSize}
        meta={meta}
        viewOnly={viewOnly}
        notViewAction={false}
        orderHeader={makeTableHeader(headers)}
        onChangeSortColumn={this.getSortCategory}
        onChangeSortDirection={this.getSortDirectionCategory}
        deleteRowMsg={messages.confirmDelete}
        isFold
      >
        <CategoryTableToolbar
          title={<FormattedMessage {...messages.titleTable} />}
          onSearchDataTable={this.searchDataTable}
          onChangeFilter={this.onChangeFilter}
          deleteMultipleCategory={this.deleteMultipleCategory}
          isSelectMultiesRow={selectedCategoryIds.length > 0}
          isOpenModal={isOpenModal}
          openModal={onOpenModal}
          closeModal={onCloseModal}
          searchCategory={onGetCategoryData}
          // getCategoryInfo={onEditRow}
          viewOnly={viewOnly}
          permission={permission}
          enqueueSnackbar={enqueueSnackbar}
          typeListSelector={[...typeListSelector]}
          typeFilter={this.state.typeFilter}
        />
      </EnhancedTable>
    );
  }
}

CategoryPage.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isOpenModal: PropTypes.bool,
  meta: PropTypes.object,
  ajaxInfo: PropTypes.object,
  onOpenModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  onGetCategoryData: PropTypes.func,
  onEditRow: PropTypes.func,
  onChangePageNumber: PropTypes.func,
  onChangePageSize: PropTypes.func,
  onDeleteCategory: PropTypes.func,
  onDeleteMultipleCategory: PropTypes.func,
  viewOnly: PropTypes.bool,
  onGetSortCategory: PropTypes.func,
  onGetSortDirectionCategory: PropTypes.func,
  onGetCategoryInit: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onOpenModal: () => dispatch(openModal()),
    onCloseModal: () => dispatch(closeModal()),
    onGetCategoryData: queries => dispatch(getCategoryData(queries)),
    onEditRow: id => dispatch(getCategoryInfo(id)),
    onDeleteCategory: id => dispatch(deleteCategory(id)),
    onDeleteMultipleCategory: ids => dispatch(deleteMultipleCategory(ids)),
    onChangeTextField: (name, value) => dispatch(changeTextField(name, value)),
    onChangePageNumber: pageNumber =>
      dispatch(changePageNumberCategory(pageNumber)),
    onChangePageSize: pageSize => dispatch(changePageSizeCategory(pageSize)),
    onGetSortCategory: sortColumn => dispatch(getSortCategory(sortColumn)),
    onGetSortDirectionCategory: () => dispatch(getSortDirectionCategory()),
    onGetCategoryInit: () => dispatch(getCategoryInit()),
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  data: makeCategoryDataSelector(),
  isOpenModal: makeModalStatusSelector(),
  ajaxInfo: getAjaxInfo(),
  meta: getMetaPagingCategory(),
  typeListSelector: getTypeCategoryListData(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'category', reducer });
const withSaga = injectSaga({ key: 'category', saga, mode: RESTART_ON_REMOUNT });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CategoryPage);
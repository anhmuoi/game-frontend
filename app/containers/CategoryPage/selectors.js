import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCategory = state => state.get('category', initialState);

const makeCategoryDataSelector = () =>
  createSelector(selectCategory, categoryState => categoryState.get('data'));

const makeCategoryModelSelector = () =>
  createSelector(selectCategory, categoryState =>
    categoryState.get('categoryModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectCategory, categoryState =>
    categoryState.get('ajaxSuccess'),
  );

const getMetaPagingCategory = () =>
  createSelector(selectCategory, categoryState => categoryState.get('metaPaging'));
const makeModalStatusSelector = () =>
  createSelector(selectCategory, categoryState =>
    categoryState.get('isOpenModal'),
  );
  const getTypeCategoryListData = () =>
  createSelector(selectCategory, categoryState =>
    categoryState.get('typeList'),
  );

export {
  selectCategory,
  makeCategoryDataSelector,
  makeCategoryModelSelector,
  getAjaxInfo,
  getMetaPagingCategory,
  getTypeCategoryListData,
  makeModalStatusSelector,
};

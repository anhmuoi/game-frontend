import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.containers.categoryPage';
export default defineMessages({
  searchBox: {
    id: `demasterpro.components.Common.search`,
    defaultMessage: `Search`,
  },
  validateFieldRequire: {
    id: `demasterpro.components.Common.validateFieldRequire`,
    defaultMessage: `This field is required`,
  },
  titleAdd: {
    id: `demasterpro.components.Common.add`,
    defaultMessage: `Add`,
  },
  titleEdit: {
    id: `demasterpro.components.Common.edit`,
    defaultMessage: `Edit`,
  },
  btnSave: {
    id: `demasterpro.components.Common.save`,
    defaultMessage: `Save`,
  },
  btnCancel: {
    id: `demasterpro.components.Common.cancel`,
    defaultMessage: `Cancel`,
  },
  delete: {
    id: `demasterpro.components.Common.delete`,
    defaultMessage: `Delete`,
  },
  confirmDelete: {
    id: `demasterpro.components.Common.confirmDelete`,
    defaultMessage: 'Do you want to delete?',
  },
  titleTable: {
    id: `${scope}.titleTable`,
    defaultMessage: `Category`,
  },
  name: {
    id: `${scope}.name`,
    defaultMessage: `Category Name`,
  },
  categoryType: {
    id: `${scope}.categoryType`,
    defaultMessage: `Category Type`,
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: `Description`,
  },
  color: {
    id: `${scope}.color`,
    defaultMessage: `Color`,
  },
  invalidCategoryName: {
    id: `${scope}.invalidCategoryName`,
    defaultMessage: 'Category name can not be blank.',
  },
  addCategory: {
    id: `${scope}.addCategory`,
    defaultMessage: 'Add category',
  },
});

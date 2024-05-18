import { localstoreUtilites } from 'utils/persistenceData';

export const isPluginEnabled = key => {
  const plugIns = localstoreUtilites.getPluginsFromLocalStorage();
  return plugIns ? plugIns[key] : false;
};

export const isAccessSystemEnabled = () => {
  const ui = localstoreUtilites.getPreferredSystemFromLocalStorage();
  return `${ui}` === '0';
};

export const isCanteenSystemEnabled = () => {
  const ui = localstoreUtilites.getPreferredSystemFromLocalStorage();
  return `${ui}` === '1';
};

export const isCardIssuingSystemEnabled = () => {
  const ui = localstoreUtilites.getPreferredSystemFromLocalStorage();
  return `${ui}` === '2';
};

import ApiClient from 'utils/axiosClient';
import { localstoreUtilites } from '../../utils/persistenceData';

async function getCountReview() {
  try {
    const isArmyManagement =
      localstoreUtilites.getPluginsFromLocalStorage().armyManagement || false;
    let appendURL = 'visits';
    if (isArmyManagement) {
      appendURL = 'army-visits';
    }
    const res = await ApiClient.get(`/${appendURL}/waiting-for-review`);
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    // throw error;
  }
}

async function getLastLogin() {
  try {
    const res = await ApiClient.get(`/accounts/last-login`);
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    // throw error;
  }
}

async function getCountUserReview() {
  try {
    const isArmyManagement =
      localstoreUtilites.getPluginsFromLocalStorage().armyManagement || false;
    let appendURL = 'users';
    if (isArmyManagement) {
      appendURL = 'army-users';
    }
    const res = await ApiClient.get(`/${appendURL}/waiting-for-review`);
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    // throw error;
  }
}

export default {
  getCountReview,
  getLastLogin,
  getCountUserReview,
};

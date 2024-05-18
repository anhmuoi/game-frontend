import ApiClient from 'utils/axiosClient';

async function updatePreference({
  id,
  companyId,
  role,
  username,
  language,
  timeZone,
  preferredSystem,
}) {
  try {
    const res = await ApiClient.put(`/accounts-profile`, {
      companyId,
      role,
      username,
      language,
      timeZone,
      preferredSystem,
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getAccount(id) {
  try {
    const res = await ApiClient.get(`/accounts-profile`);
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function changePassword({
  id,
  companyId,
  role,
  username,
  password,
  confirmPassword,
}) {
  try {
    const res = await ApiClient.put(`/accounts-profile`, {
      companyId,
      role,
      username,
      password,
      confirmPassword,
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getSwitchCompany({
  search = '',
  pageSize = 10,
  pageNumber = 1,
  sortColumn,
  sortDirection,
}) {
  try {
    const res = await ApiClient.get(`/switch-company`, {
      params: {
        search,
        pageSize,
        pageNumber,
        sortColumn,
        sortDirection,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function loginStep2({ companyId, temporaryToken }) {
  try {
    const res = await ApiClient.post(`/login-step2`, {
      companyId,
      temporaryToken,
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function changeAvatar({ avatar }) {
  try {
    const res = await ApiClient.put('/accounts/avatar', {
      avatar,
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getAvatar() {
  try {
    const res = await ApiClient.get('/accounts/avatar');
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

export default {
  getAccount,
  updatePreference,
  changePassword,
  getSwitchCompany,
  loginStep2,
  changeAvatar,
  getAvatar,
};

import ApiClient from 'utils/axiosClient';

async function login({ username, password }) {
  try {
    const res = await ApiClient.post('/login', {
      username,
      password,
    });

    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}
async function loginByAddress({ address }) {
  try {
    const res = await ApiClient.post('/login-by-address', {
      address,
    });

    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

export default {
  login,
  loginByAddress,
};

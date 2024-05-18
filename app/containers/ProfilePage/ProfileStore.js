import { Container } from 'unstated';
// import UNSTATED from 'unstated-debug';
import Api from './api';

class ProfileStore extends Container {
  state = {
    account: {},
    temporaryToken: null,
    companies: [],
    pagination: {
      search: '',
      pageNumber: 0,
      pageSize: 10,
      total: 0,
    },
  };

  getAccount = async (id) => {
    try {
      const res = await Api.getAccount(id);
      this.setState({
        account: res,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  async onChangePagination(name, value) {
    await this.setState({
      pagination: {
        ...this.state.pagination,
        [name]: value,
      },
    });
    // await this.getSwitchCompany();
  }

  getSwitchCompany = async () => {
    const { pagination } = this.state;
    try {
      const res = await Api.getSwitchCompany({
        search: pagination.search || '',
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber + 1,
      });
      this.setState({
        temporaryToken: res.temporaryToken,
        companies: res.companies,
        pagination: {
          ...pagination,
          total: res.meta.recordsFiltered,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updatePreference = async ({ language, timeZone, preferredSystem }) => {
    const { account } = this.state;
    try {
      const res = await Api.updatePreference({
        id: account.id,
        companyId: account.companyId,
        role: account.role,
        username: account.username,
        language,
        timeZone,
        preferredSystem,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  changePassword = async ({ password, confirmPassword }) => {
    const { account } = this.state;
    try {
      const res = await Api.changePassword({
        id: account.id,
        companyId: account.companyId,
        role: account.role,
        username: account.username,
        password,
        confirmPassword,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  loginStep2 = async ({ temporaryToken, companyId }) => {
    try {
      const res = await Api.loginStep2({
        temporaryToken,
        companyId,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  changeAvatar = async ({ avatar }) => {
    try {
      const res = await Api.changeAvatar({
        avatar,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getAvatar = async () => {
    try {
      const res = await Api.getAvatar();
      this.setState({
        avatar: res.avatar,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  setAvatar = async (value) => {
    try {
      this.setState({
        avatar: value,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default new ProfileStore();

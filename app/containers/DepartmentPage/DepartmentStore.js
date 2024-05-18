/* eslint-disable indent */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container } from 'unstated';
// import UNSTATED from 'unstated-debug';
import Api from './api';
import messages from './messages';
import { reformatHeaders, reOderData } from './departmentUtilities';
import { checkRes } from '../../utils/request';
export const headers = [
  {
    id: 'id',
    headerVariable: 'id',
  },
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
    headerVariable: 'name',
  },

  {
    id: 'position',
    label: <FormattedMessage {...messages.position} />,
    headerVariable: 'Position',
  },

  {
    id: 'phone',
    label: <FormattedMessage {...messages.phone} />,
    headerVariable: 'Phone',
  },
];
const defaultAssignUIHeaders = [
  {
    pageName: 'DepartmentUser',
    headerId: 1,
    headerName: <FormattedMessage {...messages.name} />,
    headerVariable: 'name',
    id: 'name',
    isCategory: false,
    headerOrder: 3,
    isVisible: true,
  },
  {
    pageName: 'DepartmentUser',
    headerId: 2,
    headerName: <FormattedMessage {...messages.position} />,
    headerVariable: 'Position',
    id: 'position',
    isCategory: false,
    headerOrder: 4,
    isVisible: true,
  },
  {
    pageName: 'DepartmentUser',
    headerId: 3,
    headerName: <FormattedMessage {...messages.phone} />,
    headerVariable: 'Phone',
    id: 'phone',
    isCategory: false,
    headerOrder: 4,
    isVisible: true,
  },
  {
    pageName: 'DepartmentUser',
    headerId: 8,
    headerName: '　',
    headerVariable: 'Action',
    id: 'action',
    isCategory: false,
    headerOrder: 9,
    isVisible: true,
  },
];

export const defaultUnAssignUIHeaders = [
  {
    pageName: 'DepartmentUser',
    headerId: 1,
    headerName: <FormattedMessage {...messages.name} />,
    headerVariable: 'name',
    id: 'name',
    isCategory: false,
    headerOrder: 3,
    isVisible: true,
  },
  {
    pageName: 'DepartmentUser',
    headerId: 2,
    headerName: <FormattedMessage {...messages.position} />,
    headerVariable: 'Position',
    id: 'position',
    isCategory: false,
    headerOrder: 4,
    isVisible: true,
  },
  {
    pageName: 'DepartmentUser',
    headerId: 3,
    headerName: <FormattedMessage {...messages.phone} />,
    headerVariable: 'Phone',
    id: 'phone',
    isCategory: false,
    headerOrder: 4,
    isVisible: true,
  },
  {
    pageName: 'DepartmentUser',
    headerId: 8,
    headerName: '　',
    headerVariable: 'Action',
    id: 'action',
    isCategory: false,
    headerOrder: 9,
    isVisible: true,
  },
];

const initDepartmentModel = {
  number: '',
  name: '',
  departmentManagerId: '',
  departmentManagerName: '',
  isNew: true,
  errors: {},
};
class DepartmentStore extends Container {
  state = {
    departments: [],
    accounts: [],
    selectedDepartments: [],
    selectedAssignUsers: [],
    openDepartments: [],
    deparmentDetail: null,
    filter: {
      search: '',
    },
    pagination: {
      pageSize: 5,
      pageNumber: 0,
    },
    total: 0,

    users: {
      data: [],
      headers: [],
      pagination: {
        pageSize: 25,
        pageNumber: 1,
        sortColumn: 'name',
        sortDirection: 'asc',
        recordsFiltered: 0,
      },
      total: 0,
    },

    usersUnAssign: {
      data: [],
      headers: [],
      pagination: {
        pageSize: 25,
        pageNumber: 1,
        sortColumn: 'name',
        sortDirection: 'asc',
        recordsFiltered: 0,
      },
      total: 0,
    },
    isOpenAddDepartment: false,
    isOpenAssignUser: false,
    edittingDeparment: {
      ...initDepartmentModel,
    },
    userData: [],
    userMeta: {
      recordsTotal: 1,
      recordsFiltered: 1,
      orderBy: '',
      pageNumber: 1,
      pageSize: 25,
      sortColumn: 'FirstName',
      sortDirection: 'desc',
      search: '',
    },
    userHeader: [],
    showUserList: false,
  };

  async initData() {
    const { filter, pagination } = this.state;
    try {
      const { data } = await Api.getDepartments({
        search: filter.search,
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber,
      });
      const res = await Api.getAccounts();
      await this.setState({
        departments: data,
        accounts: res.data,
        selectedDepartments: [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async validateDepartment(errors) {
    await this.setState({
      edittingDeparment: {
        ...this.state.edittingDeparment,
        errors: {
          ...errors,
        },
      },
    });
  }

  async getDepartmentUsers(department) {
    try {
      const { users } = this.state;
      const {
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      } = users.pagination;
      const { data, meta } = await Api.getDepartmentUsers({
        departmentId: department.id,
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      });
      const newData = headers
        ? reOderData(
            data,
            headers.map((obj) => {
              const variable = obj.headerVariable.substr(0, 1);
              return variable
                .toLowerCase()
                .concat(obj.headerVariable.substr(1));
            }),
          )
        : reOderData(
            data,
            defaultAssignUIHeaders
              .map((obj) => obj.id)
              .filter((item) => item.toLowerCase() !== 'action'),
          );
      this.setState({
        deparmentDetail: department,
        users: {
          department,
          data: newData,
          headers: reformatHeaders(defaultAssignUIHeaders),
          pagination: {
            pageNumber,
            pageSize,
            sortColumn,
            sortDirection,
            recordsFiltered: meta.recordsFiltered,
            recordsTotal: meta.recordsTotal,
          },
          total: meta.recordsFiltered,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentUnAssignUsers(department) {
    try {
      const { usersUnAssign } = this.state;
      const {
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      } = usersUnAssign.pagination;
      const { data, header, meta } = await Api.getUsersForAssignToDepartment({
        departmentId: department.id,
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      });
      // console.log(header);

      this.setState({
        deparmentDetail: department,
        isOpenAssignUser: true,
        selectedAssignUsers: [],
        usersUnAssign: {
          department,
          data,
          headers: reformatHeaders(defaultUnAssignUIHeaders),
          pagination: {
            pageNumber,
            pageSize,
            sortColumn,
            sortDirection,
            recordsFiltered: meta.recordsFiltered,
          },
          total: meta.recordsFiltered,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentUnAssignUsersSearch({ search, department }) {
    const { usersUnAssign } = this.state;
    const {
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection,
    } = usersUnAssign.pagination;
    try {
      const {
        data,
        header,
        meta,
      } = await Api.getUsersForAssignToDepartmentSearch({
        search,
        departmentId: department.id,
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      });

      this.setState({
        deparmentDetail: department,
        isOpenAssignUser: true,
        selectedAssignUsers: [],
        usersUnAssign: {
          department,
          data,
          headers: header ? reformatHeaders(header) : defaultUnAssignUIHeaders,
          pagination: {
            pageNumber,
            pageSize,
            sortColumn,
            sortDirection,
            recordsFiltered: meta.recordsFiltered,
          },
          total: meta.recordsFiltered,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  toggleChildDeparment(id) {
    const { openDepartments } = this.state;
    if (!openDepartments.includes(id)) {
      this.setState({
        openDepartments: [...openDepartments, id],
      });
    } else {
      this.setState({
        openDepartments: openDepartments.filter((selected) => selected !== id),
      });
    }
    this.setState({ showUserList: true });
  }

  selecteDepartment(id) {
    const { selectedDepartments } = this.state;
    if (!selectedDepartments.includes(id)) {
      this.setState({
        selectedDepartments: [...selectedDepartments, id],
      });
    } else {
      this.setState({
        selectedDepartments: selectedDepartments.filter(
          (selected) => selected !== id,
        ),
      });
    }
  }

  selectedUserAsign(ids) {
    // const { selectedAssignUsers } = this.state;
    this.setState({ selectedAssignUsers: ids });
    // if (!selectedAssignUsers.includes(id)) {
    //   this.setState({
    //     selectedAssignUsers: [...selectedAssignUsers, id],
    //   });
    // } else {
    //   this.setState({
    //     selectedAssignUsers: selectedAssignUsers.filter(
    //       selected => selected !== id,
    //     ),
    //   });
    // }
  }

  selectAllUnAssignUser() {
    const { usersUnAssign, selectedAssignUsers } = this.state;

    const allUserId = usersUnAssign.data.map((user) => user.id);

    if (selectedAssignUsers.length === allUserId.length) {
      this.setState({
        selectedAssignUsers: [],
      });
    } else {
      this.setState({
        selectedAssignUsers: allUserId,
      });
    }
  }

  selecteAllDepartment() {
    const { selectedDepartments, departments } = this.state;
    if (selectedDepartments.length === departments.length) {
      this.setState({
        selectedDepartments: [],
      });
    } else {
      this.setState({
        selectedDepartments: [...departments.map((dept) => dept.id)],
      });
    }
  }

  toogleAddDepartment(edittingDeparment) {
    const { isOpenAddDepartment } = this.state;

    this.setState({
      isOpenAddDepartment: !isOpenAddDepartment,
      edittingDeparment: {
        ...initDepartmentModel,
        ...edittingDeparment,
        isNew: !edittingDeparment,
      },
    });
  }

  toggleAssignUser() {
    const { isOpenAssignUser } = this.state;
    this.setState({
      isOpenAssignUser: !isOpenAssignUser,
    });
  }

  onChangeField(name, value) {
    this.setState({
      edittingDeparment: {
        ...this.state.edittingDeparment,
        errors: {
          ...this.state.edittingDeparment.errors,
          [name]: '',
        },
        [name]: value,
      },
    });
  }

  async addDepartment() {
    const { edittingDeparment } = this.state;
    try {
      const { data } = await Api.addDepartment({
        name: edittingDeparment.name,
        number: edittingDeparment.number,
        parentId: edittingDeparment.parentId,
        departmentManagerId: edittingDeparment.departmentManagerId,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateDepartment() {
    const { edittingDeparment } = this.state;
    try {
      const { data } = await Api.updateDepartment({
        id: edittingDeparment.id,
        name: edittingDeparment.name,
        number: edittingDeparment.number,
        parentId: edittingDeparment.parentId,
        departmentManagerId: edittingDeparment.departmentManagerId,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async assignUsersToDepartment() {
    const { deparmentDetail, selectedAssignUsers } = this.state;

    const partmentId = deparmentDetail.id;
    try {
      this.setState({
        deparmentDetail,
      });
      const { data } = await Api.assignUsersToDepartment({
        partmentId,
        userIds: selectedAssignUsers,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  deleteDepartments() {
    const { selectedDepartments } = this.state;
    try {
      const res = Api.deleteDepartments(selectedDepartments);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getUserData() {
    const { userMeta } = this.state;
    try {
      const res = await Api.getUserList(userMeta);
      const { data, meta } = res;
      this.setState({
        userData: data,
        userHeader: reformatHeaders(headers),
        userMeta: {
          ...userMeta,
          recordsTotal: meta.recordsTotal,
          recordsFiltered: meta.recordsFiltered,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async onChangeUserMeta(name, value) {
    const { userMeta } = this.state;
    if (name && value) {
      await this.setState({
        userMeta: {
          ...userMeta,
          [name]: value,
        },
      });
    }
    await this.getUserData();
  }

  async onChangeAssignedUserListMeta(name, value) {
    await this.setState({
      ...this.state,
      users: {
        ...this.state.users,
        pagination: {
          ...this.state.users.pagination,
          [name]: value,
        },
      },
    });
  }

  async onChangeUnAssignedUserListMeta(name, value) {
    await this.setState({
      ...this.state,
      usersUnAssign: {
        ...this.state.usersUnAssign,
        pagination: {
          ...this.state.usersUnAssign.pagination,
          [name]: value,
        },
      },
    });
  }

  async onPatchHeaderColumns(headers) {
    try {
      const res = await Api.onPatchHeaderColumns(headers);
      if (res.statusCode && checkRes(res.statusCode)) {
        const err = { message: res.message };
        throw err;
      }
    } catch (err) {
      throw err;
    }
  }

  async onChangeHeaderVisibles(name, headers) {
    this.setState({
      [name]: {
        ...this.state[name],
        headers,
      },
    });
  }
}

export default new DepartmentStore();

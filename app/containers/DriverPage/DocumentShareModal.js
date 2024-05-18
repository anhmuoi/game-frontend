import React from 'react';
import ModalMaterialUi from 'components/Modal';
import EnhancedTable from 'components/Datatables';
import { Grid, Typography, Button, Card, Avatar, Tooltip } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SelectUI from 'components/SelectUI';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import { MEDIA_PERMISSION_TYPE } from 'utils/constants';
import SearchUI from 'components/SearchUI/index.js';
const headers = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.userName} />,
  },
  {
    id: 'changePermission',
    label: '##',
    width: '60px'
  },
];

const headersNotShared = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.userName} />,
  },
  {
    id: 'departmentName',
    label: <FormattedMessage {...messages.departmentName} />,
  },
];

class DocumentShareModal extends React.Component {
  state = {
    userNotSharedIds: [],
    typeWillShare: 1,
  };

  closeModal = () => {
    this.setState({
      userNotSharedIds: [],
      typeWillShare: 1,
    });
    this.props.closeModal(null);
  }

  changePermission = (item, type) => {
    if (type == -1) {
      // remove
      this.props.deletePermission(item);
    } else {
      // change permission
      this.props.changePermission(item, type);
    }
  }

  convertData = (data) => {
    const { permissions } = this.props;
    let result = [];

    data.forEach((e, i) => {
      result.push({
        ...e,
        name: <table>
          <tr>
            <td>
              <Avatar
                key={`${e.id}_avatar`}
                src={e.avatar}
                style={{ width: 30, height: 30 }}
              />
            </td>
            <td>{e.name + (e.email ? ` (${e.email})` : '')}</td>
          </tr>
        </table>,
        changePermission: e.permissionType == MEDIA_PERMISSION_TYPE.OWNER
          ? <span><b>{e.permission}</b></span>
          : <SelectUI
            value={e.permissionType}
            onChange={(event) => { this.changePermission(e, event.target.value); }}
            label={''}
            options={[
              ...permissions.filter(m => m.id != MEDIA_PERMISSION_TYPE.OWNER),
              {
                id: '-1',
                name: <span>
                  <hr />
                  <FormattedMessage {...messages.removePermission} />
                </span>
              }
            ]}
            name={`permissionType_${e.id}`}
            id={`permissionType_${e.id}`}
          />
        ,
      });
    });

    return result;
  }

  changePageNumberShared = (pageNumber) => {
    const { metaUsersShared } = this.props;
    this.props.changeMetaUsersShared({
      ...metaUsersShared.toJS(),
      pageNumber,
    });
  }

  changePageSizeShared = (pageSize) => {
    const { metaUsersShared } = this.props;
    this.props.changeMetaUsersShared({
      ...metaUsersShared.toJS(),
      pageSize,
    });
  }

  changeNameFilterShared = (search) => {
    const { metaUsersShared } = this.props;
    this.props.changeMetaUsersShared({
      ...metaUsersShared.toJS(),
      name: search,
    });
  }

  convertDataNotShared = (data) => {
    let result = [];

    data.forEach((e, i) => {
      result.push({
        ...e,
        name: <table>
          <tr>
            <td>
              <Avatar
                key={`${e.id}_avatar`}
                src={e.avatar}
                style={{ width: 30, height: 30 }}
              />
            </td>
            <td>{e.name + (e.email ? ` (${e.email})` : '')}</td>
          </tr>
        </table>,
      });
    });

    return result;
  }

  changePageNumberNotShared = (pageNumber) => {
    const { metaUsersNotShared } = this.props;
    this.props.changeMetaUsersNotShared({
      ...metaUsersNotShared.toJS(),
      pageNumber,
    });
  }

  changePageSizeNotShared = (pageSize) => {
    const { metaUsersNotShared } = this.props;
    this.props.changeMetaUsersNotShared({
      ...metaUsersNotShared.toJS(),
      pageSize,
    });
  }

  changeNameFilterNotShared = (search) => {
    const { metaUsersNotShared } = this.props;
    this.props.changeMetaUsersNotShared({
      ...metaUsersNotShared.toJS(),
      name: search,
    });
  }

  changeSelectedUserNotShared = (ids) => {
    this.setState({ userNotSharedIds: ids });
  }

  shareDocument = () => {
    const { userNotSharedIds, typeWillShare } = this.state;
    this.props.shareDocument(userNotSharedIds, typeWillShare);
    this.setState({
      userNotSharedIds: [],
      typeWillShare: 1,
    });
  }

  render() {
    const { typeWillShare, userNotSharedIds } = this.state;
    const { isOpenModal, permissions, usersShared, metaUsersShared,
      usersNotShared, metaUsersNotShared } = this.props;

    return (<ModalMaterialUi
      isOpenModal={isOpenModal}
      onCloseModal={this.closeModal}
      id="DocumentShareModal"
      shapeModal={{
        width: '90%',
        top: '15%',
        left: '50%',
        transform: 'translate(-50%, -10%)',
      }}
    >
      <Grid container spacing={24}>
        <Grid item sm={12}>
          <Typography variant="h6">
            <FormattedMessage {...messages.shareDocument} />
          </Typography>
        </Grid>
        <Grid item sm={6}>
          <Card style={{ padding: 10 }}>
            <Grid container>
              <Grid item sm={12}>
                <FormattedMessage {...messages.listUserNotAccess} />
              </Grid>
              <Grid item sm={2}>
                <SelectUI
                  value={typeWillShare}
                  onChange={(event) => { this.setState({ typeWillShare: event.target.value }); }}
                  label={''}
                  options={permissions.filter(m => m.id != MEDIA_PERMISSION_TYPE.OWNER)}
                  name={`permissionType_share_user`}
                  id={`permissionType_share_user`}
                />
              </Grid>
              <Grid item sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: 13 }}
                  onClick={this.shareDocument}
                  disabled={userNotSharedIds.length === 0}
                >
                  <GroupAddIcon />{' '}
                  <FormattedMessage {...messages.share} />
                </Button>
              </Grid>
              <Grid item sm={4} style={{ padding: 13 }}>
                <SearchUI
                  placeholder="Name"
                  onSearchData={(e) => this.changeNameFilterNotShared(e.target.value)}
                />
              </Grid>
              <Grid item sm={12}>
                <EnhancedTable
                  id="UserNotSharedTable"
                  data={this.convertDataNotShared(usersNotShared || [])}
                  headers={headersNotShared}
                  onPagingRemote={() => { }}
                  spanColum={headersNotShared.length + 1}
                  meta={metaUsersNotShared}
                  onChangePageNumber={this.changePageNumberNotShared}
                  onChangePageSize={this.changePageSizeNotShared}
                  rowsSelected={this.changeSelectedUserNotShared}
                  isEditShowModal
                  foldOptionVal={false}
                  isFold={false}
                  isHighLightTable
                  tableHeight="calc(40vh - 10px)"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item sm={6}>
          <Card style={{ padding: 10 }}>
            <Grid container>
              <Grid item sm={12}>
                <FormattedMessage {...messages.listUserAccess} />
              </Grid>
              <Grid item sm={8}>
              </Grid>
              <Grid item sm={4} style={{ padding: 13, marginTop: 4 }}>
                <SearchUI
                  placeholder="Name"
                  onSearchData={(e) => this.changeNameFilterShared(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid item sm={12}>
              <EnhancedTable
                id="UserSharedTable"
                data={this.convertData(usersShared || [])}
                headers={headers}
                onPagingRemote={() => { }}
                spanColum={headers.length + 1}
                meta={metaUsersShared}
                onChangePageNumber={this.changePageNumberShared}
                onChangePageSize={this.changePageSizeShared}
                isNotCheckedRow
                rowsSelected={() => { }}
                isEditShowModal
                foldOptionVal={false}
                isFold={false}
                isHighLightTable
                tableHeight="calc(40vh - 10px)"
              />
            </Grid>
          </Card>
        </Grid>
        <Grid item sm={12} style={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="default"
            onClick={this.closeModal}
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
        </Grid>
      </Grid>
    </ModalMaterialUi>)
  }
}

export default DocumentShareModal;
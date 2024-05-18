import React from 'react';
import ModalMaterialUi from 'components/Modal';
import { Grid, Typography, Button } from '@material-ui/core';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import InputUI from '../../components/InputUI';
import SelectUI from 'components/SelectUI';


class FolderModal extends React.Component {
  state = {
    name: '',
  };

  changeTextField = (name, value) => {
    this.setState({
      [name]: value,
    })
  }

  closeModal = () => {
    this.changeTextField('name', '');
    this.props.closeModal();
  }

  submit = () => {
    this.props.addOrEditFolder(this.state.name);
    this.changeTextField('name', '');
  }

  render() {
    const { name } = this.state;
    const { isOpenModal } = this.props;

    return (
      <ModalMaterialUi
        isOpenModal={isOpenModal}
        onCloseModal={this.closeModal}
        id="FolderModal"
      >
        <Grid container spacing={24}>
          <Grid item sm={12}>
            <Typography variant="h6">
              <FormattedMessage {...messages.newFolder} />
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <InputUI
              id="name"
              name="name"
              value={name}
              onChange={evt => this.changeTextField('name', evt.target.value)}
              label={<FormattedMessage {...messages.name} />}
            />
          </Grid>
          <Grid item sm={12} style={{ textAlign: 'left' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.submit}
            >
              <FormattedMessage {...messages.add} />
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="default"
              onClick={this.closeModal}
            >
              <FormattedMessage {...messages.cancel} />
            </Button>
          </Grid>
        </Grid>
      </ModalMaterialUi>
    );
  }
}

export default FolderModal;
import React from 'react';
import ModalMaterialUi from 'components/Modal';
import { Grid, Typography, Button } from '@material-ui/core';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import InputUI from '../../components/InputUI';
import SelectUI from 'components/SelectUI';


class RenameModal extends React.Component {
  state = {
  };

  closeModal = () => {
    this.props.closeModal();
  }

  submit = () => {
    this.props.editName();
  }

  render() {
    const { isOpenModal, nameDocument, changeTextField } = this.props;

    return (
      <ModalMaterialUi
        isOpenModal={isOpenModal}
        onCloseModal={this.closeModal}
        id="RenameModal"
      >
        <Grid container spacing={24}>
          <Grid item sm={12}>
            <Typography variant="h6">
              <FormattedMessage {...messages.rename} />
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <InputUI
              id="name"
              name="name"
              value={nameDocument}
              onChange={evt => changeTextField('name', evt.target.value)}
              label={<FormattedMessage {...messages.name} />}
            />
          </Grid>
          <Grid item sm={12} style={{ textAlign: 'left' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.submit}
            >
              <FormattedMessage {...messages.rename} />
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

export default RenameModal;
import React from 'react';
import ModalMaterialUi from 'components/Modal';
import { PropTypes } from 'prop-types';
import CancelIcon from '@material-ui/icons/Cancel';
import classNames from 'classnames';
import {
  withStyles,
  Radio,
  FormControlLabel,
  RadioGroup,
  Typography,
  Button,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import CloudDownload from '@material-ui/icons/CloudDownload';
import messages from './messages';
export {
  Typography,
  RadioGroup,
  FormControlLabel,
  Button,
  Radio,
  withStyles,
} from '@material-ui/core';

const styles = (theme) => ({
  inline: {
    display: 'inline',
  },
  radioGroup: {
    display: 'inline',
    marginLeft: '80px',
  },
  button: {
    margin: 5,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  smallIcon: {
    fontSize: 20,
  },
});
class ExportUI extends React.Component {
  state = {
    exportFormat: this.props.defaultFormat,
    acceptFormats: [
      { name: 'Excel', value: 'excel' },
      { name: 'CSV', value: 'csv' },
    ],
  };

  onChangeExportFormat = (event) => {
    this.setState({ exportFormat: event.target.value });
  };

  exportFunc = () => {
    this.props.onExport(this.state.exportFormat);
  };
  render() {
    const { acceptFormats } = this.state;
    const { show, classes, id, onCancelExport } = this.props;
    return (
      <ModalMaterialUi onCloseModal={onCancelExport} isOpenModal={show}>
        <React.Fragment>
          <Typography variant="h5" id={id}>
            {<FormattedMessage {...messages.btnExport} />}
          </Typography>
          <br />
          {<FormattedMessage {...messages.titleFormatFile} />}
          <div className={classes.inline}>
            <RadioGroup
              name="fileFormat"
              value={this.state.exportFormat}
              onChange={(e) => this.onChangeExportFormat(e)}
              className={classes.radioGroup}
            >
              {acceptFormats.map((format) => (
                <FormControlLabel
                  key={format.value}
                  value={format.value}
                  control={<Radio />}
                  label={format.name}
                />
              ))}
            </RadioGroup>
          </div>
          <div className={classes.buttons}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={onCancelExport}
            >
              <CancelIcon
                className={classNames(classes.rightIcon, classes.smallIcon)}
              />
              {<FormattedMessage {...messages.btnCancel} />}
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.exportFunc}
              color="primary"
            >
              {<FormattedMessage {...messages.btnExport} />}
              <CloudDownload
                className={classNames(classes.rightIcon, classes.smallIcon)}
              />
            </Button>
          </div>
        </React.Fragment>
      </ModalMaterialUi>
    );
  }
}

ExportUI.propTypes = {
  show: PropTypes.bool,
  defaultFormat: PropTypes.string.isRequired,
  btnExportTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  id: PropTypes.string,
  classes: PropTypes.object,
  onExport: PropTypes.func,
  onCancelExport: PropTypes.func,
};
export default withStyles(styles)(ExportUI);

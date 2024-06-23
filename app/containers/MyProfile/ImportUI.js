import React from 'react';
import ModalMaterialUi from 'components/Modal';
import CloudUpload from '@material-ui/icons/CloudUpload';
import CancelIcon from '@material-ui/icons/Cancel';
import classNames from 'classnames';
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Button,
  Radio,
  withStyles,
} from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = (theme) => ({
  inline: {
    display: 'inline',
    textDecoration: 'underline',
  },
  radioGroup: {
    display: 'inline',
    marginLeft: 80,
  },
  button: {
    margin: 5,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  label: {
    width: 160,
    height: 40,
    display: 'inline-block',
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  smallIcon: {
    fontSize: 20,
  },
});
class ImportUI extends React.Component {
  state = {
    input: null,
    exportFormat: this.props.defaultFormat,
  };

  componentDidMount() {
    this.getAcceptFormat(this.props.defaultFormat);
  }

  onChangeImportFormat = (event) => {
    this.setState({
      exportFormat: event.target.value,
    });
  };

  getAcceptFormat = (type) => {
    switch (type) {
      default:
      case 'excel':
        this.setState({
          exportFormat: 'excel',
        });
        break;
      case 'csv':
        this.setState({
          exportFormat: 'csv',
        });
        break;
    }
    return 0;
  };

  onChangeInput = (event) => {
    this.setState({ input: event.target.files[0] });
  };

  onImport = () => {
    const { input, exportFormat } = this.state;
    this.props.onImport(input, exportFormat);
    this.setState({ input: null });
  };
  handleClickExample = () => {
    this.props.onExport(this.state.exportFormat, 'example');
  };

  render() {
    const { input } = this.state;
    const {
      show,
      classes,
      id,
      acceptFormats,
      onCancelImport,
      onExport,
    } = this.props;
    return (
      <ModalMaterialUi onCloseModal={onCancelImport} isOpenModal={show}>
        <React.Fragment>
          <Typography variant="h5" id={id}>
            {<FormattedMessage {...messages.btnImport} />}
          </Typography>
          <br />
          <span className={classes.label}>
            {<FormattedMessage {...messages.titleFormatFile} />}
          </span>
          <div className={classes.inline}>
            <RadioGroup
              name="fileFormat"
              value={this.state.exportFormat}
              onChange={(e) => this.onChangeImportFormat(e)}
              className={classes.inline}
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
          <div className={classes.inline} onClick={this.handleClickExample}>
            <a>Example</a>
          </div>
          <div>
            <span className={classes.label}>
              {<FormattedMessage {...messages.btnImport} />}
            </span>
            <input
              type="file"
              id="import_file"
              onChange={this.onChangeInput}
              accept={this.state.format}
            />
          </div>
          <div className={classes.buttons}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={onCancelImport}
            >
              <CancelIcon
                className={classNames(classes.rightIcon, classes.smallIcon)}
              />
              {<FormattedMessage {...messages.btnCancel} />}
            </Button>
            <Button
              disabled={!input}
              id="importBtn"
              variant="contained"
              className={classes.button}
              onClick={this.onImport}
              color="primary"
            >
              {<FormattedMessage {...messages.btnImport} />}
              <CloudUpload
                className={classNames(classes.rightIcon, classes.smallIcon)}
              />
            </Button>
          </div>
        </React.Fragment>
      </ModalMaterialUi>
    );
  }
}

ImportUI.propTypes = {
  show: PropTypes.bool,
  defaultFormat: PropTypes.string.isRequired,
  btnImportTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  id: PropTypes.string,
  classes: PropTypes.object,
  acceptFormats: PropTypes.array,
  onImport: PropTypes.func,
  onCancelImport: PropTypes.func,
  changeInput: PropTypes.func,
};
export default withStyles(styles)(ImportUI);

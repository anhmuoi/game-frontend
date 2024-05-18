import React from 'react';
import { Helmet } from 'react-helmet';
import { Paper, Typography, Avatar, Divider, Grid, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import LockIcon from '@material-ui/icons/LockOutlined';
import messages from './messages';
import { PAGE_TITLE, } from '../../utils/constants';
import { FaWarehouse, FaShoppingCart } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { MdWork } from "react-icons/md";


class LoginOption extends React.Component {
  state = {};

  render() {
    const { classes, onGoToHappyPingPong, onGoToBarcode } = this.props;

    return (<React.Fragment>
      <Grid container spacing={24} style={{ textAlign: 'center', marginTop: 14 }}>
        <Grid item sm={6} style={{ padding: 10 }}>
          <Button
            style={{ border: 5, borderStyle: 'double', backgroundColor: '#3A4856', color: 'white', width: '100%' }}
            onClick={onGoToHappyPingPong}
          >
            <Grid container spacing={16} style={{ textAlign: 'center' }}>
              <Grid item sm={12}><MdWork size={30} /></Grid>
              <Grid item sm={12}><FormattedMessage {...messages.happyPingPong} /></Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item sm={6} style={{ padding: 10 }}>
          <Button
            style={{ border: 5, borderStyle: 'double', backgroundColor: '#419144', color: 'white', width: '100%' }}
            onClick={onGoToBarcode}
            disabled={true}
          >
            <Grid container spacing={16} style={{ textAlign: 'center' }}>
              <Grid item sm={12}><FaWarehouse size={30} /></Grid>
              <Grid item sm={12}><FormattedMessage {...messages.barcode} /></Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item sm={6} style={{ padding: 10 }}>
          <Button
            style={{ border: 5, borderStyle: 'double', backgroundColor: '#3660ff', color: 'white', width: '100%' }}
            disabled={true}
          >
            <Grid container spacing={16} style={{ textAlign: 'center' }}>
              <Grid item sm={12}><FaShoppingCart size={30} /></Grid>
              <Grid item sm={12}><FormattedMessage {...messages.purchasing} /></Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item sm={6} style={{ padding: 10 }}>
          <Button
            style={{ border: 5, borderStyle: 'double', backgroundColor: '#bda806', color: 'white', width: '100%' }}
            disabled={true}
          >
            <Grid container spacing={16} style={{ textAlign: 'center' }}>
              <Grid item sm={12}><AiFillSchedule size={30} /></Grid>
              <Grid item sm={12}><FormattedMessage {...messages.workLogs} /></Grid>
            </Grid>
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>)
  }
}

export default LoginOption;
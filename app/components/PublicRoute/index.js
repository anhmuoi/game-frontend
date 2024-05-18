import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';

export const PublicRoute = ({
  component: Component,
  enqueueSnackbar,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      <Component {...props} enqueueSnackbar={enqueueSnackbar} />
    )}
  />
);

PublicRoute.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  component: PropTypes.func,
};

export default withSnackbar(PublicRoute);

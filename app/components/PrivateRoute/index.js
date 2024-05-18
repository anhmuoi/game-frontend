import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withSnackbar } from 'notistack';

import { isViewOnly } from 'containers/App/appUtilities.js';
import { getAuthInfo, getRoleUser } from 'containers/App/selectors.js';
import MasterPage from 'containers/MasterPage/Loadable';

export const PrivateRoute = ({
  component: Component,
  title,
  auth: isAuthed,
  role,
  enqueueSnackbar,
  ignoreLogin,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      ignoreLogin || isAuthed === true ? (
        <MasterPage title={title} role={role} enqueueSnackbar={enqueueSnackbar}>
          <Component
            {...props}
            role={role}
            viewOnly={isViewOnly(role)}
            enqueueSnackbar={enqueueSnackbar}
          />
        </MasterPage>
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  location: PropTypes.object,
  component: PropTypes.func,
  title: PropTypes.object,
  auth: PropTypes.bool,
  role: PropTypes.number,
  ignoreLogin: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  auth: getAuthInfo(),
  role: getRoleUser(),
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(withSnackbar(PrivateRoute));

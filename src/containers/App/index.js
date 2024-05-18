/* eslint-disable no-nested-ternary */
/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
// import ResetPassword from 'containers/ResetPasswordPage/Loadable';
import { LoadRoleSettingPage } from 'containers/RoleSetting/Loadable';
import { PAGE_TITLE } from '../../utils/constants';
import { theme } from './appUtilities';
import messages from './messages';
import { LoginPage } from 'containers/LoginPage/Loadable.js';
import {
  UserManagementPage,
  UserModifyPage,
} from 'containers/UserPage/Loadable.js';
import { LoadDepartmentPage } from 'containers/DepartmentPage/Loadable';
import { LoadDashboardPage } from 'containers/Dashboard/Loadable';

import NotFoundPage from 'containers/NotFoundPage/Loadable';
import PrivateRoute from 'components/PrivateRoute/index.js';
import '../../env.js';
const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;/
  flex-direction: column;
  min-width: 100%;
  position: absolute;
  right: 0;
  left: 0;
`;

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        action={[
          <Button color="default" size="small" key="dismiss" id="btnDismiss">
            <FormattedMessage {...messages.btnDismiss} />
          </Button>,
        ]}
        // autoHideDuration={null}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <AppWrapper>
            <Helmet
              titleTemplate={`%s - ${PAGE_TITLE}`}
              defaultTitle="ERP Project"
            >
              <meta name="description" content="WaitingKiosk" />
            </Helmet>
            <Switch>
              {/* <Route exact path="/" render={() => <Redirect to="/user" />} /> */}
              <PrivateRoute exact path="/" component={LoadDashboardPage} title={messages.titleDashboard} />
              <Route exact path="/login" component={LoginPage} />
              <PrivateRoute
                exact
                path="/role-setting"
                component={LoadRoleSettingPage}
                title={messages.titleRoleSetting}
              />
              {/* <Route
                exact
                path="/reset-password/:codeHash"
                component={ResetPassword}
              />
              <Route
                exact
                path="/member/reset-password/:codeHash"
                component={MemberResetPassword}
              />
              <PrivateRoute
                exact
                path="/"
                component={AccessDashboard}
                title={messages.dashboard}
              />
              <PrivateRoute
                exact
                path="/not-found"
                component={NotFoundPage}
                title={messages.titleNotFoundRoute}
              /> */}
              {/* <PrivateRoute
                exact
                path="/profile"
                component={ProfilePage}
                title={messages.titleProfilePage}
              />

              <PrivateRoute
                exact
                path="/role-setting"
                component={LoadRoleSettingPage}
                title={messages.titleRoleSetting}
              /> */}

              {/* account */}
              {/* <PrivateRoute
                exact
                path="/account-management"
                component={AccountPage}
                title={messages.titleAccountManagementRoute}
              /> */}
              {/* not found */}
              <PrivateRoute
                path="/not-found"
                component={NotFoundPage}
                title={messages.titleNotFoundRoute}
              />

              <PrivateRoute
                exact
                path="/department"
                component={LoadDepartmentPage}
                title={messages.titleDepartmentRoute}
              />
              {/* user */}
              <PrivateRoute
                exact
                path="/user"
                component={UserManagementPage}
                title={messages.titleUserRoute}
              />
              <PrivateRoute
                exact
                path="/user/add"
                component={UserModifyPage}
                title={messages.titleAddUserRoute}
              />
              <PrivateRoute
                exact
                path="/user/edit/:userId"
                component={UserModifyPage}
                title={messages.titleEditUserRoute}
              />
            </Switch>
          </AppWrapper>
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

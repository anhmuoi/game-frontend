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
import ResetPassword from 'containers/ResetPasswordPage/Loadable';
import JoinGroup from 'containers/JoinGroupPage/Loadable';
import Game from 'containers/GamePage/Loadable';
import { LoadRoleSettingPage } from 'containers/RoleSetting/Loadable';
import { PAGE_TITLE } from '../../utils/constants';
import { theme } from './appUtilities';
import { LoadDepartmentPage } from 'containers/DepartmentPage/Loadable';
import { LoadCategoryPage } from 'containers/CategoryPage/Loadable';
import {
  MyDriverPage,
  DocumentPage,
  SharedWithMePage,
} from 'containers/DriverPage/Loadable';
import { LoadSchedulePage } from 'containers/SchedulePage/Loadable';
import { LoadRoomManagePage } from 'containers/RoomManagePage/Loadable.js';
import { LoadRoomGamePage } from 'containers/RoomGamePage/Loadable.js';
import { LoadRoomDetailPage } from 'containers/RoomDetailPage/Loadable.js';

import NotFoundPage from 'containers/NotFoundPage/Loadable.js';
import messages from './messages';
import { LoginPage } from 'containers/LoginPage/Loadable.js';
import {
  UserManagementPage,
  UserModifyPage,
} from 'containers/UserPage/Loadable.js';
import PrivateRoute from 'components/PrivateRoute/index.js';
import '../../env.js';
import { ProfilePage } from 'containers/ProfilePage/Loadable';
import { LoadDashboardPage } from 'containers/Dashboard/Loadable';
import { LoadFolderLogPage } from '../FolderLogPage/Loadable.js';
import { DailyReportPage } from '../DailyReportPage/Loadable.js';
import { ItemNftPage } from '../NftPage/Loadable.js';
import { LoadMarketPage } from '../MarketPage/Loadable.js';
import { LoadMyNftPage } from '../MyItemNft/Loadable.js';
import { LoadFriendPage } from '../Friend/Loadable.js';
import { LoadGroupUserPage } from '../GroupUser/Loadable.js';
import { LoadAnalysisPage } from '../Analysis/Loadable.js';
import { LoadRankPage } from '../Rank/Loadable.js';
import { LoadHistoryPage } from '../History/Loadable.js';
import { LoadMyGroupPage } from '../MyGroup/Loadable.js';
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
              defaultTitle="Game Project"
            >
              <meta name="description" content="WaitingKiosk" />
            </Helmet>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route
                exact
                path="/reset-password/:codeHash"
                component={ResetPassword}
              />
              <Route
                exact
                path="/join-group/:userIdRequest/:departmentId/:codeHash"
                component={JoinGroup}
              />
              <Route exact path="/game" component={Game} />
              <PrivateRoute
                exact
                path="/"
                component={LoadDashboardPage}
                title={messages.titleDashboard}
              />
              <PrivateRoute
                path="/not-found"
                component={NotFoundPage}
                title={messages.titleNotFoundRoute}
              />
              {/* room manage */}
              <PrivateRoute
                exact
                path="/room-manage"
                component={LoadRoomManagePage}
                title={messages.titleRoomManageRoute}
              />
              {/* room game */}
              <Route exact path="/room-game" component={LoadRoomGamePage} />
              <Route exact path="/market" component={LoadMarketPage} />
              <Route exact path="/my-nft" component={LoadMyNftPage} />
              <Route exact path="/friend" component={LoadFriendPage} />
              <Route exact path="/group" component={LoadGroupUserPage} />
              <Route exact path="/analysis" component={LoadAnalysisPage} />
              <Route exact path="/rank" component={LoadRankPage} />
              <Route exact path="/history" component={LoadHistoryPage} />
              <Route exact path="/my-group" component={LoadMyGroupPage} />
              <Route
                exact
                path="/room-game/:id"
                component={LoadRoomDetailPage}
              />
              {/* role */}
              <PrivateRoute
                exact
                path="/role"
                component={LoadRoleSettingPage}
                title={messages.titleRoleSettingRoute}
              />
              {/* category */}
              <PrivateRoute
                exact
                path="/category"
                component={LoadCategoryPage}
                title={messages.titleCategoryRoute}
              />
              {/* schedule */}
              <PrivateRoute
                exact
                path="/schedule"
                component={LoadSchedulePage}
                title={messages.titleScheduleRoute}
              />

              <PrivateRoute
                exact
                path="/department"
                component={LoadDepartmentPage}
                title={messages.titleDepartmentRoute}
              />
              <PrivateRoute
                exact
                path="/my-drive"
                component={MyDriverPage}
                title={messages.titleMyDriver}
              />
              <PrivateRoute
                exact
                path="/my-drive"
                component={MyDriverPage}
                title={messages.titleMyDriver}
              />
              <PrivateRoute
                exact
                path="/folders/:id"
                component={DocumentPage}
                title={messages.titleDocument}
              />
              <PrivateRoute
                exact
                path="/shared-with-me"
                component={SharedWithMePage}
                title={messages.titleSharedWithMe}
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
              {/* profile */}
              <PrivateRoute
                exact
                path="/profile"
                component={ProfilePage}
                title={messages.titleProfile}
              />

              {/* board */}
              <PrivateRoute
                exact
                path="/folder"
                component={LoadFolderLogPage}
                title={messages.titleFolder}
              />
              {/* board */}
              <PrivateRoute
                exact
                path="/daily-report"
                component={DailyReportPage}
                title={messages.titleDailyReport}
              />
              <PrivateRoute
                exact
                path="/nft"
                component={ItemNftPage}
                title={messages.titleNFT}
              />
            </Switch>
          </AppWrapper>
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

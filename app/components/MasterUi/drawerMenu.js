/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unused-state */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TodayIcon from '@material-ui/icons/Today';
import { FaGoogleDrive } from 'react-icons/fa';
import MeetingRoom from '@material-ui/icons/MeetingRoom';
import People from '@material-ui/icons/People';
import VpnKey from '@material-ui/icons/VpnKey';
import WatchIcon from '@material-ui/icons/AccessTime';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import AssignmentIcon from '@material-ui/icons/Assignment';
import VehicleIcon from '@material-ui/icons/DriveEta';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';

import NotificationsIcon from '@material-ui/icons/Notifications';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InsertChartOutlined from '@material-ui/icons/InsertChartOutlined';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import SettingsApplications from '@material-ui/icons/SettingsApplications';
import Ballot from '@material-ui/icons/Ballot';
import CreditCardIcon from '@material-ui/icons/CreditCard';

import {
  isPluginEnabled,
  isAccessSystemEnabled,
  isCanteenSystemEnabled,
  isCardIssuingSystemEnabled,
} from 'utils/plugins';
import ApiClient from './api';

import messages from './messages';
import { TYPE_ACCOUNT, MENU_NAMES } from '../../utils/constants';
import { localstoreUtilites } from '../../utils/persistenceData';
import { ROUTE } from './routes';
import {
  Accessibility,
  Speaker,
  ShopTwo,
  StoreMallDirectoryOutlined,
  Timer,
  Payment,
  Person,
  Settings,
  Category,
  Note,
  Airplay,
  Gamepad,
} from '@material-ui/icons';

// import { tr } from 'date-fns/locale';

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    overflow: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 8,
  },
  menuDrawerItem: {
    textDecoration: 'none',
  },
  hidden: {
    display: 'none',
  },
});

const permissions = localstoreUtilites.getPermissionsFromLocalStorage();
class DrawerMenu extends React.Component {
  state = {
    isNewLogin: true,
    mainMenu: {
      driver: false,
      user: false,
      categoryManage: false,
      system: false,
      board: false,
      game: false,
    },
    countReview: 0,
    countUserReview: 0,
    selectedIndex: '',
    mapMenuRoute: {
      // monitoring
      [ROUTE.dashBoard]: {
        index: ROUTE.dashBoard,
        indexParent: 'dashBoard',
      },

      // user
      [ROUTE.user]: {
        index: ROUTE.user,
        indexParent: 'user',
      },
      [ROUTE.department]: {
        index: ROUTE.department,
        indexParent: 'user',
      },

      // role
      [ROUTE.role]: {
        index: ROUTE.role,
        indexParent: 'system',
      },
      // category
      [ROUTE.category]: {
        index: ROUTE.category,
        indexParent: 'categoryManage',
      },
      // schedule
      [ROUTE.schedule]: {
        index: ROUTE.schedule,
        indexParent: 'scheduleManage',
      },
      // board
      [ROUTE.folder]: {
        index: ROUTE.folder,
        indexParent: 'board',
      },
      // room
      [ROUTE.roomManage]: {
        index: ROUTE.roomManage,
        indexParent: 'game',
      },
    },
  };

  /**
   * Function for returning boolean value of making main menu
   * @param {String} name : Main menu name
   * @author WooCheol Kim
   * @Date 2020.06.16
   */
  isRenderMenu = (menu) => {
    let rol = false;
    if (permissions) {
      if (menu === MENU_NAMES.VehicleManagement) {
        rol =
          permissions.vehicleManagement &&
          permissions.vehicleManagement.viewVehicle;
      } else {
        for (let i = 0; i < menu.length; i += 1) {
          const permission = permissions[menu[i]];
          let keyString = '';
          if (menu[i] === 'visitManagement') {
            keyString = 'viewVisit';
          } else if (menu[i] == 'inquiryWaiting') {
            keyString = 'viewInquiryWaiting';
            rol = permissions['waiting'] && permissions['waiting'][keyString];
            if (rol) {
              break;
            }
          } else if (menu[i] == 'topUpWaiting') {
            keyString = 'viewTopUpWaiting';
            rol = permissions['waiting'] && permissions['waiting'][keyString];
            if (rol) {
              break;
            }
          } else {
            keyString = 'view'.concat(
              menu[i].charAt(0).toUpperCase().concat(menu[i].slice(1)),
            );
          }

          rol = permissions[menu[i]] && permission[keyString];
          if (rol) {
            break;
          }
        }
      }
    }
    return rol;
  };

  navigateDefault = (route, rol) => {
    const isNewLogin = JSON.parse(localStorage.getItem('isNewLogin'));
    if (isNewLogin) {
      localStorage.setItem('isNewLogin', false);
      if (rol) {
        if (route === ROUTE.dashBoard) {
          this.props.history.push(route);
        }
      } else {
        localStorage.setItem('isNewLogin', true);
      }
    }
  };

  /**
   * Function for returing boolean value of maing sub menu
   * @param {String} route String value for route(path)
   * @author WooCheol Kim
   * @Date 2020.06.16
   */
  isRole = (route) => {
    let rol = false;
    const permissions = localstoreUtilites.getPermissionsFromLocalStorage();
    const { accountType } = localstoreUtilites.getAuthFromLocalStorage();
    if (permissions) {
      switch (route) {
        // Dashboard
        case ROUTE.dashBoard:
          rol = true;
          this.navigateDefault(route, rol);
          break;
        // driver
        case ROUTE.myDriver:
        case ROUTE.folders:
        case ROUTE.sharedWithMe:
          rol = true;
          this.navigateDefault(route, rol);
          break;
        // user
        case ROUTE.user:
          rol = permissions.user.viewUser;
          this.navigateDefault(route, rol);
          break;
        // department
        case ROUTE.department:
          rol = permissions.department.viewDepartment;
          this.navigateDefault(route, rol);
          break;
        // role
        case ROUTE.role:
          if (!permissions.role) {
            rol = false;
            break;
          }
          rol = permissions.role.viewRole;
          this.navigateDefault(route, rol);
          break;
        // category
        case ROUTE.category:
          rol = permissions.category.viewCategory;
          this.navigateDefault(route, rol);
          break;
        // schedule
        case ROUTE.schedule:
          rol = permissions.schedule.viewSchedule;
          this.navigateDefault(route, rol);
          break;
        // folder
        case ROUTE.folder:
          rol = permissions.folder.viewFolder;
          this.navigateDefault(route, rol);
          break;
        case ROUTE.dailyReport:
          rol = permissions.dailyReport.viewDailyReport;
          this.navigateDefault(route, rol);
          break;

        default:
          rol = true;
      }
    }
    if (rol === false && location.pathname === route) {
      console.log('rol', rol);
      console.log('location.pathname', location.pathname);
      console.log('route', route);
      this.props.history.push('/not-found');
    }

    return rol;
  };

  async UNSAFE_componentWillMount() {
    await this.browserChangeUrl();
    await this.props.updateCountReview();
  }

  browserChangeUrl = () => {
    const { location } = this.props;
    const { mapMenuRoute, mainMenu } = this.state;

    const map = mapMenuRoute[location.pathname];
    if (map) {
      this.setState({
        mainMenu: {
          ...mainMenu,
          [map.indexParent]: true,
        },
        selectedIndex: map.index,
      });
    }

    return 1;
  };

  handleOpenSubmenu(key) {
    const { mainMenu } = this.state;

    this.setState({
      mainMenu: {
        ...mainMenu,
        [key]: !mainMenu[key],
      },
    });
  }

  handleListItemClick = async (event, index, path) => {
    await this.setState({ selectedIndex: index });
    await this.props.history.push(path);
    // await this.props.updateCountReview();
    // await this.props.getLastLogin();
  };

  getCountReview = async () => {
    if (isPluginEnabled('visitManagement')) {
      try {
        const data = await ApiClient.getCountReview();
        this.setState({
          countReview: data,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  getCountUserReview = async () => {
    try {
      const data = await ApiClient.getCountUserReview();
      this.setState({
        countUserReview: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { classes, role, countReview } = this.props;

    // console.log(permissions);
    // check role when enter pathname
    // let isCorrectRole = false;
    // if (permissions) {
    //   switch (location.pathname) {
    //     case ROUTE.dashBoard:
    //       isCorrectRole = true;
    //       break;
    //     case ROUTE.myDriver:
    //     case ROUTE.sharedWithMe:
    //       isCorrectRole = true;
    //       break;
    //     case ROUTE.profile:
    //       isCorrectRole = true;
    //       break;
    //     case ROUTE.role:
    //       isCorrectRole = permissions.role ? permissions.role.viewRole : false;
    //       break;
    //     case ROUTE.category:
    //       isCorrectRole = permissions.category
    //         ? permissions.category.viewCategory
    //         : false;
    //       break;
    //     case ROUTE.schedule:
    //       isCorrectRole = permissions.schedule
    //         ? permissions.schedule.viewSchedule
    //         : false;
    //       break;
    //     case ROUTE.department:
    //       isCorrectRole = permissions.department
    //         ? permissions.department.viewDepartment
    //         : false;
    //       break;
    //     case ROUTE.user:
    //       isCorrectRole = permissions.user ? permissions.user.viewUser : false;
    //       break;
    //     case ROUTE.folder:
    //       isCorrectRole = permissions.folder
    //         ? permissions.folder.viewFolder
    //         : false;
    //       break;
    //     case ROUTE.dailyReport:
    //       isCorrectRole = permissions.dailyReport
    //         ? permissions.dailyReport.viewDailyReport
    //         : false;
    //       break;

    //     default:
    //       if (location.pathname.includes(ROUTE.userAdd)) {
    //         isCorrectRole = permissions.user ? permissions.user.addUser : false;
    //       }
    //       if (location.pathname.includes(ROUTE.userEdit)) {
    //         isCorrectRole = permissions.user
    //           ? permissions.user.editUser
    //           : false;
    //       }
    //       // if (location.pathname.includes(ROUTE.schedule)) {
    //       //   isCorrectRole = permissions.schedule
    //       //     ? permissions.user.deleteSchedule
    //       //     : false;
    //       // }
    //       if (location.pathname.includes(ROUTE.folders)) {
    //         isCorrectRole = true;
    //       }
    //   }
    // }

    // if (
    //   isCorrectRole === false &&
    //   this.props.location.pathname !== '/not-found'
    // ) {
    //   this.props.history.push('/not-found');
    // }

    return (
      <div className={classes.root}>
        <List component="nav">
          {/* <ListItem
            button
            id="dashBoard"
            selected={this.state.selectedIndex === ROUTE.dashBoard}
            onClick={(event) =>
              this.handleListItemClick(event, ROUTE.dashBoard, ROUTE.dashBoard)
            }
          >
            <DashboardIcon />
            <ListItemText disableTypography>
              <FormattedMessage {...messages.dashboard} />
            </ListItemText>
          </ListItem> */}
          {/* {this.isRole(ROUTE.folder) && (
            <ListItem
              button
              id="folder"
              selected={this.state.selectedIndex === ROUTE.folder}
              onClick={(event) =>
                this.handleListItemClick(event, ROUTE.folder, ROUTE.folder)
              }
            >
              <Note />
              <ListItemText disableTypography>
                <FormattedMessage {...messages.board} />
              </ListItemText>
            </ListItem>
          )} */}
          {/* schedule manage */}
          {/* <ListItem
            button
            id="schedule"
            selected={this.state.selectedIndex === ROUTE.schedule}
            onClick={(event) =>
              this.handleListItemClick(event, ROUTE.schedule, ROUTE.schedule)
            }
          >
            <TodayIcon />
            <ListItemText disableTypography>
              <FormattedMessage {...messages.schedule} />
            </ListItemText>
          </ListItem> */}
          {/* {this.isRole(ROUTE.dailyReport) && (
            <ListItem
              button
              id="dailyReport"
              selected={this.state.selectedIndex === ROUTE.dailyReport}
              onClick={(event) =>
                this.handleListItemClick(
                  event,
                  ROUTE.dailyReport,
                  ROUTE.dailyReport,
                )
              }
            >
              <Airplay />
              <ListItemText disableTypography>
                <FormattedMessage {...messages.dailyReport} />
              </ListItemText>
            </ListItem>
          )} */}
          {/* Driver */}
          {/* <ListItem
            button
            onClick={() => this.handleOpenSubmenu('driver')}
            id="driver"
          >
            &nbsp;
            <FaGoogleDrive size={19} />
            <ListItemText disableTypography>
              <FormattedMessage {...messages.driver} />
            </ListItemText>
            {this.state.mainMenu.driver ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            in={this.state.mainMenu.driver}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItem
                button
                className={classes.nested}
                selected={this.state.selectedIndex === ROUTE.myDriver}
                onClick={(event) =>
                  this.handleListItemClick(
                    event,
                    ROUTE.myDriver,
                    ROUTE.myDriver,
                  )
                }
                id="myDriver"
              >
                <ListItemText disableTypography>
                  <FormattedMessage {...messages.myDriver} />
                </ListItemText>
              </ListItem>
              <ListItem
                button
                className={classes.nested}
                selected={this.state.selectedIndex === ROUTE.sharedWithMe}
                onClick={(event) =>
                  this.handleListItemClick(
                    event,
                    ROUTE.sharedWithMe,
                    ROUTE.sharedWithMe,
                  )
                }
                id="sharedWithMe"
              >
                <ListItemText disableTypography>
                  <FormattedMessage {...messages.sharedWithMe} />
                </ListItemText>
              </ListItem>
            </List>
          </Collapse> */}
          {/* game */}
          <ListItem
            button
            onClick={() => this.handleOpenSubmenu('game')}
            id="game"
          >
            <Gamepad />
            <ListItemText disableTypography>
              <FormattedMessage {...messages.game} />
            </ListItemText>
            {this.state.mainMenu.game ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.mainMenu.game} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                className={classes.nested}
                selected={this.state.selectedIndex === ROUTE.roomManage}
                onClick={(event) =>
                  this.handleListItemClick(
                    event,
                    ROUTE.roomManage,
                    ROUTE.roomManage,
                  )
                }
                id="roomManage"
              >
                <ListItemText disableTypography>
                  <FormattedMessage {...messages.roomManage} />
                </ListItemText>
              </ListItem>
            </List>
          </Collapse>
          {/* user */}
          {this.isRenderMenu(MENU_NAMES.user) && (
            <ListItem
              button
              onClick={() => this.handleOpenSubmenu('user')}
              id="user"
            >
              <Person />
              <ListItemText disableTypography>
                <FormattedMessage {...messages.user} />
              </ListItemText>
              {this.state.mainMenu.user ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          )}
          <Collapse in={this.state.mainMenu.user} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {this.isRole(ROUTE.user) && (
                <ListItem
                  button
                  className={classes.nested}
                  selected={this.state.selectedIndex === ROUTE.user}
                  onClick={(event) =>
                    this.handleListItemClick(event, ROUTE.user, ROUTE.user)
                  }
                  id="user"
                >
                  <ListItemText disableTypography>
                    <FormattedMessage {...messages.user} />
                  </ListItemText>
                </ListItem>
              )}
              {this.isRole(ROUTE.department) && (
                <ListItem
                  button
                  className={classes.nested}
                  selected={this.state.selectedIndex === ROUTE.department}
                  onClick={(event) =>
                    this.handleListItemClick(
                      event,
                      ROUTE.department,
                      ROUTE.department,
                    )
                  }
                  id="department"
                >
                  <ListItemText disableTypography>
                    <FormattedMessage {...messages.department} />
                  </ListItemText>
                </ListItem>
              )}
            </List>
          </Collapse>

          {/* category manage */}
          {/* {this.isRenderMenu(MENU_NAMES.categoryManage) && (
            <ListItem
              button
              onClick={() => this.handleOpenSubmenu('categoryManage')}
              id="categoryManage"
            >
              <Category />
              <ListItemText disableTypography>
                <FormattedMessage {...messages.categoryManage} />
              </ListItemText>
              {this.state.mainMenu.categoryManage ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItem>
          )}
          <Collapse
            in={this.state.mainMenu.categoryManage}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {this.isRole(ROUTE.category) && (
                <ListItem
                  button
                  className={classes.nested}
                  selected={this.state.selectedIndex === ROUTE.category}
                  onClick={(event) =>
                    this.handleListItemClick(
                      event,
                      ROUTE.category,
                      ROUTE.category,
                    )
                  }
                  id="category"
                >
                  <ListItemText disableTypography>
                    <FormattedMessage {...messages.category} />
                  </ListItemText>
                </ListItem>
              )}
            </List>
          </Collapse> */}

          {/* system */}
          {this.isRenderMenu(MENU_NAMES.system) && (
            <ListItem
              button
              onClick={() => this.handleOpenSubmenu('system')}
              id="system"
            >
              <Settings />
              <ListItemText disableTypography>
                <FormattedMessage {...messages.system} />
              </ListItemText>
              {this.state.mainMenu.system ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          )}
          <Collapse
            in={this.state.mainMenu.system}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItem
                button
                className={classes.nested}
                selected={this.state.selectedIndex === ROUTE.nft}
                onClick={(event) =>
                  this.handleListItemClick(event, ROUTE.nft, ROUTE.nft)
                }
                id="nft"
              >
                <ListItemText disableTypography>
                  <FormattedMessage {...messages.nft} />
                </ListItemText>
              </ListItem>
            </List>
            {this.isRole(ROUTE.role) && (
              <ListItem
                button
                className={classes.nested}
                selected={this.state.selectedIndex === ROUTE.role}
                onClick={(event) =>
                  this.handleListItemClick(event, ROUTE.role, ROUTE.role)
                }
                id="role"
              >
                <ListItemText disableTypography>
                  <FormattedMessage {...messages.roleSetting} />
                </ListItemText>
              </ListItem>
            )}
          </Collapse>
        </List>
      </div>
    );
  }
}

DrawerMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  history: PropTypes.object,
  role: PropTypes.number,
  onClose: PropTypes.func,
  countReview: PropTypes.object,
  updateCountReview: PropTypes.func,
};

export default withStyles(styles)(DrawerMenu);

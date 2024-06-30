import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SubMenu,
} from 'react-pro-sidebar';
import { Icon } from '@iconify/react';
import { Flex, Link } from 'crox-new-uikit';
import { Button } from './CommonComponents';
import './styles.css';
import 'react-pro-sidebar/dist/css/styles.css';
import * as LottiePlayer from '@lottiefiles/lottie-player';
import imgAttack from 'images/people/attack.png';
import messages from './messages.js';
import { FormattedMessage } from 'react-intl';
import { localstoreUtilites } from '../../utils/persistenceData.js';

function Sidebar(props) {
  const { setCollapse, collapse, toggle, setToggle, history } = props;

  return (
    <ProSidebar
      className="proSidebar"
      collapsed={collapse}
      toggled={toggle}
      breakPoint="md"
      // image="/sidebar/valbg2.png"
      style={{ position: 'fixed' }}
    >
      <SidebarHeader className="proSidebar__header">
        <img
          onClick={() => setCollapse(!collapse)}
          src={imgAttack}
          style={{ width: 50, cursor: 'pointer' }}
          alt="logo"
          className={
            !collapse
              ? 'proSidebar__header__logo'
              : 'proSidebar__header__logo img-size-75'
          }
        />
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu
            title={<FormattedMessage {...messages.game} />}
            icon={<Icon icon="noto:video-game" fontSize="20px" />}
          >
            {/* <MenuItem
              icon={<Icon icon="noto:joystick" fontSize="20px" />}
              onClick={() => {}}
            >
              Choose Character
            </MenuItem> */}
            <MenuItem
              icon={<Icon icon="twemoji:crossed-swords" fontSize="20px" />}
              onClick={() => {
                history.push('/room-game');
              }}
            >
              <FormattedMessage {...messages.battle} />
            </MenuItem>
            {/* <MenuItem
              icon={<Icon icon="noto:bank" fontSize="20px" />}
              onClick={() => {}}
            >
              Stake
            </MenuItem> */}
          </SubMenu>

          <SubMenu
            title={<FormattedMessage {...messages.NFTmarket} />}
            icon={<Icon icon="emojione:department-store" fontSize="20px" />}
          >
            <MenuItem
              icon={<Icon icon="emojione:department-store" fontSize="20px" />}
              onClick={() => {
                history.push('/market');
              }}
            >
              <FormattedMessage {...messages.market} />
            </MenuItem>
            {/* <MenuItem
              icon={<Icon icon="emojione:admission-tickets" fontSize="20px" />}
              onClick={() => {}}
            >
              My Listings
            </MenuItem> */}
            <MenuItem
              icon={<Icon icon="twemoji:framed-picture" fontSize="20px" />}
              onClick={() => {
                history.push('/my-nft');
              }}
            >
              <FormattedMessage {...messages.myNFTs} />
            </MenuItem>
            {/* <MenuItem
              icon={<Icon icon="twemoji:money-with-wings" fontSize="20px" />}
              onClick={() => {}}
            >
              Rented NFTs
            </MenuItem> */}
            {/* <MenuItem
              icon={<Icon icon="twemoji:hourglass-done" fontSize="20px" />}
              onClick={() => {}}
            >
              Lent NFTs
            </MenuItem> */}
          </SubMenu>
          <SubMenu
            title={<FormattedMessage {...messages.profile} />}
            icon={<Icon icon="icon-park:peoples-two" fontSize="20px" />}
          >
            <MenuItem
              icon={<Icon icon="ic:sharp-groups" fontSize="20px" />}
              onClick={() => {
                history.push('/my-group');
              }}
            >
              <FormattedMessage {...messages.myGroup} />
            </MenuItem>
            <MenuItem
              icon={<Icon icon="icon-park-outline:analysis" fontSize="20px" />}
              onClick={() => {
                history.push('/analysis');
              }}
            >
              <FormattedMessage {...messages.analysis} />
            </MenuItem>
            <MenuItem
              icon={<Icon icon="fa-solid:user-friends" fontSize="20px" />}
              onClick={() => {
                history.push('/friend');
              }}
            >
              <FormattedMessage {...messages.friend} />
            </MenuItem>
            <MenuItem
              icon={<Icon icon="fa:history" fontSize="20px" />}
              onClick={() => {
                history.push('/history');
              }}
            >
              <FormattedMessage {...messages.history} />
            </MenuItem>
            <MenuItem
              icon={<Icon icon="iconamoon:profile" fontSize="20px" />}
              onClick={() => {
                history.push(`/my-profile`);
              }}
            >
              <FormattedMessage {...messages.myProfile} />
            </MenuItem>
          </SubMenu>

          <SubMenu
            title={<FormattedMessage {...messages.community} />}
            icon={
              <Icon icon="fluent:people-community-20-filled" fontSize="20px" />
            }
          >
            <MenuItem
              icon={
                <Icon
                  icon="fluent:people-team-add-20-regular"
                  fontSize="20px"
                />
              }
              onClick={() => {
                history.push('/group');
              }}
            >
              <FormattedMessage {...messages.group} />
            </MenuItem>
            <MenuItem
              icon={<Icon icon="hugeicons:ranking" fontSize="20px" />}
              onClick={() => {
                history.push('/rank');
              }}
            >
              <FormattedMessage {...messages.rank} />
            </MenuItem>
          </SubMenu>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <Flex
          flexDirection={collapse ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          p="20px"
          mr={!collapse && '30px'}
        >
          <Link
            href="https://github.com/anhmuoi"
            mr={!collapse && '10px'}
            mb={collapse && '10px'}
          >
            <Icon icon="bi:github" color="white" width="25" height="25" />
          </Link>
          <Link href="" mr={!collapse && '10px'} mb={collapse && '10px'}>
            <Icon icon="bi:linkedin" color="white" width="25" height="25" />
          </Link>

          <Link href="">
            <Icon
              icon="simple-icons:facebook"
              color="white"
              width="25"
              height="25"
            />
          </Link>

          {collapse && (
            <Button
              className="proSidebar__collapseBtn relative"
              onClick={() => setCollapse(!collapse)}
            >
              <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets1.lottiefiles.com/datafiles/9P0TTCFMNh7ejB7/data.json"
                style={{ width: '30px' }}
              />
            </Button>
          )}
        </Flex>
      </SidebarFooter>
      {!collapse && (
        <Button
          className="proSidebar__collapseBtn"
          onClick={() => setCollapse(!collapse)}
        >
          <lottie-player
            autoplay
            loop
            mode="normal"
            src="https://assets7.lottiefiles.com/datafiles/5uaVMFvoH3yRSoC/data.json"
            style={{ width: '30px' }}
          />
        </Button>
      )}
    </ProSidebar>
  );
}

export default Sidebar;

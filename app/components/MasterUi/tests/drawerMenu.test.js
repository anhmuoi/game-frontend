import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import DrawerMenu from '../drawerMenu';
import { TYPE_ACCOUNT } from '../../../utils/constants';

describe('<DrawerMenu />', () => {
  const pushSpy = jest.fn(url => url);
  const history = { push: pushSpy };
  const onCloseSpy = jest.fn();

  it('should render 7 Collapse (group item)', () => {
    const location = { pathname: '/' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );
    expect(wrapper.find('Collapse')).toHaveLength(7);
  });

  describe('Monitoring menu', () => {
    const location = { pathname: '/' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );

    it('should change state when click group ListItem user menu', () => {
      const drawerMenuComponet = wrapper.find('DrawerMenu');
      /**
       * 1. init state: open: [false, false, false, false, false, false]
       * 2. mount with route /: open: [true, false, false, false, false, false] (open)
       * 3. TEST: click listItem menu (menu group): open: [false, false, false, false, false, false] (close)
       */
      const resultExpected = [false, false, false, false, false, false, false];
      drawerMenuComponet
        .find('ListItem#monitoringGR')
        .at(0)
        .prop('onClick')();

      expect(drawerMenuComponet.instance().state.open).toEqual(resultExpected);
    });

    it('group 1(user) should contains 2 menu item: user and department', () => {
      expect(
        wrapper
          .find('Collapse')
          .at(0)
          .find('ListItem'),
      ).toHaveLength(2);
    });
    it('should push path to history object when click on user management menu item', () => {
      wrapper
        .find('Collapse')
        .at(0)
        .find('ListItem')
        .at(0)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/');
    });

    it('should push path to history object when click on department menu item', () => {
      wrapper
        .find('Collapse')
        .at(0)
        .find('ListItem')
        .at(1)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/device-monitoring');
    });
  });

  describe('User menu', () => {
    const location = { pathname: '/department' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );

    it('should change state when click group ListItem door menu', () => {
      const drawerMenuComponet = wrapper.find('DrawerMenu');
      /**
       * 1. init state: open: [false, false, false, false, false, false, false]
       * 2. mount with route /device-setting: open: [false, false, false, true, false, false, false] (open)
       * 3. TEST: click listItem menu (menu group): open: [false, fale, false, false, false, false, false] (close)
       */
      const resultExpected = [false, false, false, false, false, false, false];
      drawerMenuComponet
        .find('ListItem#userGR')
        .at(0)
        .prop('onClick')();

      expect(drawerMenuComponet.instance().state.open).toEqual(resultExpected);
    });

    it('should push path to history object when click on department menu item', () => {
      wrapper
        .find('Collapse')
        .at(1)
        .find('ListItem')
        .at(0)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/department');
    });

    it('should push path to history object when click on user menu item', () => {
      wrapper
        .find('Collapse')
        .at(1)
        .find('ListItem')
        .at(1)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/user');
    });
  });

  describe('Access management menu', () => {
    const location = { pathname: '/access-group' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );

    it('should change state when click group ListItem access menu', () => {
      const drawerMenuComponet = wrapper.find('DrawerMenu');
      /**
       * 1. init state: open: [false, false, false, false, false, false]
       * 2. mount with route /access-group: open: [false, true, false, false, false, false] (open)
       * 3. TEST: click listItem menu (menu group): open: [false, false, false, false, false, false] (close)
       */
      const resultExpected = [false, false, false, false, false, false, false];
      drawerMenuComponet
        .find('ListItem#accessGR')
        .at(0)
        .prop('onClick')();

      expect(drawerMenuComponet.instance().state.open).toEqual(resultExpected);
    });

    it('should push path to history object when click on access-group menu item', () => {
      wrapper
        .find('Collapse')
        .at(2)
        .find('ListItem')
        .at(0)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/access-group');
    });

    it('should push path to history object when click on timezone menu item', () => {
      wrapper
        .find('Collapse')
        .at(2)
        .find('ListItem')
        .at(1)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/timezone');
    });

    it('should push path to history object when click on holiday menu item', () => {
      wrapper
        .find('Collapse')
        .at(2)
        .find('ListItem')
        .at(2)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/holiday');
    });
  });

  describe('Door Management menu', () => {
    const location = { pathname: '/device-setting' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );

    it('should change state when click group ListItem report menu', () => {
      const drawerMenuComponet = wrapper.find('DrawerMenu');
      /**
       * 1. init state: open: [false, false, false, false, false, false]
       * 2. mount with route /monitoring: open: [false, false, false, false, true, false] (open)
       * 3. TEST: click listItem menu (menu group): open: [false, false, false, false, false, false] (close)
       */
      const resultExpected = [false, false, false, false, false, false, false];
      drawerMenuComponet
        .find('ListItem#doorGR')
        .at(0)
        .prop('onClick')();

      expect(drawerMenuComponet.instance().state.open).toEqual(resultExpected);
    });

    it('group 4(Door Management) should contains 3 menu item: Device Setting, Message Setting, Building ', () => {
      expect(
        wrapper
          .find('Collapse')
          .at(3)
          .find('ListItem'),
      ).toHaveLength(3);
    });

    it('should push path to history object when click on device-setting menu item', () => {
      wrapper
        .find('Collapse')
        .at(3)
        .find('ListItem')
        .at(0)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/device-setting');
    });

    it('should push path to history object when click on message-setting menu item', () => {
      wrapper
        .find('Collapse')
        .at(3)
        .find('ListItem')
        .at(1)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/message-setting');
    });

    it('should push path to history object when click on building menu item', () => {
      wrapper
        .find('Collapse')
        .at(3)
        .find('ListItem')
        .at(2)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/building');
    });
  });

  describe('Report menu', () => {
    const location = { pathname: '/event' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );

    it('should change state when click group ListItem report menu', () => {
      const drawerMenuComponet = wrapper.find('DrawerMenu');
      /**
       * 1. init state: open: [false, false, false, false, false, false]
       * 2. mount with route /event: open: [false, false, false, false, true, false] (open)
       * 3. TEST: click listItem menu (menu group): open: [false, false, false, false, false, false] (close)
       */
      const resultExpected = [false, false, false, false, false, false, false];
      drawerMenuComponet
        .find('ListItem#reportGR')
        .at(0)
        .prop('onClick')();

      expect(drawerMenuComponet.instance().state.open).toEqual(resultExpected);
    });

    it('group 5(Report) should contains 5 menu item: event, system log, accessible door, registered user, analysis', () => {
      expect(
        wrapper
          .find('Collapse')
          .at(4)
          .find('ListItem'),
      ).toHaveLength(5);
    });

    it('should push path to history object when click on event menu item', () => {
      wrapper
        .find('Collapse')
        .at(4)
        .find('ListItem')
        .at(0)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/event');
    });

    it('should push path to history object when click on system-log menu item', () => {
      wrapper
        .find('Collapse')
        .at(4)
        .find('ListItem')
        .at(1)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/system-log');
    });

    it('should push path to history object when click on accessible-door menu item', () => {
      wrapper
        .find('Collapse')
        .at(4)
        .find('ListItem')
        .at(2)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/accessible-door');
    });

    it('should push path to history object when click on registered-user menu item', () => {
      wrapper
        .find('Collapse')
        .at(4)
        .find('ListItem')
        .at(3)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/registered-user');
    });

    it('should push path to history object when click on analysis menu item', () => {
      wrapper
        .find('Collapse')
        .at(4)
        .find('ListItem')
        .at(4)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/analysis');
    });
  });

  describe('System management menu', () => {
    const location = { pathname: '/account-management' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );

    it('should change state when click group ListItem configuration menu', () => {
      const drawerMenuComponet = wrapper.find('DrawerMenu');
      /**
       * 1. init state: open: [false, false, false, false, false, false]
       * 2. mount with route /account-management: open: [false, false, false, false, true, false] (open)
       * 3. TEST: click listItem menu (menu group): open: [false, false, false, false, false, false] (close)
       */
      const resultExpected = [false, false, false, false, false, false, false];
      drawerMenuComponet
        .find('ListItem#systemGR')
        .at(0)
        .prop('onClick')();

      expect(drawerMenuComponet.instance().state.open).toEqual(resultExpected);
    });

    it('group 6(sytem management) should contains 2 menu item: account management, setting', () => {
      expect(
        wrapper
          .find('Collapse')
          .at(5)
          .find('ListItem'),
      ).toHaveLength(2);
    });

    it('should push path to history object when click on account-management menu item', () => {
      wrapper
        .find('Collapse')
        .at(5)
        .find('ListItem')
        .at(0)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/account-management');
    });

    it('should push path to history object when click on setting menu item', () => {
      wrapper
        .find('Collapse')
        .at(5)
        .find('ListItem')
        .at(1)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/setting');
    });
  });

  describe('Advanced management menu', () => {
    const location = { pathname: '/check-device' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
        />
      </IntlProvider>,
    );

    it('should change state when click group ListItem advanced management menu', () => {
      const drawerMenuComponet = wrapper.find('DrawerMenu');
      /**
       * 1. init state: open: [false, false, false, false, false, false]
       * 2. mount with route /check-device: open: [false, false, false, false, false, true] (open)
       * 3. TEST: click listItem menu (menu group): open: [false, false, false, false, false, false] (close)
       */
      const resultExpected = [false, false, false, false, false, false, false];
      drawerMenuComponet
        .find('ListItem#advancedManagementGR')
        .at(0)
        .prop('onClick')();

      expect(drawerMenuComponet.instance().state.open).toEqual(resultExpected);
    });

    it(
      'group 7(advanced management) should contains 6 menu item: check device setting,' +
        ' check user information, emergency, device update, event recovery, transmit all data',
      () => {
        expect(
          wrapper
            .find('Collapse')
            .at(6)
            .find('ListItem'),
        ).toHaveLength(6);
      },
    );

    it('should push path to history object when click on check-device menu item', () => {
      wrapper
        .find('Collapse')
        .at(6)
        .find('ListItem')
        .at(0)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/check-device');
    });

    it('should push path to history object when click on check-user menu item', () => {
      wrapper
        .find('Collapse')
        .at(6)
        .find('ListItem')
        .at(1)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/check-user');
    });

    it('should push path to history object when click on emergency menu item', () => {
      wrapper
        .find('Collapse')
        .at(6)
        .find('ListItem')
        .at(2)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/emergency');
    });

    it('should push path to history object when click on device-update menu item', () => {
      wrapper
        .find('Collapse')
        .at(6)
        .find('ListItem')
        .at(3)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/device-update');
    });

    it('should push path to history object when click on event-recovery menu item', () => {
      wrapper
        .find('Collapse')
        .at(6)
        .find('ListItem')
        .at(4)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/event-recovery');
    });

    it('should push path to history object when click on transmit-data menu item', () => {
      wrapper
        .find('Collapse')
        .at(6)
        .find('ListItem')
        .at(5)
        .simulate('click');
      expect(pushSpy).toBeCalledWith('/transmit-data');
    });
  });

  describe('render with role', () => {
    const location = { pathname: '/event' };
    const wrapper = mount(
      <IntlProvider locale="en">
        <DrawerMenu
          location={location}
          history={history}
          onClose={onCloseSpy}
          role={TYPE_ACCOUNT.primaryManager}
        />
      </IntlProvider>,
    );

    it('should not render system log', () => {
      expect(
        wrapper
          .find('Collapse')
          .at(4)
          .find('ListItem'),
      ).toHaveLength(4);
    });

    it('should not render account management and setting', () => {
      wrapper.setProps({
        children: React.cloneElement(wrapper.props().children, {
          location: { pathname: '/account-management' },
        }),
      });
    });
    expect(
      wrapper
        .find('Collapse')
        .at(5)
        .find('ListItem'),
    ).toHaveLength(0);
  });
});

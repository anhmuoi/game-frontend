import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import { localstoreUtilites } from 'utils/persistenceData';
import MaterUI from '../index';
import configureStore from '../../../configureStore';
import { translationMessages } from '../../../i18n';
import LanguageProvider from '../../../containers/LanguageProvider';

localstoreUtilites.removeAuthFromLocalStorage = jest.fn();

describe('<MaterUI />', () => {
  describe('render', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<MaterUI />);
    });

    it('should render AppBar', () => {
      expect(wrapper.find('AppBar')).toBeDefined();
    });

    it('should render Drawer', () => {
      expect(wrapper.find('Drawer')).toBeDefined();
    });

    it('should render main content block', () => {
      expect(wrapper.find('main')).toBeDefined();
    });

    it('should render LocaleToggle', () => {
      expect(wrapper.find('LocaleToggle')).toBeDefined();
    });

    it('should render SnackbarsUI component', () => {
      expect(wrapper.find('SnackbarsUI')).toBeDefined();
    });
  });

  describe('handle action', () => {
    let wrapper;
    const store = configureStore({}, browserHistory);
    const childPage = <div />;
    const location = { pathname: '/' };
    const history = createHistory();
    const enqueueSnackbarMock = jest.fn();

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <LanguageProvider messages={translationMessages}>
            <ConnectedRouter history={history}>
              <MaterUI
                error
                childPage={childPage}
                location={location}
                enqueueSnackbar={enqueueSnackbarMock}
              />
            </ConnectedRouter>
          </LanguageProvider>
        </Provider>,
      );
    });

    it('should change anchorEl state when close multies language menu', () => {
      const materialComponent = wrapper.find('MaterUI');
      materialComponent
        .find('LocaleToggle')
        .at(0)
        .prop('handleClose')();

      expect(materialComponent.instance().state.anchorEl).toBe(null);
    });

    describe('logout action', () => {
      it('should clear info in localStorage when click logout button', () => {
        window.location.assign = jest.fn();
        const materialComponent = wrapper.find('MaterUI');
        materialComponent
          .find('IconButton[aria-owns="menu-appbar"]')
          .prop('onClick')();

        expect(localstoreUtilites.getAuthFromLocalStorage()).toEqual({
          token: 'token_fake',
          isAuthed: false,
          accountType: 3,
        });
      });

      it('should redirect to login page', () => {
        const reloadMock = jest.fn();
        window.location.assign = reloadMock;
        const materialComponent = wrapper.find('MaterUI');
        materialComponent
          .find('IconButton[aria-owns="menu-appbar"]')
          .prop('onClick')();

        expect(window.location.assign).toBeCalledWith('/login');
      });
    });

    it('should change open state when click button open drawer', () => {
      const materialComponent = wrapper.find('MaterUI');

      materialComponent
        .find('IconButton[aria-label="Open drawer"]')
        .prop('onClick')();

      expect(materialComponent.instance().state.open).toBe(true);
    });

    it('should change open state when click button open drawer', () => {
      wrapper
        .find('IconButton')
        .find('[aria-label="Open drawer"]')
        .first()
        .prop('onClick')();

      expect(
        wrapper
          .find('MaterUI')
          .first()
          .state('open'),
      ).toBe(true);
    });

    it('should change open state when click button close drawer', () => {
      wrapper
        .find('Drawer')
        .at(0)
        .prop('onClose')();

      expect(
        wrapper
          .find('MaterUI')
          .at(0)
          .instance().state.open,
      ).toBe(false);
    });

    it('should logout when clicking logout', () => {
      const logoutButton = wrapper.find('[title="Logout"]').first();

      logoutButton.prop('onClick')();
      expect(localstoreUtilites.removeAuthFromLocalStorage).toHaveBeenCalled();
    });

    it('should be able to close locale setting from LocaleToggle', () => {
      const toggleMenu = wrapper.find('LocaleToggle').first();
      const masterWrapper = wrapper.find('MaterUI').first();

      masterWrapper.setState({ anchorEl: undefined });

      toggleMenu.prop('handleClose')();
      expect(masterWrapper.state('anchorEl')).toBe(null);
    });
  });
});

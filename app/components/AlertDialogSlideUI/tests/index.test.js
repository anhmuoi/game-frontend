import React from 'react';
import { shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import AlertDialogSlideUI from '../index';

describe('<AlertDialogSlideUI />', () => {
  describe('Button on dialog ', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(
        <AlertDialogSlideUI
          onOpen={false}
          title={<span>title dialog</span>}
          message="message dialog"
        />,
      );
    });

    it('should render Button', () => {
      expect(wrapper.find('Button')).toBeDefined();
    });
    it('should render DialogTitle', () => {
      expect(wrapper.find('DialogTitle')).toBeDefined();
    });

    it('should render DialogContent', () => {
      expect(wrapper.find('DialogContent')).toBeDefined();
    });

    it('should render DialogContentText', () => {
      expect(wrapper.find('DialogContentText')).toBeDefined();
    });

    it('should render DialogActions', () => {
      expect(wrapper.find('DialogActions')).toBeDefined();
    });
  });

  describe('click agree button', () => {
    const onActionAgree = jest.fn();
    const onCloseDialog = jest.fn();
    let wrapper;

    beforeEach(() => {
      jest.clearAllMocks();
      wrapper = mount(
        <IntlProvider locale="en">
          <AlertDialogSlideUI
            onOpen={false}
            onCloseDialog={onCloseDialog}
            onActionAgree={onActionAgree}
            title={<span>title dialog</span>}
            message="message dialog"
          />
        </IntlProvider>,
      );
    });

    it('should call onActionAgree props', () => {
      wrapper.find('Button.alertDialogSlideUI-agree').prop('onClick')();
      expect(onActionAgree).toBeCalled();
    });

    it('should call onCloseDialog props', () => {
      wrapper.find('Button.alertDialogSlideUI-agree').prop('onClick')();
      expect(onCloseDialog).toBeCalled();
    });

    it('should call onCloseDialog when call onClose props of Dialog', () => {
      wrapper.find('Dialog').prop('onClose')();
      expect(onCloseDialog).toBeCalled();
    });
  });
});

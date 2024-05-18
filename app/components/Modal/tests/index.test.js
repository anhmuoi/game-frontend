import React from 'react';
import { shallow, mount } from 'enzyme';
import { ModalMaterialUi, styles } from '../index';

describe('<ModalMaterialUi />', () => {
  let wrapper;
  const theme = {
    palette: { background: { paper: {} } },
    shadows: [],
    spacing: { unit: 0 },
  };
  beforeEach(() => {
    wrapper = shallow(<ModalMaterialUi classes={styles(theme)} />);
  });

  it('should contains Modal component of material UI', () => {
    expect(wrapper.find('Modal')).toBeDefined();
  });

  it('should contains ModalMaterialUiWrapped component of material UI', () => {
    expect(wrapper.find('ModalMaterialUiWrapped')).toBeDefined();
  });

  it('should contains 2 div tag', () => {
    expect(wrapper.find('div').length).toBe(2);
  });

  describe('test visible LinearProgress', () => {
    it('should contains LinearProgress', () => {
      const renderDeep = mount(
        <ModalMaterialUi classes={styles(theme)} isLoading />,
      );
      expect(renderDeep.find('LinearProgress')).toBeDefined();
    });
  });
});

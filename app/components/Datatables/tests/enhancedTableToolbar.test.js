import React from 'react';
import { mount } from 'enzyme';
import EnhancedTableToolbar, { widthSearch } from '../enhancedTableToolbar';

describe('<EnhancedTableToolbar />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <EnhancedTableToolbar numSelected={3} title={<span>title</span>} />,
    );
  });

  it('should render 2 button, add and delete', () => {
    expect(wrapper.find('Fab').length).toBe(2);
  });

  it('should render input search', () => {
    expect(wrapper.find('input[placeholder="Search…"]').length).toBe(1);
  });

  it('width of search should return correctly value depend on Window width(screen size: viewport)', () => {
    const WINDOW_WIDTH = 1800;
    expect(widthSearch(WINDOW_WIDTH)).toBe(WINDOW_WIDTH / 6);
  });
});

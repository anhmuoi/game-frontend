import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class SelectMenu extends React.Component {
  state = {
    anchorEl: null,
    selected: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = event => {
    this.setState({ anchorEl: null });
  };

  handleSelect = item => {
    const { onChange } = this.props;
    this.setState({
      selected: item,
      anchorEl: null,
    });
    onChange(item.id);
  };

  render() {
    const { anchorEl, selected } = this.state;
    const { id, options, value } = this.props;

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClick}
          style={{ paddingTop: '10px', paddingBottom: '10px' }}
        >
          {selected
            ? selected.name
            : options.find(item => item.id === value).name}
        </Button>
        <Menu
          id={id}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {options.map(item => (
            <MenuItem
              value={item.id}
              key={item.id}
              onClick={() => this.handleSelect(item)}
            >
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default SelectMenu;

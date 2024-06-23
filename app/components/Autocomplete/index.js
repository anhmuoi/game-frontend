import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Search } from '@material-ui/icons';

function renderInput(inputProps) {
  const { InputProps, styleInput } = inputProps;

  return (
    <FormControl required={InputProps.required} fullWidth>
      <InputLabel shrink>{InputProps.label}</InputLabel>
      <FormattedMessage {...messages.typeToSearch}>
        {(typeToSearch) => (
          <Input
            style={styleInput}
            {...InputProps}
            value={
              typeof InputProps.value !== 'string'
                ? InputProps.placeholder
                : InputProps.value
            }
            placeholder={InputProps.placeholder || typeToSearch}
            endAdornment={
              <InputAdornment position="end">
                <ArrowDropDown />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        )}
      </FormattedMessage>
    </FormControl>
  );
}

// const styles = {
//   root: {
//     flexGrow: 1,
//   },
//   container: {
//     flexGrow: 1,
//     position: 'relative',
//   },
//   paper: {
//     position: 'absolute',
//     zIndex: 999,
//     marginTop: 2,
//     left: 0,
//     right: 0,
//   },
// };

class Autocomplete extends React.Component {
  state = {
    suggestions: [],
  };
  downshiftRef = React.createRef();

  clearSelection = () => {
    this.downshiftRef.current.clearSelection();
  };

  getSuggestions = async (evt) => {
    try {
      const keyword = evt ? evt.target.value : '';
      if (this.props.onChangeKeyword) {
        await this.props.onChangeKeyword(keyword);
      }
      const data = await this.props.getSuggestions(keyword);
      this.setState({
        suggestions: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  renderSuggestion = ({ suggestion, itemProps, selectedItem }) => {
    const isSelected = selectedItem && selectedItem.id === suggestion.id;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.id}
        selected={isSelected}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion.label}
      </MenuItem>
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.suggestion !== this.props.suggestion) {
      this.setState({
        suggestions: this.props.suggestion,
      });
    }
  }

  render() {
    const {
      classes,
      label,
      required,
      onSelect,
      id,
      placeholder,
      styleInput,
    } = this.props;
    const { suggestions } = this.state;

    return (
      <div style={{ flexGrow: 1 }}>
        <Downshift
          ref={this.downshiftRef}
          id={id}
          onChange={onSelect}
          itemToString={(item) => (item ? item.label : '')}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            isOpen,
            inputValue,
            selectedItem,
          }) => (
            <div
              style={{
                flexGrow: 1,
                position: 'relative',
              }}
            >
              {renderInput({
                styleInput: styleInput,
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  required,
                  label,
                  onChange: this.getSuggestions,
                  onClick: () => {
                    this.clearSelection();
                    this.getSuggestions();
                    this.downshiftRef.current.openMenu();
                  },
                  placeholder,
                  // value: placeholder,
                }),
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper
                    style={{
                      position: 'relative',
                      zIndex: 999,
                      marginTop: 2,
                      left: 0,
                      right: 0,
                      overflow: 'auto',
                      maxHeight: 200,
                    }}
                    square
                  >
                    {suggestions.length === 0 &&
                      this.renderSuggestion({
                        suggestion: { id: 0, label: 'Not Found' },
                        index: 0,
                        itemProps: getItemProps({
                          item: { id: 0, label: 'Not Found' },
                        }),
                      })}
                    {suggestions.length > 0 &&
                      suggestions
                        .filter(
                          (item) =>
                            !inputValue ||
                            (typeof item.label === 'string'
                              ? item.label
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase())
                              : item.label),
                        )
                        .map((suggestion, index) =>
                          this.renderSuggestion({
                            suggestion,
                            index,
                            itemProps: getItemProps({ item: suggestion }),
                            highlightedIndex,
                            selectedItem,
                          }),
                        )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  required: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  styleInput: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  getSuggestions: PropTypes.func.isRequired,
  onChangeKeyword: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
};

export default Autocomplete;

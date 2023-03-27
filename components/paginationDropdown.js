import React, { Component } from 'react';
import { Picker } from 'react-native';

export default class PaginationDropdown extends Component {
  constructor(props) {
    super(props);

    this.onValueChange = props.onValueChange;
    this.state = {
      selectedValue: 20, // default
    };
  }

  render() {
    const options = [5, 10, 15, 20, 25];
    const { selectedValue } = this.state;
    return (
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          this.setState({ selectedValue: itemValue });
          this.onValueChange(itemValue);
        }}
      >
        {options.map((option) => (
          <Picker.Item key={option} label={`${option}`} value={option} />
        ))}
      </Picker>
    );
  }
}

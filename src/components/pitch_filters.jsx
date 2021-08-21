import * as React from "react";
import PropTypes from 'prop-types';
import { Select } from "@chakra-ui/react";


const strikeTypes = [
  'called_strike',
  'foul',
  'foul_tip',
  'swinging_strike',
  'swinging_strike_blocked',
];

export class PitchFilters extends React.Component {
  constructor(props) {
    super(props);
    this.propTypes = {
      onFiltersChange: PropTypes.func.isRequired,
      // TODO(kaisers): Add Array<{value, displayName}> type
      filterOptions: PropTypes.array,
    };
    this.updateFilters = this.updateFilters.bind(this);
    
    this.filterOptions = props.filterOptions;
    
    this.state = {
      appliedFilters: ['all'],
    };
  }
  
  updateFilters(filters) {
    const maybeEvent = filters && filters.target && filters.target.selectedOptions;
    if (maybeEvent) {
      // TODO(kaisers): How to get the full list?
      filters = [filters.target.selectedOptions[0].value];
    }
    if (!filters) {
      filters = this.state.appliedFilters;
    }
    if (typeof filters === 'string') {
      filters = [filters];
    }
    for (const filter of filters) {
      if (filter === 'strike') {
        // TODO(kaisers): 'strikes' is not working as the selected option
        // this.setState({selectedOption: 'strike'});
        filters = filters.concat(strikeTypes);
        break;
      }
    }
    console.log('filters', filters);
    this.setState({ appliedFilters: filters }, () => {
      this.props.onFiltersChange(this.state.appliedFilters);  
    });
    
  }
  
  render() {
    return (
      <select value={this.state.appliedFilters}
          placeholder="Select option"
          onChange={this.updateFilters}>
        {this.filterOptions.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.displayName}
            </option>
          );
        })}
      </select>
    );
  }
}

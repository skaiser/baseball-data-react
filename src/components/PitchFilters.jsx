import * as React from "react";
import PropTypes from "prop-types";
import { Select } from "@chakra-ui/react";

// TODO(kaisers): Move into shared location
export const strikeTypes = [
  "called_strike",
  "foul",
  "foul_tip",
  "swinging_strike",
  "swinging_strike_blocked",
];

export const PitchFilters = (props) => {
  const [appliedFilters, setAppliedFilters] = React.useState(["all"]);

  React.useEffect(() => {
    props.onFiltersChange(appliedFilters);
  }, [appliedFilters]);

  const updateFilters = (filters) => {
    const maybeEvent =
      filters && filters.target && filters.target.selectedOptions;
    if (maybeEvent) {
      // TODO(kaisers): Get the full list?
      filters = [filters.target.options[filters.target.selectedIndex].value];
    }
    if (!filters) {
      filters = appliedFilters;
    }
    if (typeof filters === "string") {
      filters = [filters];
    }
    for (const filter of filters) {
      if (filter === "strike") {
        filters = filters.concat(strikeTypes);
        break;
      }
    }
    setAppliedFilters(filters);
  };

  return (
    <Select variant="outline" size="lg" onChange={updateFilters}>
      {props.filterOptions.map((option) => {
        return (
          <option key={option.value} value={option.value}>
            {option.displayName}
          </option>
        );
      })}
    </Select>
  );
};

PitchFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
  // TODO(kaisers): Add Array<{value, displayName}> type
  // TODO(kaisers): Also consider keeping this defined locally
  filterOptions: PropTypes.array,
};

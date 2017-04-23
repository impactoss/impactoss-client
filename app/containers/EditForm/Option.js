import React, { PropTypes } from 'react';

// See containers/EntityListFilter/reducer.js for initial use case

const Option = (props) => (
  <span>{props.label} <span style={{ float: 'right' }} className="count">{props.count}</span></span>
);

Option.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

export default Option;

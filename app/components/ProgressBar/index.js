import React, { PropTypes } from 'react';

const ProgressBar = ({ progress }) => (
  <span>
    {
      progress && progress < 100 &&
      progress
    }
  </span>
);

ProgressBar.propTypes = {
  progress: PropTypes.number,
};

export default ProgressBar;

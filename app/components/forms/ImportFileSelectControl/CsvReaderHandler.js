import React from 'react';
import PropTypes from 'prop-types';

import { useCSVReader } from 'react-papaparse';

const CsvReaderHandler = ({ children, ...props }) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader {...props}>
      {children}
    </CSVReader>
  );
};

CsvReaderHandler.propTypes = {
  children: PropTypes.node,
  isButton: PropTypes.bool,
};

export default CsvReaderHandler;

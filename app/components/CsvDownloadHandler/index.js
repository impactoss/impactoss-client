import React from 'react';
import PropTypes from 'prop-types';
import { useCSVDownloader } from 'react-papaparse';

const CsvDownloadHandler = ({ children, isButton, ...props }) => {
  const { CSVDownloader, Type } = useCSVDownloader();
  return (
    <CSVDownloader type={isButton ? Type.Button : Type.Link} {...props}>
      {children}
    </CSVDownloader>
  );
};
CsvDownloadHandler.propTypes = {
  children: PropTypes.node,
  isButton: PropTypes.bool,
};
export default CsvDownloadHandler;

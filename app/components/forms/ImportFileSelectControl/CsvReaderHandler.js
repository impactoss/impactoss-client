import React from 'react';
import { useCSVReader } from "react-papaparse";

const CsvReaderHandler = ({ children, ...props }) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader {...props} >
      {children}
    </CSVReader>
  );
};
export default CsvReaderHandler;
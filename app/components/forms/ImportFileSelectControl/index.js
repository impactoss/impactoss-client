import React from 'react';
import PropTypes from 'prop-types';
import { Control } from 'react-redux-form/immutable';
import SelectFile from './SelectFile';

const ImportFileSelectControl = (props) => {
  const { model, ...otherProps } = props;
  return (
    <Control.input
      model={model}
      component={SelectFile}
      {...otherProps}
    />
  );
};

ImportFileSelectControl.propTypes = {
  model: PropTypes.string.isRequired,
};

export default ImportFileSelectControl;

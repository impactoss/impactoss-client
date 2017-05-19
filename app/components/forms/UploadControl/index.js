import React, { PropTypes } from 'react';
import { Control } from 'react-redux-form/immutable';
import Upload from './Upload';

const UploadControl = (props) => {
  const { model } = props;
  return (
    <Control.input
      model={model}
      component={Upload}
    />
  );
};

UploadControl.propTypes = {
  model: PropTypes.string.isRequired,
};

export default UploadControl;

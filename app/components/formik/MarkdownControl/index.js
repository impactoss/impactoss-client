import React from 'react';
import PropTypes from 'prop-types';
import { Control } from 'react-redux-form/immutable';

import TextareaMarkdownWrapper from './TextareaMarkdownWrapper';

export function MarkdownControl({ model, ...props }) {
  return (
    <Control.textarea
      model={model}
      component={TextareaMarkdownWrapper}
      mapProps={{
        value: ({ viewValue }) => viewValue,
      }}
      {...props}
    />
  );
}

MarkdownControl.propTypes = {
  model: PropTypes.string.isRequired,
};

export default MarkdownControl;

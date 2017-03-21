import React, { PropTypes } from 'react';
import { Control } from 'react-redux-form';

import MultiSelect from './MultiSelect';

const MultiSelectControl = (props) => {
  const { model, options, ...otherProps } = props;
  return (
    <Control
      model={model}
      component={MultiSelect}
      multiple
      mapProps={{
        values: (cprops) => cprops.viewValue,
        onChange: (cprops) => cprops.onChange,
      }}
      controlProps={{
        options,
      }}
      {...otherProps}
    />
  );
};

MultiSelectControl.propTypes = {
  model: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default MultiSelectControl;

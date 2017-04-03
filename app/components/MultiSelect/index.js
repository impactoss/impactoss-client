import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Control } from 'react-redux-form/immutable';

import MultiSelect from './MultiSelect';

const MultiSelectControl = (props) => {
  const { model, options, valueCompare, ...otherProps } = props;
  return (
    <Control
      type="multiselect"
      model={model}
      component={MultiSelect}
      multiple
      mapProps={{
        values: (cprops) => cprops.viewValue,
        onChange: (cprops) => cprops.onChange,
      }}
      controlProps={{
        options,
        valueCompare,
      }}
      {...otherProps}
    />
  );
};

MultiSelectControl.propTypes = {
  model: PropTypes.string.isRequired,
  options: PropTypes.instanceOf(Immutable.List),
  valueCompare: PropTypes.func,
};

export default MultiSelectControl;

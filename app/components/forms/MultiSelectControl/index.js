import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Control } from 'react-redux-form/immutable';

import MultiSelect, {
  getChangedOptions,
  getCheckedValuesFromOptions,
  getUncheckedValuesFromOptions,
} from './MultiSelect';

const MultiSelectControl = (props) => {
  const { model, options, valueCompare, threeState, multiple, required, ...otherProps } = props;
  return (
    <Control
      type="multiselect"
      model={model}
      component={MultiSelect}
      mapProps={{
        values: (cprops) => cprops.viewValue,
        onChange: (cprops) => cprops.onChange,
      }}
      controlProps={{
        options,
        valueCompare,
        threeState,
        multiple,
        required,
      }}
      {...otherProps}
    />
  );
};

MultiSelectControl.propTypes = {
  model: PropTypes.string.isRequired,
  threeState: PropTypes.bool,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  options: PropTypes.instanceOf(Immutable.List),
  valueCompare: PropTypes.func,
};

export default MultiSelectControl;
// Helper functions
export {
  getChangedOptions,
  getCheckedValuesFromOptions,
  getUncheckedValuesFromOptions,
};

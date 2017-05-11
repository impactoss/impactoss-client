import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { Control } from 'react-redux-form/immutable';

import MultiSelect, {
  getChangedOptions,
  getCheckedOptions,
  getCheckedValuesFromOptions,
  getUncheckedValuesFromOptions,
} from './MultiSelect';

const MultiSelectControl = (props) => {
  const {
    model,
    options,
    threeState,
    multiple,
    required,
    title,
    buttons,
    filter,
     ...otherProps
  } = props;
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
        threeState,
        multiple,
        required,
        buttons,
        title,
        filter,
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
  filter: PropTypes.bool,
  options: PropTypes.instanceOf(List),
  title: PropTypes.string,
  buttons: PropTypes.array,
};

MultiSelectControl.defaultProps = {
  filter: true,
  multiple: true,
  required: false,
  threeState: false,
};

export default MultiSelectControl;
// Helper functions
export {
  getChangedOptions,
  getCheckedOptions,
  getCheckedValuesFromOptions,
  getUncheckedValuesFromOptions,
};

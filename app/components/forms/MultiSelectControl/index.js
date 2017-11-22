import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Control } from 'react-redux-form/immutable';

import MultiSelect from './MultiSelect';

import {
  getChangedOptions,
  getCheckedOptions,
  getCheckedValuesFromOptions,
  getUncheckedValuesFromOptions,
} from './utils';

const MultiSelectControl = (props) => {
  const {
    model,
    options,
    threeState,
    multiple,
    required,
    title,
    buttons,
    search,
    onCancel,
    panelId,
    advanced,
    selectAll,
    tagFilterGroups,
    closeOnClickOutside,
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
        search,
        onCancel,
        panelId,
        advanced,
        selectAll,
        tagFilterGroups,
        closeOnClickOutside,
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
  search: PropTypes.bool,
  selectAll: PropTypes.bool,
  advanced: PropTypes.bool,
  closeOnClickOutside: PropTypes.bool,
  options: PropTypes.instanceOf(List),
  title: PropTypes.string,
  panelId: PropTypes.string,
  buttons: PropTypes.array,
  tagFilterGroups: PropTypes.array,
  onCancel: PropTypes.func,
};

MultiSelectControl.defaultProps = {
  search: true,
  multiple: true,
  required: false,
  threeState: false,
  closeOnClickOutside: true,
};

export default MultiSelectControl;
// Helper functions
export {
  getChangedOptions,
  getCheckedOptions,
  getCheckedValuesFromOptions,
  getUncheckedValuesFromOptions,
};

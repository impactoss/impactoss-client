import React from 'react';
import PropTypes from 'prop-types';
import { useFormikContext, Field } from 'formik';

const FieldWithContext = ({ validate, field, ...rest }) => {
  const { values } = useFormikContext();

  if (field.isFieldDisabled && field.isFieldDisabled(values)) {
    return null;
  }

  return (
    <Field
      {...rest}
      validate={(value) => validate(value, values)}
    />
  );
};

FieldWithContext.propTypes = {
  validate: PropTypes.func,
  field: PropTypes.object,
};

export default FieldWithContext;

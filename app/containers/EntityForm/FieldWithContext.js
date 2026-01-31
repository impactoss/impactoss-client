import React from 'react';
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

export default FieldWithContext;

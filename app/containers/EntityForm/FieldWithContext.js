import React from 'react';
import { useFormikContext, Field } from 'formik';

const FieldWithContext = ({ validate, ...rest }) => {
  const { values } = useFormikContext();
  return (
    <Field
      {...rest}
      validate={(value) => validate(value, values)}
    />
  );
};
export default FieldWithContext;
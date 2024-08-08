import { useEffect } from 'react';

const SubmitFailedHandler = ({ isValid, isValidating, isSubmitting, handleSubmitFail }) => {
  useEffect(() => {
    if (!isValid && !isValidating && isSubmitting) {
      handleSubmitFail();
    }
  }, [isValid, isValidating, isSubmitting]);

  return null;
};
export default SubmitFailedHandler;
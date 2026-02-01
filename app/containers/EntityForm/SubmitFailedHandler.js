import { useEffect } from 'react';
import PropTypes from 'prop-types';

const SubmitFailedHandler = ({
  isValid, isValidating, isSubmitting, handleSubmitFail,
}) => {
  useEffect(() => {
    if (!isValid && !isValidating && isSubmitting) {
      handleSubmitFail();
    }
  }, [isValid, isValidating, isSubmitting]);

  return null;
};
SubmitFailedHandler.propTypes = {
  handleSubmitFail: PropTypes.func,
  isValid: PropTypes.bool,
  isValidating: PropTypes.bool,
  isSubmitting: PropTypes.bool,
};

export default SubmitFailedHandler;

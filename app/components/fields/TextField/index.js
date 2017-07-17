import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';

class TextField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          <FormattedMessage {...field.label} />
        </Label>
        <p>{field.value}</p>
      </FieldWrap>
    );
  }
}

TextField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default TextField;

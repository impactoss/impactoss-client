import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Label from 'components/fields/Label';
import Reference from 'components/fields/Reference';
import ReferenceLarge from 'components/fields/ReferenceLarge';
import FieldWrapInline from 'components/fields/FieldWrapInline';

class ReferenceField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrapInline>
        { field.label &&
          <Label>
            <FormattedMessage {...field.label} />
          </Label>
        }
        { field.large &&
          <ReferenceLarge>{field.value}</ReferenceLarge>
        }
        { !field.large &&
          <Reference>{field.value}</Reference>
        }
      </FieldWrapInline>
    );
  }
}

ReferenceField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ReferenceField;

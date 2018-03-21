import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';

import Label from 'components/fields/Label';
import ReferenceLarge from 'components/fields/ReferenceLarge';
import FieldWrapInline from 'components/fields/FieldWrapInline';

class ReferenceField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrapInline>
        {field.isManager &&
          <Label>
            <FormattedMessage {...(field.label || appMessages.attributes.reference)} />
          </Label>
        }
        <ReferenceLarge>{field.value}</ReferenceLarge>
      </FieldWrapInline>
    );
  }
}

ReferenceField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ReferenceField;

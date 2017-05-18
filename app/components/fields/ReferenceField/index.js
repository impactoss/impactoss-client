import React, { PropTypes } from 'react';

import appMessages from 'containers/App/messages';

import Label from 'components/fields/Label';
import Reference from 'components/fields/Reference';
import ReferenceLarge from 'components/fields/ReferenceLarge';
import FieldWrapInline from 'components/fields/FieldWrapInline';

class ReferenceField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrapInline>
        <Label>
          {field.label || this.context.intl.formatMessage(appMessages.attributes.reference)}
        </Label>
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

ReferenceField.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default ReferenceField;

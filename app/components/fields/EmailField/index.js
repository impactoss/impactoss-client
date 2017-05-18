import React, { PropTypes } from 'react';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import Url from 'components/fields/Url';

class EmailField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          {field.label || this.context.intl.formatMessage(appMessages.attributes.url)}
        </Label>
        <Url target="_blank" href={`mailto:${field.value}`}>
          {field.value}
        </Url>
      </FieldWrap>
    );
  }
}

EmailField.propTypes = {
  field: PropTypes.object.isRequired,
};
EmailField.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default EmailField;

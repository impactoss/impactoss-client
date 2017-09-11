import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { truncateText } from 'utils/string';

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
          <FormattedMessage {...(field.label || appMessages.attributes.email)} />
        </Label>
        <Url target="_blank" href={`mailto:${field.value}`} title={field.value}>
          {truncateText(field.value, 30, false)}
        </Url>
      </FieldWrap>
    );
  }
}

EmailField.propTypes = {
  field: PropTypes.object.isRequired,
};
EmailField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EmailField;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import Url from 'components/fields/Url';

class LinkField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          <FormattedMessage {...(field.label || appMessages.attributes.url)} />
        </Label>
        <Url target="_blank" href={field.value}>
          {field.anchor || field.value}
        </Url>
      </FieldWrap>
    );
  }
}

LinkField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default LinkField;

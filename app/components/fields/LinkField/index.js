import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import { truncateText } from 'utils/string';

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
        { !field.internal &&
          <Url target="_blank" href={field.value} title={field.anchor || field.value}>
            {truncateText(field.anchor || field.value, 30, false)}
          </Url>
        }
        { field.internal &&
          <Link to={field.value} title={field.anchor || field.value}>
            {truncateText(field.anchor || field.value, 30, false)}
          </Link>
        }
      </FieldWrap>
    );
  }
}

LinkField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default LinkField;

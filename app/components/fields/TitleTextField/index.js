import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import TitleText from 'components/fields/TitleText';

class TitleField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        {field.isManager &&
          <Label>
            <FormattedMessage {...(field.label || appMessages.attributes.title)} />
          </Label>
        }
        <TitleText>{field.value}</TitleText>
      </FieldWrap>
    );
  }
}

TitleField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default TitleField;

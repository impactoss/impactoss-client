import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import EmptyHint from 'components/fields/EmptyHint';
import Manager from 'components/fields/Manager';

class ManagerField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          <FormattedMessage {...(field.label || appMessages.attributes.manager_id.categories)} />
        </Label>
        { field.value &&
          <Manager>{field.value}</Manager>
        }
        { !field.value &&
          <EmptyHint>
            <FormattedMessage {...field.showEmpty} />
          </EmptyHint>
        }
      </FieldWrap>
    );
  }
}

ManagerField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ManagerField;

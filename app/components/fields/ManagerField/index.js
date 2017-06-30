import React from 'react';
import PropTypes from 'prop-types';

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
          {field.label || this.context.intl.formatMessage(appMessages.attributes.manager_id.categories)}
        </Label>
        { field.value &&
          <Manager>{field.value}</Manager>
        }
        { !field.value &&
          <EmptyHint>{field.showEmpty}</EmptyHint>
        }
      </FieldWrap>
    );
  }
}

ManagerField.propTypes = {
  field: PropTypes.object.isRequired,
};
ManagerField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ManagerField;

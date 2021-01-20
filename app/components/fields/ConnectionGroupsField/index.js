import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import ConnectionLabel from 'components/fields/ConnectionLabel';
import ConnectionLabelWrap from 'components/fields/ConnectionLabelWrap';

import Group from './Group';

const StyledFieldWrap = styled(FieldWrap)`
  padding-top: 15px;
`;


class ConnectionGroupsField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    const { intl } = this.context;

    const size = field.groups && field.groups.reduce((sum, group) => group.get(field.entityPath)
      ? sum + group.get(field.entityPath).size
      : sum,
    0);
    const label = intl.formatMessage(
      appMessages.fields.connectionsGrouped,
      {
        size,
        type: intl.formatMessage(
          size === 1
            ? appMessages.entities[field.entityType].single
            : appMessages.entities[field.entityType].plural
        ),
        byType: intl.formatMessage(field.groupedBy),
      }
    );

    return (
      <StyledFieldWrap>
        <ConnectionLabelWrap>
          <ConnectionLabel>
            {label}
          </ConnectionLabel>
        </ConnectionLabelWrap>
        { size > 0 && field.groups && field.groups.map((group, i) => (
          <Group
            key={i}
            group={group}
            field={field}
          />
        ))}
      </StyledFieldWrap>
    );
  }
}

ConnectionGroupsField.propTypes = {
  field: PropTypes.object.isRequired,
};
ConnectionGroupsField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ConnectionGroupsField;

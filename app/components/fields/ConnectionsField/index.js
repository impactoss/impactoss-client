import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';
import EntityListItems from 'components/entityList/EntityListMain/EntityListGroups/EntityListItems';

import FieldWrap from 'components/fields/FieldWrap';
import LabelLarge from 'components/fields/LabelLarge';
import Dot from 'components/fields/Dot';
import DotWrapper from 'components/fields/DotWrapper';
import EntityListItemsWrap from 'components/fields/EntityListItemsWrap';
import ToggleAllItems from 'components/fields/ToggleAllItems';
import EmptyHint from 'components/fields/EmptyHint';

const CONNECTIONMAX = 5;

class ConnectionsField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { showAllConnections: false };
  }

  render() {
    const { field } = this.props;
    const label = `${field.values.size} ${this.context.intl.formatMessage(
      field.values.size === 1
      ? appMessages.entities[field.entityType].single
      : appMessages.entities[field.entityType].plural
    )}`;

    return (
      <FieldWrap>
        <LabelLarge>
          {label}
          {field.entityType &&
            <DotWrapper>
              <Dot palette={field.entityType} pIndex={parseInt(field.id, 10)} />
            </DotWrapper>
          }
        </LabelLarge>
        <EntityListItemsWrap>
          <EntityListItems
            taxonomies={field.taxonomies}
            connections={field.connections}
            config={{ connections: { options: field.connectionOptions } }}
            entities={
              this.state.showAllConnections
                ? field.values
                : (field.values.slice(0, CONNECTIONMAX))
            }
            entityIcon={field.entityIcon}
            onEntityClick={field.onEntityClick}
            entityPath={field.entityPath}
          />
          { field.values.size > CONNECTIONMAX &&
            <ToggleAllItems
              onClick={() => this.setState({ showAllConnections: !this.state.showAllConnections })}
            >
              { this.state.showAllConnections &&
                <FormattedMessage {...appMessages.entities.showLess} />
              }
              { !this.state.showAllConnections &&
                <FormattedMessage {...appMessages.entities.showAll} />
              }
            </ToggleAllItems>
          }
        </EntityListItemsWrap>
        { (!field.values || field.values.size === 0) &&
          <EmptyHint>
            <FormattedMessage {...field.showEmpty} />
          </EmptyHint>
        }
      </FieldWrap>
    );
  }
}

ConnectionsField.propTypes = {
  field: PropTypes.object.isRequired,
};
ConnectionsField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ConnectionsField;

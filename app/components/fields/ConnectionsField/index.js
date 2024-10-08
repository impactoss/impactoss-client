import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';

import appMessages from 'containers/App/messages';
import EntityListItems from 'components/EntityListMain/EntityListGroups/EntityListItems';

import FieldWrap from 'components/fields/FieldWrap';
import ConnectionLabel from 'components/fields/ConnectionLabel';
import ConnectionLabelWrap from 'components/fields/ConnectionLabelWrap';
// import EntityListItemsWrap from 'components/fields/EntityListItemsWrap';
import ToggleAllItems from 'components/fields/ToggleAllItems';
import EmptyHint from 'components/fields/EmptyHint';
import PrintOnly from 'components/styled/PrintOnly';

const CONNECTIONMAX = 5;

const StyledFieldWrap = styled(FieldWrap)`
  padding-top: 15px;
`;

const PrintHint = styled(PrintOnly)`
  font-size: ${({ theme }) => theme.sizes.print.smaller};
  font-style: italic;
`;

class ConnectionsField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      showAllConnections: false,
      focusItem: null,
    };
  }

  getItemIdAt = (items, index) => {
    const itemsSliced = items.slice(index - 1, index);
    return itemsSliced ? itemsSliced.first().get('id') : null;
  };

  toggleAllItems = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState(
      (prevState) => ({
        showAllConnections: !prevState.showAllConnections,
        focusItem: !prevState.showAllConnections ? CONNECTIONMAX + 1 : null,
      }),
    );
  };

  render() {
    const { field, intl } = this.props;

    const label = `${field.values.size} ${intl.formatMessage(
      field.values.size === 1
        ? appMessages.entities[field.entityType].single
        : appMessages.entities[field.entityType].plural
    )}`;

    return (
      <StyledFieldWrap>
        <ConnectionLabelWrap>
          <ConnectionLabel>
            {label}
          </ConnectionLabel>
        </ConnectionLabelWrap>
        {(field.values && field.values.size > 0) && (
          <div>
            {field.values.size > CONNECTIONMAX
              && !this.state.showAllConnections
              && (
                <PrintHint>
                  <FormattedMessage
                    {...appMessages.hints.printListMore}
                    values={{
                      no: CONNECTIONMAX,
                    }}
                  />
                </PrintHint>
              )
            }
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
              isConnection
              focusEntityId={this.state.focusItem ? this.getItemIdAt(field.values, this.state.focusItem) : null}
            />
            {field.values.size > CONNECTIONMAX && (
              <ToggleAllItems onClick={this.toggleAllItems}>
                { this.state.showAllConnections
                && <FormattedMessage {...appMessages.entities.showLess} />
                }
                { !this.state.showAllConnections
                && <FormattedMessage {...appMessages.entities.showAll} />
                }
              </ToggleAllItems>
            )}
          </div>
        )}
        { (!field.values || field.values.size === 0)
          && (
            <EmptyHint>
              <FormattedMessage {...field.showEmpty} />
            </EmptyHint>
          )
        }
      </StyledFieldWrap>
    );
  }
}

ConnectionsField.propTypes = {
  field: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ConnectionsField);

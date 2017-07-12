import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { orderBy } from 'lodash/collection';
import { without } from 'lodash/array';

import { getEntitySortIteratee } from 'utils/sort';

import appMessages from 'containers/App/messages';
// import EntityListItems from 'components/entityList/EntityListMain/EntityListGroups/EntityListItems';

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
    this.state = {
      showAllConnections: [],
    };
  }
  // <EntityListItems
  //   entities={this.state.showAllConnections.indexOf(field.entityType) >= 0
  //     ? sortedValues
  //     : (sortedValues.slice(0, CONNECTIONMAX))
  //   }
  //   entityIcon={field.icon}
  //   entityLinkTo={field.entityPath}
  //   taxonomies={field.taxonomies}
  //   associations={{
  //     connections: { // filter by associated entity
  //       options: field.connectionOptions,
  //     },
  //   }}
  // />
  render() {
    const { field } = this.props;
    const sortedValues = orderBy(field.values, getEntitySortIteratee('id'), 'desc');
    return (
      <FieldWrap>
        <LabelLarge>
          {field.label}
          {field.entityType &&
            <DotWrapper>
              <Dot palette={field.entityType} pIndex={parseInt(field.id, 10)} />
            </DotWrapper>
          }
        </LabelLarge>
        <EntityListItemsWrap>
          EntityListItems: TODO
        </EntityListItemsWrap>
        { sortedValues.length > CONNECTIONMAX &&
          <ToggleAllItems
            onClick={() =>
              this.setState({
                showAllConnections: this.state.showAllConnections.indexOf(field.entityType) >= 0
                  ? without(this.state.showAllConnections, field.entityType)
                  : this.state.showAllConnections.concat([field.entityType]),
              })
            }
          >
            { this.state.showAllConnections.indexOf(field.entityType) >= 0 &&
              <FormattedMessage {...appMessages.entities.showLess} />
            }
            { this.state.showAllConnections.indexOf(field.entityType) < 0 &&
              <FormattedMessage {...appMessages.entities.showAll} />
            }
          </ToggleAllItems>
        }
        { (!field.values || field.values.length === 0) &&
          <EmptyHint>{field.showEmpty}</EmptyHint>
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

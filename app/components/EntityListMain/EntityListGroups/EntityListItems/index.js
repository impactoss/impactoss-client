import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import EntityListItemWrapper from './EntityListItemWrapper';

export class EntityListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        { this.props.entities.map((entity, key) => (
          <EntityListItemWrapper
            key={key}
            entity={entity}
            {...this.props}
          />
        ))}
      </div>
    );
  }
}

EntityListItems.propTypes = {
  entities: PropTypes.instanceOf(List).isRequired,
  entityIdsSelected: PropTypes.instanceOf(List),
  errors: PropTypes.instanceOf(Map),
  expandNo: PropTypes.number,
};

export default EntityListItems;

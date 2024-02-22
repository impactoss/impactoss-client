import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import EntityListItemWrapper from './EntityListItemWrapper';

export class EntityListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { entities, skipGroupTargetId } = this.props;
    return (
      <div>
        {entities.map((entity, index, list) => {
          let skipTargetId = null;
          if (list.size > index + 1) {
            const nextEntity = list.get(index + 1);
            skipTargetId = nextEntity
              ? `#list-item-${nextEntity.get('id')}`
              : null;
          } else if (skipGroupTargetId) {
            skipTargetId = skipGroupTargetId;
          }
          return (
            <EntityListItemWrapper
              key={index}
              entity={entity}
              skipTargetId={skipTargetId}
              {...this.props}
            />
          );
        })}
      </div>
    );
  }
}

EntityListItems.propTypes = {
  entities: PropTypes.instanceOf(List).isRequired,
  entityIdsSelected: PropTypes.instanceOf(List),
  errors: PropTypes.instanceOf(Map),
  expandNo: PropTypes.number,
  skipGroupTargetId: PropTypes.string,
};

export default EntityListItems;

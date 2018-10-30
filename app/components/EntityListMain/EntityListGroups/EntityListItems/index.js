import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import EntityListItemWatch from './EntityListItemWatch';
import EntityListItemWrapper from './EntityListItemWrapper';

export class EntityListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  renderEntity = (entity, key, simulate = false) => (
    <EntityListItemWrapper
      key={key}
      entity={entity}
      simulate={simulate}
      {...this.props}
    />
  );
  render() {
    return (
      <div>
        { this.props.entities.map((entity, key) =>
          this.props.scrollContainer
          ? <EntityListItemWatch
            scrollContainer={this.props.scrollContainer}
            key={key}
            entity={entity}
            errors={this.props.errors}
            expandNo={this.props.expandNo}
            entityIdsSelected={this.props.entityIdsSelected}
            renderEntity={(simulate) => this.renderEntity(entity, key, simulate)}
          />
          : this.renderEntity(entity, key)
        )}
      </div>
    );
  }
}

EntityListItems.propTypes = {
  entities: PropTypes.instanceOf(List).isRequired,
  entityIdsSelected: PropTypes.instanceOf(List),
  errors: PropTypes.instanceOf(Map),
  scrollContainer: PropTypes.object,
  expandNo: PropTypes.number,
};

export default EntityListItems;

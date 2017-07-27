import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List } from 'immutable';

import EntityListItemWatch from './EntityListItemWatch';
import EntityListItemWrapper from './EntityListItemWrapper';

const Styled = styled.div`
  padding: ${(props) => props.separated ? '1em 0 2em' : '0 0 2em'};
`;

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
      <Styled separated={this.props.expandNo}>
        { this.props.entities.map((entity, key) =>
          this.props.scrollContainer
          ? <EntityListItemWatch
            scrollContainer={this.props.scrollContainer}
            key={key}
            entity={entity}
            expandNo={this.props.expandNo}
            entityIdsSelected={this.props.entityIdsSelected}
            renderEntity={(simulate) => this.renderEntity(entity, key, simulate)}
          />
          : this.renderEntity(entity, key)
        )}
      </Styled>
    );
  }
}

EntityListItems.propTypes = {
  entities: PropTypes.instanceOf(List).isRequired,
  entityIdsSelected: PropTypes.instanceOf(List),
  scrollContainer: PropTypes.object,
  expandNo: PropTypes.number,
};

export default EntityListItems;

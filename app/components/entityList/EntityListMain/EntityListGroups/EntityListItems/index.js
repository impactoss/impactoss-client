import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import EntityListItemOuter from './EntityListItemOuter';

const Styled = styled.div`
  padding: ${(props) => props.separated ? '1em 0 2em' : '0 0 2em'};
`;

export class EntityListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillUpdate() {
    if (this.props.scrollContainer) {
      this.props.scrollContainer.update();
    }
  }
  render() {
    const { entities, expandNo, ...props } = this.props;
    return (
      <Styled separated={expandNo}>
        {
          entities.map((entity) =>
            <EntityListItemOuter
              scrollContainer={this.props.scrollContainer}
              key={entity.id}
              entity={entity}
              expandNo={expandNo}
              {...props}
            />
          )
        }
      </Styled>
    );
  }
}

EntityListItems.propTypes = {
  entities: PropTypes.array.isRequired,
  scrollContainer: PropTypes.object,
  expandNo: PropTypes.number,
};

export default EntityListItems;

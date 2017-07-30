import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Component from 'components/styled/Component';

import EntityListItemMainBottomTaxonomies from './EntityListItemMainBottomTaxonomies';
import EntityListItemMainBottomConnections from './EntityListItemMainBottomConnections';

const Styled = styled(Component)``;

export default class EntityListItemMainBottom extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    tags: PropTypes.array,
    connections: PropTypes.array,
    wrapper: PropTypes.object,
  }

  render() {
    const { tags, connections, wrapper } = this.props;

    return (
      <Styled>
        { tags && tags.length > 0 &&
          <EntityListItemMainBottomTaxonomies tags={tags} />
        }
        { connections && connections.length > 0 &&
          <EntityListItemMainBottomConnections
            connections={connections}
            wrapper={wrapper}
          />
        }
      </Styled>
    );
  }
}

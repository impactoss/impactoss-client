import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Component from 'components/styled/Component';

import EntityListItemMainBottomTaxonomies from './EntityListItemMainBottomTaxonomies';
import EntityListItemMainBottomConnections from './EntityListItemMainBottomConnections';
import EntityListItemMainBottomUser from './EntityListItemMainBottomUser';
// import EntityListItemMainBottomTargetDate from './EntityListItemMainBottomTargetDate';

const Styled = styled(Component)`
  margin-bottom: -5px;
`;

export default class EntityListItemMainBottom extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    tags: PropTypes.array,
    connections: PropTypes.array,
    wrapper: PropTypes.object,
    assignedUser: PropTypes.object,
  }

  render() {
    const { tags, connections, wrapper, assignedUser } = this.props;

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
        { assignedUser &&
          <EntityListItemMainBottomUser
            user={assignedUser}
          />
        }
      </Styled>
    );
  }
}

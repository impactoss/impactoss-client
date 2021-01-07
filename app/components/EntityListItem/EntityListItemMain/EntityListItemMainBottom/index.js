import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Component from 'components/styled/Component';

import EntityListItemMainBottomConnections from './EntityListItemMainBottomConnections';
import EntityListItemMainBottomUser from './EntityListItemMainBottomUser';
import EntityListItemMainBottomTargetDate from './EntityListItemMainBottomTargetDate';

const Styled = styled(Component)`
  margin-bottom: -5px;
  display: none;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    display: block;
  }
`;

class EntityListItemMainBottom extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { connections, wrapper, user, targetDate } = this.props;

    return (
      <Styled>
        { connections && connections.length > 0 &&
          <EntityListItemMainBottomConnections
            connections={connections}
            wrapper={wrapper}
          />
        }
        { user &&
          <EntityListItemMainBottomUser
            user={user}
          />
        }
        { targetDate &&
          <EntityListItemMainBottomTargetDate
            targetDate={targetDate}
          />
        }
      </Styled>
    );
  }
}

EntityListItemMainBottom.propTypes = {
  connections: PropTypes.array,
  wrapper: PropTypes.object,
  user: PropTypes.object,
  targetDate: PropTypes.string,
};

export default EntityListItemMainBottom;

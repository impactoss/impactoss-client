import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component';

import EntityListItemMainBottomTaxonomies from './EntityListItemMainBottomTaxonomies';
import EntityListItemMainBottomConnections from './EntityListItemMainBottomConnections';
import EntityListItemMainBottomTargetDate from './EntityListItemMainBottomTargetDate';

const Styled = styled(Component)``;

export default class EntityListItemMainBottom extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    entity: PropTypes.object.isRequired,
  }

  render() {
    const { entity } = this.props;

    return (
      <Styled>
        { entity.tags && entity.tags.length > 0 &&
          <EntityListItemMainBottomTaxonomies tags={entity.tags} />
        }
        { entity.connectedCounts && entity.connectedCounts.length > 0 &&
          <EntityListItemMainBottomConnections connections={entity.connectedCounts} />
        }
        { entity.targetDate &&
          <EntityListItemMainBottomTargetDate date={entity.targetDate} />
        }
      </Styled>
    );
  }
}

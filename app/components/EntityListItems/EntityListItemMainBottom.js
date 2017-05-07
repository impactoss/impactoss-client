import React, { PropTypes } from 'react';

import Component from 'components/basic/Component';

import EntityListItemMainBottomTaxonomies from './EntityListItemMainBottomTaxonomies';
import EntityListItemMainBottomConnections from './EntityListItemMainBottomConnections';
import EntityListItemMainBottomUpdated from './EntityListItemMainBottomUpdated';

export default class EntityListItemMainBottom extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    entity: PropTypes.object.isRequired,
  }

  render() {
    const { entity } = this.props;

    return (
      <Component>
        { entity.tags && entity.tags.length > 0 &&
          <EntityListItemMainBottomTaxonomies tags={entity.tags} />
        }
        { entity.connectedCounts && entity.connectedCounts.length > 0 &&
          <EntityListItemMainBottomConnections connections={entity.connectedCounts} />
        }
        { entity.updated &&
          <EntityListItemMainBottomUpdated updated={entity.updated} />
        }
      </Component>
    );
  }
}

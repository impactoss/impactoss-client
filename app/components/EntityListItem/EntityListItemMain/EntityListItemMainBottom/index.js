import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';

import Component from 'components/styled/Component';

import EntityListItemMainBottomTaxonomies from './EntityListItemMainBottomTaxonomies';
import EntityListItemMainBottomConnections from './EntityListItemMainBottomConnections';
import EntityListItemMainBottomUser from './EntityListItemMainBottomUser';
// import EntityListItemMainBottomTargetDate from './EntityListItemMainBottomTargetDate';

const Styled = styled(Component)`
  margin-bottom: -5px;
`;

class EntityListItemMainBottom extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { categories, taxonomies, onEntityClick, connections, wrapper, user } = this.props;
    const smartTaxonomy = taxonomies && taxonomies.find((tax) => tax.getIn(['attributes', 'is_smart']));

    return (
      <Styled>
        { categories && (categories.size > 0 || smartTaxonomy) &&
          <EntityListItemMainBottomTaxonomies
            categories={categories}
            taxonomies={taxonomies}
            onEntityClick={onEntityClick}
          />
        }
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
      </Styled>
    );
  }
}

EntityListItemMainBottom.propTypes = {
  categories: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  taxonomies: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  onEntityClick: PropTypes.func,
  connections: PropTypes.array,
  wrapper: PropTypes.object,
  user: PropTypes.object,
};

export default EntityListItemMainBottom;

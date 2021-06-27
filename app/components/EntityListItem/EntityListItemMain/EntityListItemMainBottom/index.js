import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';

import Component from 'components/styled/Component';

import EntityListItemMainConnections from './EntityListItemMainConnections';
import EntityListItemMainTaxonomies from './EntityListItemMainTaxonomies';

const Styled = styled(Component)`
  margin-bottom: -5px;
  display: none;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    display: block;
  }
  @media print {
    display: block !important;
  }
`;

class EntityListItemMainBottom extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      connections,
      wrapper,
      categories,
      taxonomies,
      onEntityClick,
    } = this.props;
    const smartTaxonomy = taxonomies && taxonomies.find(
      (tax) => tax.getIn(['attributes', 'is_smart'])
    );
    const hasUpper = connections && connections.length > 0;
    const hasLower = categories
      && (categories.size > 0 || smartTaxonomy);
    return (
      <Styled>
        {hasLower && (
          <EntityListItemMainTaxonomies
            categories={categories}
            taxonomies={taxonomies}
            onEntityClick={onEntityClick}
          />
        )}
        {hasUpper && (
          <EntityListItemMainConnections
            connections={connections}
            wrapper={wrapper}
          />
        )}
      </Styled>
    );
  }
}

EntityListItemMainBottom.propTypes = {
  connections: PropTypes.array,
  wrapper: PropTypes.object,
  categories: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  taxonomies: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  onEntityClick: PropTypes.func,
};

export default EntityListItemMainBottom;

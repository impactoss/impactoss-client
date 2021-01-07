import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import Component from 'components/styled/Component';
import Icon from 'components/Icon';

import ItemStatus from 'components/ItemStatus';
import ItemRole from 'components/ItemRole';
import ItemProgress from 'components/ItemProgress';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTopIcon from './EntityListItemMainTopIcon';
import EntityListItemMainTaxonomies from './EntityListItemMainTaxonomies';

export default class EntityListItemMainTop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    categories: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
    taxonomies: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
    onEntityClick: PropTypes.func,
  };

  render() {
    const { categories, taxonomies, onEntityClick, entity } = this.props;
    const smartTaxonomy = taxonomies && taxonomies.find((tax) => tax.getIn(['attributes', 'is_smart']));

    return (
      <Component>
        { entity.draft &&
          <ItemStatus draft={entity.draft} float="left" />
        }
        <EntityListItemMainTopReference>
          {entity.reference}
        </EntityListItemMainTopReference>
        { entity.entityIcon &&
          <EntityListItemMainTopIcon>
            <Icon name={entity.entityIcon} text />
          </EntityListItemMainTopIcon>
        }
        { entity.role &&
          <ItemRole role={entity.role} />
        }
        { categories && (categories.size > 0 || smartTaxonomy) &&
          <EntityListItemMainTaxonomies
            categories={categories}
            taxonomies={taxonomies}
            onEntityClick={onEntityClick}
          />
        }
        {
          entity.progressCategory &&
          <ItemProgress status={entity.progressCategory} />
        }
      </Component>
    );
  }
}

import React, { PropTypes } from 'react';
import { map, forEach } from 'lodash/collection';

import EntityListChildItem from 'components/EntityListChildItem';

export class EntityListChildItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getConnectedCounts = (entity, connectionOptions) => {
    const counts = [];
    forEach(connectionOptions, (option) => {
      if (entity[option.path] && Object.keys(entity[option.path]).length > 0) {
        counts.push({
          count: Object.keys(entity[option.path]).length,
          option: {
            label: option.label,
          },
        });
      }
    });
    return counts;
  };

  getEntityTags = (entity, taxonomies) => {
    const tags = [];
    if (entity.taxonomies) {
      const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
      forEach(taxonomies, (tax) => {
        forEach(tax.categories, (category, catId) => {
          if (categoryIds && categoryIds.indexOf(parseInt(catId, 10)) > -1) {
            const label = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
              ? category.attributes.short_title
              : category.attributes.title);
            tags.push({
              label: label.length > 10 ? `${label.substring(0, 10)}...` : label,
            });
          }
        });
      });
    }
    return tags;
  };

  mapToEntityListItem = (entity, props) => {
    const {
      taxonomies,
      entityLinkTo,
      filters,
      showDate,
    } = props;

    return {
      id: entity.id,
      title: entity.attributes.name || entity.attributes.title,
      reference: entity.attributes.number || entity.id,
      linkTo: `${entityLinkTo}${entity.id}`,
      status: entity.attributes.draft ? 'draft' : null,
      updated: showDate ? entity.attributes.updated_at.split('T')[0] : null,
      tags: taxonomies
        ? this.getEntityTags(entity, taxonomies)
        : [],
      connectedCounts: filters && filters.connections ? this.getConnectedCounts(entity, filters.connections.options) : [],
      reportChildren: entity.reports || entity.dates
        ? {
          reports: entity.reports ? Object.values(entity.reports) : [],
          dates: entity.dates ? Object.values(entity.dates) : [],
          entityLinkTo: '/reports/',
        } : null,
    };
  };

  render() {
    const { entities } = this.props;

    return (
      <div>
        {
          entities.map((entity, i) =>
            <EntityListChildItem
              key={i}
              entity={this.mapToEntityListItem(entity, this.props)}
            />
          )
        }
      </div>
    );
  }
}

EntityListChildItems.propTypes = {
  entities: PropTypes.array.isRequired,
  showDate: PropTypes.bool,
  taxonomies: PropTypes.object,
  entityLinkTo: PropTypes.string,
  filters: PropTypes.object,
  // childList: PropTypes.string,
};

export default EntityListChildItems;

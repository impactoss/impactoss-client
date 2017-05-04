import React, { PropTypes } from 'react';
import { map, forEach } from 'lodash/collection';

import EntityListItem from './EntityListItem';
import EntityListChildItems from './EntityListChildItems';

export class EntityListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getConnectedCounts = (entity, connectionOptions) => {
    const counts = [];
    forEach(connectionOptions, (option) => {
      const expandable = typeof option.expandable !== 'undefined' ? option.expandable : false;
      if (!expandable && entity[option.path] && Object.keys(entity[option.path]).length > 0) {
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

  getEntityTags = (entity, taxonomies, query, onClick) => {
    const tags = [];
    if (entity.taxonomies) {
      const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
      forEach(taxonomies, (tax) => {
        forEach(tax.categories, (category, catId) => {
          if (categoryIds && categoryIds.indexOf(parseInt(catId, 10)) > -1) {
            const label = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
              ? category.attributes.short_title
              : category.attributes.title);
            if (query && onClick) {
              tags.push({
                label: label.length > 10 ? `${label.substring(0, 10)}...` : label,
                onClick: () => onClick({
                  value: catId,
                  query,
                  checked: true,
                }),
              });
            } else {
              tags.push({
                label: label.length > 10 ? `${label.substring(0, 10)}...` : label,
              });
            }
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
      onTagClick,
      showDate,
      expand,
      expandable,
      expandableColumns,
      onExpand,
    } = props;

    return {
      id: entity.id,
      title: entity.attributes.name || entity.attributes.title,
      reference: entity.attributes.number || entity.id,
      linkTo: `${entityLinkTo}${entity.id}`,
      status: entity.attributes.draft ? 'draft' : null,
      updated: showDate ? entity.attributes.updated_at.split('T')[0] : null,
      tags: taxonomies
        ? this.getEntityTags(entity,
          taxonomies,
          filters.taxonomies && filters.taxonomies.query,
          filters.taxonomies && onTagClick)
        : [],
      connectedCounts: filters && filters.connections ? this.getConnectedCounts(entity, filters.connections.options) : [],
      expandables: expandable && !expand
        ? expandableColumns.map((column, i) => ({
          type: column.type,
          label: column.label,
          count: column.getCount && column.getCount(entity),
          info: column.getInfo && column.getInfo(entity),
          onClick: () => onExpand(true, i + 1),
        }))
        : [],
    };
  };

  render() {
    const {
      entities,
      entitiesSelected,
      isSelect,
      onEntitySelect,
      expand,
      expandable,
      expandableColumns,
      showDate,
      onExpand,
    } = this.props;

    return (
      <div>
        {
          entities.map((entity, i) =>
            <div key={i}>
              <EntityListItem
                select={isSelect}
                checked={isSelect && entitiesSelected.map((e) => e.id).indexOf(entity.id) > -1}
                onSelect={(checked) => onEntitySelect(entity.id, checked)}
                entity={this.mapToEntityListItem(entity, this.props)}
                expand={expand}
              />
              {expandable && expand > 0 && expandableColumns.length > 0 &&
                <EntityListChildItems
                  entities={expandableColumns[0].getEntities(entity)}
                  showDate={showDate}
                  entityLinkTo={expandableColumns[0].entityLinkTo}
                  taxonomies={null}
                  expand={expand - 1}
                  expandable={expandableColumns.length > 1}
                  expandableColumns={expandableColumns.length > 1 ? [expandableColumns[1]] : null}
                  onExpand={onExpand}
                />
              }
            </div>
          )
        }
      </div>
    );
  }
}

EntityListItems.propTypes = {
  entities: PropTypes.array.isRequired,
  entitiesSelected: PropTypes.array,
  isSelect: PropTypes.bool,
  onEntitySelect: PropTypes.func.isRequired,
  showDate: PropTypes.bool,
  taxonomies: PropTypes.object,
  entityLinkTo: PropTypes.string,
  filters: PropTypes.object,
  onTagClick: PropTypes.func,
  onExpand: PropTypes.func,
  expand: PropTypes.number,
  expandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
};

export default EntityListItems;

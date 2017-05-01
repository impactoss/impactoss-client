import React, { PropTypes } from 'react';
import { map, forEach } from 'lodash/collection';

import EntityListItem from 'components/EntityListItem';

export class EntityListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
      childList,
      onEntitySelect,
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
      children: childList ? {
        entities: entity[childList] ? Object.values(entity[childList]).reduce((memo, children) => {
          if (children.child) {
            memo.push(children.child);
          }
          return memo;
        }, []) : [],
        showDate,
        entityLinkTo: `/${childList}/`,
        onEntitySelect,
      } : null,
    };
  };

  render() {
    const {
      entities,
      entitiesSelected,
      isSelect,
    } = this.props;

    // console.log('List:render', entities, childList)

    return (
      <div>
        {
          entities.map((entity, i) =>
            <EntityListItem
              key={i}
              select={isSelect}
              checked={isSelect && entitiesSelected.map((e) => e.id).indexOf(entity.id) > -1}
              onSelect={(checked) => this.props.onEntitySelect(entity.id, checked)}
              entity={this.mapToEntityListItem(entity, this.props)}
            />
          )
        }
      </div>
    );
  }
}

EntityListItems.propTypes = {
  entities: PropTypes.array.isRequired,
  entitiesSelected: PropTypes.array,
  showDate: PropTypes.bool,
  isSelect: PropTypes.bool,
  onEntitySelect: PropTypes.func.isRequired,
  taxonomies: PropTypes.object,
  entityLinkTo: PropTypes.string,
  filters: PropTypes.object,
  onTagClick: PropTypes.func,
  childList: PropTypes.string,
};

export default EntityListItems;

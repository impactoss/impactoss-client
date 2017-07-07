import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { List } from 'immutable';

import { map, forEach } from 'lodash/collection';
// import { isEqual } from 'lodash/lang';

import EntityListItem from './EntityListItem';
import EntityListNestedList from './EntityListNestedList';
import EntityListNestedReportList from './EntityListNestedList/EntityListNestedReportList';

const ItemWrapper = styled.div`
  border-top: 1px solid;
  padding: ${(props) => props.separated ? '0.5em 0 2.5em' : '0'};
  border-color: ${(props) => props.separated ? palette('light', 4) : palette('light', 0)};
`;

export class EntityListItemWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getConnectedCounts = (entity, connectionOptions) => {
    const counts = [];
    forEach(connectionOptions, (option) => {
      const isExpandable = typeof option.expandable !== 'undefined' ? option.expandable : false;
      if (!isExpandable && entity[option.path] && Object.keys(entity[option.path]).length > 0) {
        counts.push({
          count: Object.keys(entity[option.path]).length,
          option: {
            label: option.label,
            icon: option.path,
            style: option.path,
          },
        });
      }
    });
    return counts;
  };

  getEntityTags = (entity, taxonomies, query, onClick) => {
    const tags = [];
    if (entity.categories) {
      const categoryIds = map(map(Object.values(entity.categories), 'attributes'), 'category_id');
      forEach(taxonomies, (tax) => {
        forEach(tax.categories, (category, catId) => {
          if (categoryIds && categoryIds.indexOf(parseInt(catId, 10)) > -1) {
            const label = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
              ? category.attributes.short_title
              : category.attributes.title);
            if (query && onClick) {
              tags.push({
                taxId: tax.id,
                title: category.attributes.title,
                label: label.length > 10 ? `${label.substring(0, 10)}...` : label,
                onClick: () => onClick({
                  value: catId,
                  query,
                  checked: true,
                }),
              });
            } else {
              tags.push({
                taxId: tax.id,
                title: category.attributes.title,
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
      associations,
      onTagClick,
      expandNo,
      isExpandable,
      expandableColumns,
      onExpand,
    } = props;
    return {
      id: entity.id,
      title: entity.attributes.name || entity.attributes.title,
      reference: entity.attributes.number || entity.attributes.reference || entity.id,
      linkTo: `${entityLinkTo}${entity.id}`,
      status: entity.attributes.draft ? 'draft' : null,
      // targetDate: entity.attributes.target_date ? this.context.intl.formatDate(new Date(entity.attributes.target_date)) : null,
      tags: taxonomies
        ? this.getEntityTags(entity,
          taxonomies,
          associations.taxonomies && associations.taxonomies.query,
          associations.taxonomies && onTagClick)
        : [],
      connectedCounts: associations && associations.connections ? this.getConnectedCounts(entity, associations.connections.options) : [],
      expandables: isExpandable && !expandNo
        ? expandableColumns.map((column, i) => ({
          type: column.type,
          icon: column.icon,
          label: column.label,
          count: column.getCount && column.getCount(entity),
          info: column.getInfo && column.getInfo(entity),
          onClick: () => onExpand(expandNo > i ? i : i + 1),
        }))
        : null,
    };
  };


  render() {
    // console.log('EntityListItemWrapper.render')
    const {
      entity,
      isSelect,
      onEntitySelect,
      expandNo,
      isExpandable,
      expandableColumns,
      onExpand,
      entityIcon,
      entityIdsSelected,
    } = this.props;
    return (
      <ItemWrapper separated={expandNo}>
        <EntityListItem
          select={isSelect}
          checked={isSelect && entityIdsSelected.includes(entity.id)}
          onSelect={(checked) => onEntitySelect(entity.id, checked)}
          entity={this.mapToEntityListItem(entity, this.props)}
          expandNo={expandNo}
          entityIcon={entityIcon}
        />
        {isExpandable && expandNo > 0 && expandableColumns[0].type === 'reports' &&
          <EntityListNestedReportList
            reports={expandableColumns[0].getReports(entity)}
            entityLinkTo={expandableColumns[0].entityLinkTo}
            dates={expandableColumns[0].getDates(entity)}
          />
        }
        {isExpandable && expandNo > 0 && expandableColumns[0].type !== 'reports' &&
          <EntityListNestedList
            entities={expandableColumns[0].getEntities(entity)}
            entityLinkTo={expandableColumns[0].entityLinkTo}
            entityIcon={expandableColumns[0].icon}
            expandNo={expandNo - 1}
            isExpandable={expandableColumns.length > 1}
            expandableColumns={expandableColumns.length > 1 ? [expandableColumns[1]] : null}
            onExpand={onExpand}
          />
        }
      </ItemWrapper>
    );
  }
}

EntityListItemWrapper.propTypes = {
  entityIdsSelected: PropTypes.instanceOf(List),
  entity: PropTypes.object.isRequired,
  expandableColumns: PropTypes.array,
  taxonomies: PropTypes.object,
  associations: PropTypes.object,
  isSelect: PropTypes.bool,
  onEntitySelect: PropTypes.func,
  entityLinkTo: PropTypes.string,
  onTagClick: PropTypes.func,
  onExpand: PropTypes.func,
  expandNo: PropTypes.number,
  isExpandable: PropTypes.bool,
  entityIcon: PropTypes.string,
};

export default EntityListItemWrapper;
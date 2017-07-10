import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { palette } from 'styled-theme';
// import { isEqual } from 'lodash/lang';
import { forEach } from 'lodash/collection';
import { Map } from 'immutable';
import Component from 'components/styled/Component';
import Clear from 'components/styled/Clear';

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';

const Styled = styled(Component)`
  padding: 5px 10px;
`;

const EntityListItemMainTitleWrap = styled(Link)`
  text-decoration: none;
  display: block;
  padding: 3px 0 8px;
  color: ${palette('dark', 0)};
  &:hover {
    color: ${palette('dark', 2)};
  }
`;

export default class EntityListItemMain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    entity: PropTypes.instanceOf(Map).isRequired,
    taxonomies: PropTypes.instanceOf(Map),
    entityIcon: PropTypes.string,
    entityLinkTo: PropTypes.string,
    nested: PropTypes.bool,
    // isExpandable: PropTypes.bool,
    onTagClick: PropTypes.func,
    associations: PropTypes.object,
  }

  getConnectedCounts = (entity, connectionOptions) => {
    const counts = [];
    forEach(connectionOptions, (option) => {
      if (entity.get(option.path) && entity.get(option.path).size > 0) {
        counts.push({
          count: entity.get(option.path).size,
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
    if (entity.get('categories')) {
      taxonomies.forEach((tax) => {
        tax.get('categories').forEach((category, catId) => {
          if (entity.get('categories').includes(parseInt(catId, 10))) {
            const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
              ? category.getIn(['attributes', 'short_title'])
              : category.getIn(['attributes', 'title']));
            if (query && onClick) {
              tags.push({
                taxId: tax.get('id'),
                title: category.getIn(['attributes', 'title']),
                label: label.length > 10 ? `${label.substring(0, 10)}...` : label,
                onClick: () => onClick({
                  value: catId,
                  query,
                  checked: true,
                }),
              });
            } else {
              tags.push({
                taxId: tax.get('id'),
                title: category.getIn(['attributes', 'title']),
                label: label.length > 10 ? `${label.substring(0, 10)}...` : label,
              });
            }
          }
        });
      });
    }
    return tags;
  };
  mapToEntityListItem = () => {
    const {
      taxonomies,
      entityLinkTo,
      associations,
      onTagClick,
      entity,
    } = this.props;
    return {
      id: entity.get('id'),
      title: entity.getIn(['attributes', 'name']) || entity.getIn(['attributes', 'title']),
      reference: entity.getIn(['attributes', 'reference']) || entity.get('id'),
      linkTo: `${entityLinkTo}${entity.get('id')}`,
      status: entity.getIn(['attributes', 'draft']) ? 'draft' : null,
      // targetDate: entity.attributes.target_date ? this.context.intl.formatDate(new Date(entity.attributes.target_date)) : null,
      tags: taxonomies
        ? this.getEntityTags(entity,
          taxonomies,
          associations.taxonomies && associations.taxonomies.query,
          associations.taxonomies && onTagClick
        )
        : [],
      connectedCounts: associations && associations.connections ? this.getConnectedCounts(entity, associations.connections.options) : [],
    };
  };
  render() {
    const { entityIcon, nested } = this.props;

    // console.log('EntityListItemMain.render', this.props.entity.get('id'))
    const entity = this.mapToEntityListItem();
    return (
      <Styled>
        <EntityListItemMainTop entity={entity} entityIcon={entityIcon} />
        <Clear />
        <EntityListItemMainTitleWrap to={entity.linkTo}>
          <EntityListItemMainTitle nested={nested}>
            {entity.title}
          </EntityListItemMainTitle>
        </EntityListItemMainTitleWrap>
        <EntityListItemMainBottom entity={entity} />
      </Styled>
    );
  }
}

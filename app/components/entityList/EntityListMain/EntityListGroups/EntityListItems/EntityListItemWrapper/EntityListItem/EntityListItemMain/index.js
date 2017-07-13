import React from 'react';
import PropTypes from 'prop-types';
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

const EntityListItemMainTitleWrap = styled.a`
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
    config: PropTypes.object,
    entityIcon: PropTypes.string,
    nestLevel: PropTypes.number,
    onEntityClick: PropTypes.func,
    onTagClick: PropTypes.func,
  }

  getConnectedCounts = (entity, connectionOptions) => {
    const counts = [];
    forEach(connectionOptions, (option) => {
      if (!option.expandable && entity.get(option.path) && entity.get(option.path).size > 0) {
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
      config,
      onTagClick,
      entity,
      nestLevel,
    } = this.props;
    return {
      id: entity.get('id'),
      title: entity.getIn(['attributes', 'name']) || entity.getIn(['attributes', 'title']),
      reference: entity.getIn(['attributes', 'reference']) || entity.get('id'),
      status: entity.getIn(['attributes', 'draft']) ? 'draft' : null,
      path: nestLevel > 0 ? config.expandableColumns[nestLevel - 1].clientPath : config.clientPath,
      tags: taxonomies
        ? this.getEntityTags(entity,
          taxonomies,
          config.taxonomies && config.taxonomies.query,
          config.taxonomies && onTagClick
        )
        : [],
      connectedCounts: config && config.connections
        ? this.getConnectedCounts(entity, config.connections.options)
        : [],
    };
  };
  render() {
    const { entityIcon, nestLevel, onEntityClick } = this.props;

    // console.log('EntityListItemMain.render', this.props.entity.get('id'))
    const entity = this.mapToEntityListItem();
    return (
      <Styled>
        <EntityListItemMainTop entity={entity} entityIcon={entityIcon} />
        <Clear />
        <EntityListItemMainTitleWrap
          onClick={(evt) => {
            evt.preventDefault();
            onEntityClick(entity.id, entity.path);
          }}
          href={`/${entity.path}/${entity.id}`}
        >
          <EntityListItemMainTitle nested={nestLevel && nestLevel > 0}>
            {entity.title}
          </EntityListItemMainTitle>
        </EntityListItemMainTitleWrap>
        <EntityListItemMainBottom entity={entity} />
      </Styled>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
// import { isEqual } from 'lodash/lang';
import { reduce } from 'lodash/collection';
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
    connections: PropTypes.instanceOf(Map),
    config: PropTypes.object,
    entityIcon: PropTypes.string,
    entityPath: PropTypes.string,
    nestLevel: PropTypes.number,
    onEntityClick: PropTypes.func,
  }

  getConnections = (entity, connectionOptions, connections) =>
    reduce(connectionOptions, (memo, option) =>
      !option.expandable && entity.get(option.path) && entity.get(option.path).size > 0
        ? memo.concat([{
          option: {
            // label: option.label,
            icon: option.path,
            style: option.path,
          },
          entities: connections.get(option.path) &&
            entity.get(option.path).map((connectionId) => connections.getIn([option.path, connectionId.toString()])),
        }])
        : memo
      , []
    );

  getEntityTags = (entity, taxonomies, onClick) => {
    const tags = [];
    if (entity.get('categories')) {
      taxonomies.forEach((tax) => {
        tax.get('categories').forEach((category, catId) => {
          if (entity.get('categories').includes(parseInt(catId, 10))) {
            const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
              ? category.getIn(['attributes', 'short_title'])
              : category.getIn(['attributes', 'title']));
            if (onClick) {
              tags.push({
                taxId: tax.get('id'),
                title: category.getIn(['attributes', 'title']),
                label: label.length > 10 ? `${label.substring(0, 10)}...` : label,
                onClick: () => onClick(catId, 'category'),
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
      onEntityClick,
      entity,
      nestLevel,
      entityPath,
      connections,
    } = this.props;
    return {
      id: entity.get('id'),
      title: entity.getIn(['attributes', 'name']) || entity.getIn(['attributes', 'title']),
      reference: entity.getIn(['attributes', 'reference']) || entity.get('id'),
      status: entity.getIn(['attributes', 'draft']) ? 'draft' : null,
      path: entityPath || (nestLevel > 0 ? config.expandableColumns[nestLevel - 1].clientPath : config.clientPath),
      tags: taxonomies
        ? this.getEntityTags(entity,
          taxonomies,
          onEntityClick
        )
        : [],
      connectedCounts: config && config.connections
        ? this.getConnections(entity, config.connections.options, connections)
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

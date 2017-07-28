import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
// import { isEqual } from 'lodash/lang';
import { reduce } from 'lodash/collection';
import { Map } from 'immutable';
import { truncateText } from 'utils/string';
import Component from 'components/styled/Component';
import Clear from 'components/styled/Clear';
import appMessages from 'containers/App/messages';

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

class EntityListItemMain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getConnections = (entity, connectionOptions, connections) =>
    reduce(connectionOptions, (memo, option) => {
      // console.log(memo, option, entity.toJS())
      if (!option.expandable && entity.get(option.path) && connections.get(option.path) && entity.get(option.path).size > 0) {
        const entities = entity.get(option.path).map((connectionId) => connections.getIn([option.path, connectionId.toString()]));
        return memo.concat([{
          option: {
            label: this.context.intl && this.context.intl.formatMessage(
              entities.size === 1
              ? appMessages.entities[option.path].single
              : appMessages.entities[option.path].plural
            ),
            icon: option.path,
            style: option.path,
            path: option.clientPath || option.path,
          },
          entities,
        }]);
      }
      return memo;
    }, []);

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
                label: truncateText(label, 10),
                onClick: () => onClick(catId, 'category'),
              });
            } else {
              tags.push({
                taxId: tax.get('id'),
                title: category.getIn(['attributes', 'title']),
                label: truncateText(label, 10),
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

    const entity = this.mapToEntityListItem();

    return (
      <Styled>
        <EntityListItemMainTop
          entity={entity}
          entityIcon={entityIcon}
          onEntityClick={(evt) => {
            evt.preventDefault();
            onEntityClick(entity.id, entity.path);
          }}
          path={`/${entity.path}/${entity.id}`}
        />
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
        { (entity.tags || (entity.connectedCounts && this.props.wrapper)) &&
          <EntityListItemMainBottom
            tags={entity.tags}
            connections={entity.connectedCounts}
            wrapper={this.props.wrapper}
          />
        }
      </Styled>
    );
  }
}

EntityListItemMain.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  wrapper: PropTypes.object,
  config: PropTypes.object,
  entityIcon: PropTypes.string,
  entityPath: PropTypes.string,
  nestLevel: PropTypes.number,
  onEntityClick: PropTypes.func,
};
EntityListItemMain.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItemMain;

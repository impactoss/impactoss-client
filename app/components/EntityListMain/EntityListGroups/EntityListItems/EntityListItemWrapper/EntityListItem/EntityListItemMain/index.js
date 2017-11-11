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
  padding: ${(props) => props.isManager ? '10px 15px 10px 0px' : '10px 15px'};
`;

const EntityListItemMainTitleWrap = styled.a`
  text-decoration: none;
  display: block;
  padding: 3px 12px 3px 0;
  color: ${palette('dark', 0)};
  &:hover {
    color: ${palette('dark', 2)};
  }
`;

class EntityListItemMain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getConnections = (entity, connectionOptions, connections) =>
    reduce(connectionOptions, (memo, option) => {
      // console.log(memo, option, entity.toJS())
      if (!option.expandable && (option.popover !== false) && entity.get(option.path) && connections.get(option.path) && entity.get(option.path).size > 0) {
        const entities = entity.get(option.path).map((connectionId) => connections.getIn([option.path, connectionId.toString()]));
        return memo.concat([{
          option: {
            label: (size) => this.context.intl && this.context.intl.formatMessage(
              size === 1 ? appMessages.entities[option.path].single : appMessages.entities[option.path].plural
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
      taxonomies
      .sortBy((tax) => !tax.getIn(['attributes', 'is_smart']))
      .forEach((tax) => {
        tax
        .get('categories')
        .sortBy((category) => category.getIn(['attributes', 'draft']))
        .forEach((category, catId) => {
          if (entity.get('categories').includes(parseInt(catId, 10))) {
            const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
              ? category.getIn(['attributes', 'short_title'])
              : category.getIn(['attributes', 'title']));
            if (onClick) {
              tags.push({
                taxId: tax.get('id'),
                title: category.getIn(['attributes', 'title']),
                inverse: category.getIn(['attributes', 'draft']),
                label: truncateText(label, 10),
                onClick: () => onClick(catId, 'category'),
              });
            } else {
              tags.push({
                taxId: tax.get('id'),
                title: category.getIn(['attributes', 'title']),
                inverse: category.getIn(['attributes', 'draft']),
                label: truncateText(label, 10),
              });
            }
          }
        });
      });
    }
    return tags;
  };

  getRole = (entityRoles, roles) => {
    const role = roles.find((r) => parseInt(r.get('id'), 10) === entityRoles.first());
    // console.log('roles entityRoles.first()', entityRoles.first())
    // console.log('roles role', role)
    return role ? role.getIn(['attributes', 'friendly_name']) : '';
  }

  mapToEntityListItem = ({
    taxonomies,
    config,
    onEntityClick,
    entity,
    nestLevel,
    entityPath,
    connections,
    entityIcon,
  }) => ({
    id: entity.get('id'),
    title: entity.getIn(['attributes', 'name']) || entity.getIn(['attributes', 'title']),
    reference: entity.getIn(['attributes', 'reference']) || entity.get('id'),
    draft: entity.getIn(['attributes', 'draft']),
    role: entity.get('roles') && connections.get('roles') && this.getRole(entity.get('roles'), connections.get('roles')),
    path: entityPath || (nestLevel > 0 ? config.expandableColumns[nestLevel - 1].clientPath : config.clientPath),
    entityIcon: entityIcon && entityIcon(entity),
    tags: taxonomies
      ? this.getEntityTags(entity,
        taxonomies,
        onEntityClick
      )
      : [],
    connectedCounts: config && config.connections
      ? this.getConnections(entity, config.connections.options, connections)
      : [],
    assignedUser: entity.get('manager') && ({ name: entity.getIn(['manager', 'attributes', 'name']) }),
  });

  render() {
    const { nestLevel, onEntityClick } = this.props;

    const entity = this.mapToEntityListItem(this.props);

    return (
      <Styled isManager={this.props.isManager}>
        <EntityListItemMainTop
          entity={entity}
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
            assignedUser={entity.assignedUser}
          />
        }
      </Styled>
    );
  }
}

EntityListItemMain.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired, // eslint-disable-line react/no-unused-prop-types
  taxonomies: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  connections: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  config: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  entityIcon: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  entityPath: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  isManager: PropTypes.bool,
  wrapper: PropTypes.object,
  nestLevel: PropTypes.number,
  onEntityClick: PropTypes.func,
};
EntityListItemMain.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItemMain;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
// import { isEqual } from 'lodash/lang';
import { reduce } from 'lodash/collection';
import { Map } from 'immutable';
import Component from 'components/styled/Component';
import Clear from 'components/styled/Clear';
import { USER_ROLES } from 'themes/config';
import appMessages from 'containers/App/messages';

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';


const Styled = styled(Component)`
  padding-right: ${(props) => (!props.theme.sizes || props.isConnection)
    ? 0
    : props.theme.sizes.mainListItem.paddingHorizontal
  }px;
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  padding-left: ${(props) => (!props.theme.sizes || props.isManager || props.isConnection)
    ? 0
    : props.theme.sizes.mainListItem.paddingHorizontal
  }px;
  line-height: ${(props) => props.theme.sizes && props.theme.sizes.lineHeights.mainListItem};
`;

const EntityListItemMainTitleWrap = styled.a`
  text-decoration: none;
  display: block;
  padding: 0px 12px 6px 0;
  color: ${palette('mainListItem', 0)};
  &:hover {
    color: ${palette('mainListItemHover', 0)};
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

  getRole = (entityRoles, roles) => {
    const role = roles.find((r) => parseInt(r.get('id'), 10) === entityRoles.first());
    // console.log('roles entityRoles.first()', entityRoles.first())
    // console.log('roles role', role)
    return role ? parseInt(role.get('id'), 10) : USER_ROLES.DEFAULT.value;
  }

  mapToEntityListItem = ({
    config,
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
    categories: entity.get('categories'),
    connectedCounts: config && config.connections
      ? this.getConnections(entity, config.connections.options, connections)
      : [],
    assignedUser: entity.get('manager') && ({ name: entity.getIn(['manager', 'attributes', 'name']) }),
  });

  render() {
    const { nestLevel, onEntityClick, taxonomies } = this.props;

    const entity = this.mapToEntityListItem(this.props);

    return (
      <Styled isManager={this.props.isManager} isConnection={this.props.isConnection}>
        <EntityListItemMainTop
          entity={entity}
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
        { (entity.categories || (entity.connectedCounts && this.props.wrapper)) &&
          <EntityListItemMainBottom
            categories={entity.categories}
            taxonomies={taxonomies}
            onEntityClick={onEntityClick}
            connections={entity.connectedCounts}
            wrapper={this.props.wrapper}
            user={entity.assignedUser}
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
  isConnection: PropTypes.bool,
};
EntityListItemMain.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItemMain;

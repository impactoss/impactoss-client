import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
// import { isEqual } from 'lodash/lang';
import { reduce } from 'lodash/collection';
import { Map } from 'immutable';
import { attributesEqual } from 'utils/entities';
import Component from 'components/styled/Component';
import Clear from 'components/styled/Clear';
import { USER_ROLES, PROGRESS_TAXONOMY_ID } from 'themes/config';
import appMessages from 'containers/App/messages';

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';


const Styled = styled(Component)`
  padding-right: ${(props) => props.isConnection ? 0 : 4}px;
  padding-top: 2px;
  padding-bottom: 4px;
  padding-left: ${(props) => (props.isManager || props.isConnection) ? 0 : 4}px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
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
  }
`;

const EntityListItemMainTitleWrap = styled.a`
  text-decoration: none;
  display: block;
  padding: 6px 15px 6px 0;
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

  getReference = (entity) => {
    const reference = entity.getIn(['attributes', 'reference']) || entity.get('id');
    if (this.context.intl
      && appMessages.entities[entity.get('type')]
      && appMessages.entities[entity.get('type')].singleShort
    ) {
      return `${this.context.intl.formatMessage(appMessages.entities[entity.get('type')].singleShort)} ${reference}`;
    }
    return reference;
  }

  getProgressTaxonomy = (taxonomies) =>
    taxonomies && taxonomies.find((tax) => attributesEqual(tax.get('id'), PROGRESS_TAXONOMY_ID));

  getProgressCategory = (taxonomies, categoryIds) => {
    const progressTaxonomy = taxonomies && this.getProgressTaxonomy(taxonomies);
    const progressCategory = progressTaxonomy && progressTaxonomy.get('categories').find((cat) => categoryIds.includes(parseInt(cat.get('id'), 10)));
    return progressCategory && progressCategory.toJS();
  }

  getWithoutProgressCategories = (taxonomies, categoryIds) => {
    const progressTaxonomy = taxonomies && this.getProgressTaxonomy(taxonomies);
    return progressTaxonomy
      ? categoryIds.filter((cat) => {
        const progressCategoryIds = progressTaxonomy.get('categories').map((pCat) => parseInt(pCat.get('id'), 10));
        return !progressCategoryIds || !progressCategoryIds.includes(parseInt(cat, 10));
      })
      : categoryIds;
  }

  mapToEntityListItem = ({
    config,
    entity,
    nestLevel,
    entityPath,
    connections,
    entityIcon,
    taxonomies,
  }) => ({
    id: entity.get('id'),
    title: entity.getIn(['attributes', 'name']) || entity.getIn(['attributes', 'title']),
    reference: this.getReference(entity, config),
    draft: entity.getIn(['attributes', 'draft']),
    role: entity.get('roles') && connections.get('roles') && this.getRole(entity.get('roles'), connections.get('roles')),
    path: entityPath || (nestLevel > 0 ? config.expandableColumns[nestLevel - 1].clientPath : config.clientPath),
    entityIcon: entityIcon && entityIcon(entity),
    categories: taxonomies && this.getWithoutProgressCategories(taxonomies, entity.get('categories')),
    connectedCounts: config && config.connections
      ? this.getConnections(entity, config.connections.options, connections)
      : [],
    assignedUser: entity.get('manager') && ({ name: entity.getIn(['manager', 'attributes', 'name']) }),
    targetDate: entity.getIn(['attributes', 'target_date'])
      && this.context.intl
      && this.context.intl.formatDate(entity.getIn(['attributes', 'target_date'])),
    progressCategory: taxonomies && this.getProgressCategory(taxonomies, entity.get('categories')),
  });

  render() {
    const { nestLevel, onEntityClick, taxonomies } = this.props;
    const entity = this.mapToEntityListItem(this.props);

    const bottomTaxonomies = taxonomies && taxonomies.filter((tax) => !attributesEqual(tax.get('id'), PROGRESS_TAXONOMY_ID));

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
            taxonomies={bottomTaxonomies}
            onEntityClick={onEntityClick}
            connections={entity.connectedCounts}
            wrapper={this.props.wrapper}
            user={entity.assignedUser}
            targetDate={entity.targetDate}
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

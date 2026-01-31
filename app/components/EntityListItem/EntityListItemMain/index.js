import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { injectIntl, intlShape } from 'react-intl';
// import { isEqual } from 'lodash/lang';
import { reduce } from 'lodash/collection';
import { Map } from 'immutable';
import { qe } from 'utils/quasi-equals';

import Component from 'components/styled/Component';
import SkipContent from 'components/styled/SkipContent';
import { USER_ROLES, PROGRESS_TAXONOMY_ID, SUPPORT_LEVELS } from 'themes/config';
import appMessages from 'containers/App/messages';

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';

const Styled = styled((p) => <Component {...p} />)`
  position: relative;
  padding-left: 0;
  box-shadow: ${({ isConnection }) => isConnection ? '0px 0px 6px 0px rgba(0,0,0,0.2)' : 'none'};
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-left: ${(props) => (!props.theme.sizes || props.isManager)
    ? 0
    : props.theme.sizes.mainListItem.paddingHorizontal
}px;
  }
  @media print {
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
  }
`;
const Wrapper = styled((p) => <Component {...p} />)`
  position: relative;
  padding-right: 6px;
  padding-top: 4px;
  padding-bottom: 6px;
  box-shadow: ${({ isConnection }) => isConnection ? '0px 0px 6px 0px rgba(0,0,0,0.2)' : 'none'};
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-right: ${(props) => (!props.theme.sizes)
    ? 0
    : props.theme.sizes.mainListItem.paddingHorizontal
}px;
    padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
    padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  }
  @media print {
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
  }
`;

const EntityListItemMainTitleWrap = styled.a`
  text-decoration: none;
  display: block;
  padding: 6px 15px 8px 0;
  margin-top: 15px;
  color: ${palette('mainListItem', 0)};
  &:hover, &:focus-visible {
    color: ${palette('mainListItemHover', 0)};
  }
  &:focus-visible {
    outline: none;
    text-decoration: underline;
  }
  @media print {
    padding: 1px 15px 5px 0;
  }
`;

const EntityListItemMainTopWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 4px;
  padding-right: 6px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
    padding-right: ${(props) => (!props.theme.sizes)
    ? 0
    : props.theme.sizes.mainListItem.paddingHorizontal
}px;
  }
`;

const EntityListItemMainSubtitle = styled.div`
  font-weight: normal;
  opacity: 0.7;
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.nestedListItem};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.nestedListItem};
  }
`;

class EntityListItemMain extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    if (this.props.isFocus) this.title.focus();
  }

  getConnections = (entity, connectionOptions, connections, intl) =>
    reduce(connectionOptions, (memo, option) => {
      // console.log(memo, option, entity.toJS())
      let memoX = memo;
      if (
        !option.expandable
        && (option.popover !== false)
        && entity.get(option.path)
        && connections.get(option.path)
        && entity.get(option.path).size > 0
      ) {
        if (option.groupByFramework) {
          const entitiesByFramework = entity.get(`${option.path}ByFw`);
          // console.log(entity, entity.toJS())
          if (entitiesByFramework) {
            entitiesByFramework.forEach((fwentities, fwid) => {
              if (fwentities.size > 0) {
                const connectedEntities = fwentities.map(
                  (connectionId) => connections.getIn([option.path, connectionId.toString()])
                );
                const path = `${option.path}_${fwid}`;
                memoX = memoX.concat([{
                  option: {
                    label: (size) => intl
                      && intl.formatMessage(
                        size === 1
                          ? appMessages.entities[path].single
                          : appMessages.entities[path].plural
                      ),
                    style: option.path,
                    path: option.clientPath || option.path,
                  },
                  entities: connectedEntities,
                }]);
              }
            });
          }
        } else {
          const connectedEntities = entity
            .get(option.path)
            .map(
              (connectionId) => connections.getIn([option.path, connectionId.toString()])
            );
          memoX = memoX.concat([{
            option: {
              label: (size) => intl && intl.formatMessage(
                size === 1 ? appMessages.entities[option.path].single : appMessages.entities[option.path].plural
              ),
              style: option.path,
              path: option.clientPath || option.path,
            },
            entities: connectedEntities,
          }]);
        }
      }
      return memoX;
    }, []);

  getRole = (entityRoles, roles) => {
    const role = roles.find((r) => parseInt(r.get('id'), 10) === entityRoles.first());
    // console.log('roles entityRoles.first()', entityRoles.first())
    // console.log('roles role', role)
    return role ? parseInt(role.get('id'), 10) : USER_ROLES.DEFAULT.value;
  };

  getReference = (entity, intl) => {
    const reference = entity.getIn(['attributes', 'reference']) || entity.get('id');
    let type = entity.get('type');
    if (entity.getIn(['attributes', 'framework_id'])) {
      type = `${type}_${entity.getIn(['attributes', 'framework_id'])}`;
    }
    if (intl
      && appMessages.entities[type]
      && appMessages.entities[type].singleShort
    ) {
      return `${intl.formatMessage(appMessages.entities[type].singleShort)}: ${reference}`;
    }
    return reference;
  };

  getProgressTaxonomy = (taxonomies) => taxonomies && taxonomies.find((tax) => qe(tax.get('id'), PROGRESS_TAXONOMY_ID));

  getProgressCategory = (taxonomies, categoryIds) => {
    const progressTaxonomy = taxonomies && this.getProgressTaxonomy(taxonomies);
    const progressCategory = progressTaxonomy
      && categoryIds
      && progressTaxonomy.get('categories').find(
        (cat) => categoryIds.includes(parseInt(cat.get('id'), 10))
      );
    return progressCategory && progressCategory.toJS();
  };

  getWithoutProgressCategories = (taxonomies, categoryIds) => {
    const progressTaxonomy = taxonomies && this.getProgressTaxonomy(taxonomies);
    return (progressTaxonomy && categoryIds)
      ? categoryIds.filter(
        (cat) => {
          const progressCategoryIds = progressTaxonomy.get('categories').map(
            (pCat) => parseInt(pCat.get('id'), 10)
          );
          return !progressCategoryIds || !progressCategoryIds.includes(parseInt(cat, 10));
        }
      )
      : categoryIds;
  };

  mapToEntityListItem = ({
    config,
    entity,
    nestLevel,
    entityPath,
    connections,
    taxonomies,
    intl,
  }) => {
    let path = '';
    if (entityPath) {
      path = entityPath;
    } else if (config && (config.expandableColumns || config.clientPath)) {
      path = nestLevel > 0 ? config.expandableColumns[nestLevel - 1].clientPath : config.clientPath;
    }
    let supportLevel;
    if (
      typeof entity.getIn(['attributes', 'support_level']) !== 'undefined'
      && entity.getIn(['attributes', 'support_level']) !== 'null'
    ) {
      supportLevel = SUPPORT_LEVELS.find(
        (level) => qe(level.value, entity.getIn(['attributes', 'support_level'])),
      );
    }
    return ({
      id: entity.get('id'),
      title: entity.getIn(['attributes', 'name']) || entity.getIn(['attributes', 'title']),
      subtitle: config && config.sublabel && entity.getIn(['attributes', config.sublabel]),
      reference: this.getReference(entity, intl),
      draft: entity.getIn(['attributes', 'draft']),
      is_archive: entity.getIn(['attributes', 'is_archive']),
      is_current: entity.getIn(['attributes', 'is_current']),
      role: entity.get('roles') && connections.get('roles') && this.getRole(entity.get('roles'), connections.get('roles')),
      path,
      support: supportLevel,
      categories: taxonomies && this.getWithoutProgressCategories(taxonomies, entity.get('categories')),
      connectedCounts: config && config.connections
        ? this.getConnections(entity, config.connections.options, connections, intl)
        : [],
      assignedUser: entity.get('manager') && ({ name: entity.getIn(['manager', 'attributes', 'name']) }),
      targetDate: entity.getIn(['attributes', 'target_date'])
        && intl
        && intl.formatDate(entity.getIn(['attributes', 'target_date'])),
      progressCategory: taxonomies && this.getProgressCategory(taxonomies, entity.get('categories')),
    });
  };

  render() {
    const {
      nestLevel,
      onEntityClick,
      taxonomies,
      skipTargetId,
    } = this.props;

    const entity = this.mapToEntityListItem(this.props);

    const bottomTaxonomies = taxonomies && taxonomies.filter((tax) => !qe(tax.get('id'), PROGRESS_TAXONOMY_ID));
    return (
      <Styled isManager={this.props.isManager} isConnection={this.props.isConnection}>
        <Wrapper>
          <EntityListItemMainTitleWrap
            id={`list-item-${entity.id}`}
            ref={(el) => { this.title = el; }}
            onClick={(evt) => {
              evt.preventDefault();
              onEntityClick(entity.id, entity.path);
            }}
            href={`/${entity.path}/${entity.id}`}
          >
            <EntityListItemMainTitle nested={nestLevel && nestLevel > 0}>
              {entity.title}
            </EntityListItemMainTitle>
            {entity.subtitle && (
              <EntityListItemMainSubtitle>
                {entity.subtitle}
              </EntityListItemMainSubtitle>
            )}
          </EntityListItemMainTitleWrap>
          {skipTargetId && (
            <SkipContent
              href={skipTargetId}
              title="Skip to next list item or group, continue to list item details"
            >
              Skip to next list item or group, continue to list item details
            </SkipContent>
          )}
          <EntityListItemMainTopWrap>
            <EntityListItemMainTop entity={entity} />
          </EntityListItemMainTopWrap>
          { (entity.categories || (entity.connectedCounts && this.props.wrapper))
            && (
              <EntityListItemMainBottom
                connections={entity.connectedCounts}
                wrapper={this.props.wrapper}
                categories={entity.categories}
                taxonomies={bottomTaxonomies}
                onEntityClick={onEntityClick}
              />
            )
          }
        </Wrapper>
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
  wrapper: PropTypes.object,
  nestLevel: PropTypes.number,
  onEntityClick: PropTypes.func,
  isConnection: PropTypes.bool,
  isManager: PropTypes.bool,
  isFocus: PropTypes.bool,
  skipTargetId: PropTypes.string,
  intl: intlShape.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(EntityListItemMain);

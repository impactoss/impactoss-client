/*
 *
 * EntityListMain
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';

import { jumpToComponent } from 'utils/scroll-to-component';
import { lowerCase } from 'utils/string';
import { qe } from 'utils/quasi-equals';

import ContainerWrapperSidebar from 'components/styled/Container/ContainerWrapperSidebar';
import Container from 'components/styled/Container';
import Content from 'components/styled/Content';
import SkipContent from 'components/styled/SkipContent';

import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import TagSearch from 'components/TagSearch';
import PrintOnly from 'components/styled/PrintOnly';
import Footer from 'containers/Footer';

import { CONTENT_LIST, PARAMS } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import EntityListGroups from './EntityListGroups';

import EntityListOptions from './EntityListOptions';
import { currentFilters, currentFilterArgs } from './current-filters';
import { getGroupOptions, getGroupValue } from './group-options';
import { groupEntities } from './group-entities';

import messages from './messages';

const EntityListSearch = styled.div`
  padding-bottom: 1em;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-bottom: 2em;
  }
`;

const ListEntities = styled.div`
  position: relative;
`;
const ListWrapper = styled.div``;
const PrintHintKey = styled(PrintOnly)`
  font-style: italic;
  font-size: ${(props) => props.theme.sizes.print.smaller};
  margin-bottom: 20px;
`;

const StyledContent = styled(Content)`
  margin-bottom: 10em;
`;

class EntityListMain extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.ScrollContainer = React.createRef();
    this.ScrollTarget = React.createRef();
    this.ScrollReference = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.listUpdating) {
      return false;
    }
    if (this.props.listUpdating && !nextProps.listUpdating) {
      return true;
    }
    return this.props.entities !== nextProps.entities
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.dataReady !== nextProps.dataReady
      || this.props.locationQuery !== nextProps.locationQuery
      || this.props.errors !== nextProps.errors;
  }

  scrollToTop = () => {
    jumpToComponent(
      this.ScrollTarget.current,
      this.ScrollReference.current,
      this.ScrollContainer.current
    );
  };

  render() {
    const {
      config,
      header,
      entityTitle,
      dataReady,
      isManager,
      isContributor,
      onGroupSelect,
      onSubgroupSelect,
      onExpand,
      onSearch,
      onResetFilters,
      onTagClick,
      taxonomies,
      allTaxonomies,
      connections,
      connectedTaxonomies,
      locationQuery,
      entityIcon,
      entities,
      errors,
      frameworks,
      onDismissAllErrors,
      intl,
    } = this.props;
    const expandNo = config.expandableColumns && locationQuery.get('expand')
      ? parseInt(locationQuery.get('expand'), 10)
      : 0;

    let groupSelectValue = locationQuery.get('group');
    const groupforFramework = config.taxonomies
      && config.taxonomies.defaultGroupsByFramework
      && frameworks
      && frameworks.size === 1;
    if (config.taxonomies && !groupSelectValue) {
      if (groupforFramework) {
        /* eslint-disable prefer-destructuring */
        groupSelectValue = config.taxonomies.defaultGroupsByFramework[frameworks.first().get('id')][1];
        /* eslint-enable prefer-destructuring */
      } else {
        groupSelectValue = getGroupValue(
          taxonomies,
          config.taxonomies.defaultGroupAttribute,
          1,
        );
      }
    }

    let subgroupSelectValue;
    if (groupSelectValue && groupSelectValue !== PARAMS.GROUP_RESET) {
      subgroupSelectValue = locationQuery.get('subgroup');
      if (
        config.taxonomies
        && !subgroupSelectValue
        && groupforFramework
        && qe(
          groupSelectValue,
          config.taxonomies.defaultGroupsByFramework[frameworks.first().get('id')][1],
        )
      ) {
        /* eslint-disable prefer-destructuring */
        subgroupSelectValue = config.taxonomies.defaultGroupsByFramework[frameworks.first().get('id')][2];
        /* eslint-enable prefer-destructuring */
      }
    }

    const headerTitle = entities && dataReady
      ? `${entities.size} ${entities.size === 1 ? entityTitle.single : entityTitle.plural}`
      : entityTitle.plural;

    // group all entities, regardless of page items
    const entityGroups = groupSelectValue
      && taxonomies
      && taxonomies.get(groupSelectValue)
      && groupSelectValue !== PARAMS.GROUP_RESET
      ? groupEntities(
        entities,
        taxonomies,
        connectedTaxonomies,
        config,
        groupSelectValue,
        subgroupSelectValue !== PARAMS.GROUP_RESET && subgroupSelectValue,
        intl || null,
        frameworks,
      )
      : null;

    let subtitle = null;
    if (dataReady && entityGroups && groupSelectValue && intl) {
      const isPlural = entityGroups.size !== 1;
      // disable broken support for connectedTaxonomies
      // let taxId = groupSelectValue;
      // if (taxId.indexOf('x:') > -1 && taxId.split(':').length > 1) {
      //   taxId = taxId.split(':')[1];
      // }
      subtitle = intl.formatMessage(messages.groupSubtitle, {
        size: entityGroups.size,
        type:
          lowerCase(
            intl.formatMessage(
              isPlural
                ? appMessages.entities.taxonomies[groupSelectValue].plural
                : appMessages.entities.taxonomies[groupSelectValue].single
            )
          ),
      });
    }
    let headerActions = [];
    if (dataReady) {
      if (header.actions) {
        headerActions = [
          ...headerActions,
          ...header.actions,
        ];
      }
      if (header.actionsAdmin) {
        headerActions = [
          ...headerActions,
          ...header.actionsAdmin,
        ];
      }
    }
    return (
      <ContainerWrapperSidebar ref={this.ScrollContainer}>
        <Container ref={this.ScrollReference} noPaddingBottom>
          <StyledContent>
            <ContentHeader
              type={CONTENT_LIST}
              icon={header.icon}
              supTitle={header.supTitle}
              title={headerTitle}
              subTitle={subtitle}
              sortAttributes={config.sorting}
              buttons={headerActions}
            />
            {!dataReady && <Loading />}
            {dataReady && (
              <ListEntities>
                <PrintHintKey>
                  <FormattedMessage {...messages.printHintKey} />
                </PrintHintKey>
                <EntityListSearch>
                  <TagSearch
                    filters={currentFilters(
                      {
                        config,
                        entities,
                        taxonomies: allTaxonomies,
                        connections,
                        locationQuery,
                        onTagClick,
                        errors,
                        frameworks,
                      },
                      intl.formatMessage(messages.filterFormWithoutPrefix),
                      intl.formatMessage(messages.filterFormError),
                    )}
                    searchAttributes={config.search}
                    searchQuery={locationQuery.get('search') || ''}
                    onSearch={onSearch}
                    onClear={() => {
                      onResetFilters(currentFilterArgs(config, locationQuery));
                      onDismissAllErrors();
                    }}
                  />
                  <SkipContent
                    href="#filter-options"
                    title={intl.formatMessage(appMessages.screenreader[
                      isManager ? 'skipToListFilterEdit' : 'skipToListFilter'])}
                  >
                    <FormattedMessage
                      {...appMessages.screenreader[
                        isManager ? 'skipToListFilterEdit' : 'skipToListFilter'
                      ]}
                    />
                  </SkipContent>
                </EntityListSearch>
                <EntityListOptions
                  groupOptions={getGroupOptions(taxonomies, intl)}
                  subgroupOptions={getGroupOptions(taxonomies, intl)}
                  groupSelectValue={(taxonomies && taxonomies.get(groupSelectValue)) ? groupSelectValue : ''}
                  subgroupSelectValue={(taxonomies && taxonomies.get(subgroupSelectValue)) ? subgroupSelectValue : ''}
                  onGroupSelect={onGroupSelect}
                  onSubgroupSelect={onSubgroupSelect}
                  onExpand={() => onExpand(expandNo < config.expandableColumns.length ? config.expandableColumns.length : 0)}
                  expanded={config.expandableColumns && expandNo === config.expandableColumns.length}
                  expandable={config.expandableColumns && config.expandableColumns.length > 0}
                />
                <ListWrapper ref={this.ScrollTarget}>
                  <EntityListGroups
                    entities={entities}
                    taxonomies={taxonomies}
                    errors={errors}
                    onDismissError={this.props.onDismissError}
                    entityGroups={entityGroups}
                    groupTaxonomyTitle={groupSelectValue
                      && taxonomies
                      && taxonomies.get(groupSelectValue)
                      && taxonomies.get(groupSelectValue).getIn(['attributes', 'title'])
                    }
                    subgroupTaxonomyTitle={subgroupSelectValue
                      && taxonomies
                      && taxonomies.get(subgroupSelectValue)
                      && taxonomies.get(subgroupSelectValue).getIn(['attributes', 'title'])
                    }
                    connections={connections}
                    entityIdsSelected={this.props.entityIdsSelected}
                    locationQuery={this.props.locationQuery}
                    groupSelectValue={(taxonomies && taxonomies.get(groupSelectValue)) ? groupSelectValue : ''}
                    subgroupSelectValue={(taxonomies && taxonomies.get(subgroupSelectValue)) ? subgroupSelectValue : ''}
                    onEntityClick={this.props.onEntityClick}
                    entityTitle={entityTitle}
                    config={config}
                    entityIcon={entityIcon}
                    isManager={isManager}
                    isContributor={isContributor}
                    onExpand={onExpand}
                    expandNo={expandNo}
                    onPageItemsSelect={(no) => {
                      this.scrollToTop();
                      this.props.onPageItemsSelect(no);
                    }}
                    onPageSelect={(page) => {
                      this.scrollToTop();
                      this.props.onPageSelect(page);
                    }}
                    onEntitySelect={this.props.onEntitySelect}
                    onEntitySelectAll={this.props.onEntitySelectAll}
                    onSortBy={this.props.onSortBy}
                    onSortOrder={this.props.onSortOrder}
                  />
                </ListWrapper>
              </ListEntities>
            )}
          </StyledContent>
        </Container>
        <Footer hasBorder />
      </ContainerWrapperSidebar>
    );
  }
}

EntityListMain.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  allTaxonomies: PropTypes.instanceOf(Map),
  frameworks: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  // object/arrays
  config: PropTypes.object,
  header: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  // primitive
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  isContributor: PropTypes.bool,
  entityIcon: PropTypes.func,
  // functions
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  onSubgroupSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onDismissAllErrors: PropTypes.func.isRequired,
  listUpdating: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EntityListMain);
// export default EntityListMain;

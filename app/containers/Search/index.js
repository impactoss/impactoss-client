/*
 *
 * Search
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Map, fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';

import { startsWith } from 'utils/string';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';

import Button from 'components/buttons/Button';
import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import EntityListSidebarLoading from 'components/EntityListSidebarLoading';
import TagSearch from 'components/TagSearch';
import Scrollable from 'components/styled/Scrollable';
import Sidebar from 'components/styled/Sidebar';
import SidebarHeader from 'components/styled/SidebarHeader';
import SupTitle from 'components/SupTitle';
import Component from 'components/styled/Component';


// import EntityListItem from 'components/EntityListItem';
import EntityListHeader from 'components/EntityListMain/EntityListGroups/EntityListHeader';
import EntityListItemWrapper from 'components/EntityListMain/EntityListGroups/EntityListItems/EntityListItemWrapper';


import appMessages from 'containers/App/messages';
// import { PATHS } from 'containers/App/constants';


import { DEPENDENCIES } from './constants';
import { selectEntitiesByQuery } from './selectors';
import {
  updateQuery,
  resetSearchQuery,
  updateSortBy,
  updateSortOrder,
} from './actions';
// import { selectConnections, selectMeasures, selectConnectedTaxonomies } from './selectors';

import messages from './messages';

const Content = styled.div`
  padding: 0 4em;
`;
const EntityListSearch = styled.div`
  padding: 0 0 2em;
`;

const Group = styled.div`
  border-bottom: 1px solid;
  border-color: ${(props) => props.expanded ? palette('aside', 0) : palette('light', 2)};
  &:last-child {
    border-bottom: 0;
  }
`;

const GroupLabel = styled.div`
  text-align: left;
  color: ${palette('asideListGroup', 0)};
  background-color: ${palette('asideListGroup', 1)};
  padding: 0.25em 1em 0.25em 1.5em;
  font-size: 0.9em;
  line-height: 1.64em;
`;


const ScrollableWrapper = styled(Scrollable)`
  background-color: ${palette('aside', 0)};
`;

// TODO compare EntityListSidebarOption
const Target = styled(Button)`
  display: table;
  width: 100%;
  padding: 0.4em 1em 0.4em 1.5em;
  width: 100%;
  text-align: left;
  color:  ${(props) => {
    if (props.disabled) {
      return props.active ? palette('asideListItem', 1) : palette('dark', 4);
    }
    return props.active ? palette('asideListItem', 1) : palette('asideListItem', 0);
  }};
  background-color: ${(props) => props.active ? palette('asideListItem', 3) : palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  &:hover {
    color: ${(props) => {
      if (props.disabled) {
        return props.active ? palette('asideListItem', 1) : palette('dark', 4);
      }
      return props.active ? palette('asideListItemHover', 1) : palette('asideListItemHover', 0);
    }};
    background-color: ${(props) => {
      if (props.disabled) {
        return props.active ? palette('asideListItem', 3) : palette('asideListItem', 2);
      }
      return props.active ? palette('asideListItemHover', 3) : palette('asideListItemHover', 2);
    }};
    border-bottom-color: ${palette('asideListItemHover', 4)}
  }
  &:last-child {
    border-bottom: 0;
  }
  font-size: 0.85em;
  font-weight: ${(props) => props.active ? 'bold' : 'normal'};
`;

const TargetTitle = styled.div`
  vertical-align: middle;
  display: table-cell;
  width: 99%;
`;
// font-size: ${(props) => props.theme.sizes.text.aaLargeBold};
const TargetCount = styled.div`
  padding-left: 5px;
  padding-right: 5px;
  width: 32px;
  display: table-cell;
  vertical-align: middle;
`;

const Count = styled.div`
  color:  ${(props) => (props.active || props.disabled) ? 'inherit' : palette('dark', 3)};
  background-color: ${(props) => {
    if (props.active) return 'inherit';
    return props.disabled ? 'transparent' : palette('light', 0);
  }};
  border-radius: 999px;
  padding: 3px;
  font-size: 0.85em;
  text-align: center;
  min-width: 32px;
`;

const ListEntitiesEmpty = styled.div`
  color:  ${palette('dark', 3)};
`;
const ListWrapper = styled.div``;
const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
export class Search extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getTargetTitle = (target) => {
    if (startsWith(target.get('path'), 'taxonomies')) {
      return appMessages.entities.taxonomies[target.get('taxId')];
    }
    return appMessages.entities[target.get('path')];
  }

  render() {
    const { dataReady, location, onSearch, onClear, entities, onTargetSelect, onEntityClick, onSortOrder, onSortBy } = this.props;
    // console.log('render')

    const activeTarget = entities.reduce((memo, group) =>
        group.get('targets').find((target) => target.get('active')) || memo
      , Map());

    const hasResults = location.query.search
      && activeTarget.get('results')
      && activeTarget.get('results').size > 0;

    const noResults = location.query.search
      && (!activeTarget.get('results') || activeTarget.get('results').size === 0);

    const noResultsNoAlternative = noResults
      && !entities.reduce((memo, group) =>
        group.get('targets').find((target) =>
          target.get('results') && target.get('results').size > 0
        ) || memo
      , false);

    const noEntry = !location.query.search;


    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !this.props.dataReady &&
          <EntityListSidebarLoading />
        }
        { this.props.dataReady &&
          <div>
            <Sidebar>
              <ScrollableWrapper>
                <Component>
                  <SidebarHeader>
                    <SupTitle title={this.context.intl.formatMessage(messages.sidebarTitle)} />
                  </SidebarHeader>
                  { entities && entities.map((group) => (
                    <Group key={group.get('group')}>
                      <GroupLabel>
                        <FormattedMessage {...messages.groups[group.get('group')]} />
                      </GroupLabel>
                      <div>
                        {
                          group.get('targets') && group.get('targets').map((target, i) => (
                            <Target
                              key={i}
                              onClick={(evt) => {
                                if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                                onTargetSelect(target.get('path'));
                              }}
                              active={target.get('active')}
                              disabled={target.get('results').size === 0}
                            >
                              <TargetTitle>
                                {this.getTargetTitle(target) && this.context.intl.formatMessage(this.getTargetTitle(target).pluralLong || this.getTargetTitle(target).plural)}
                              </TargetTitle>
                              <TargetCount>
                                <Count active={target.get('active')} disabled={target.get('results').size === 0}>
                                  {target.get('results').size}
                                </Count>
                              </TargetCount>
                            </Target>
                          ))
                        }
                      </div>
                    </Group>
                  ))}
                </Component>
              </ScrollableWrapper>
            </Sidebar>
          </div>
        }
        <ContainerWithSidebar>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                supTitle={this.context.intl.formatMessage(messages.pageTitle)}
                title={this.context.intl.formatMessage(messages.search)}
                icon="search"
              />
              { !dataReady &&
                <Loading />
              }
              { dataReady &&
                <div>
                  <EntityListSearch>
                    <TagSearch
                      filters={[]}
                      placeholder={this.context.intl.formatMessage(messages.placeholder)}
                      searchQuery={location.query.search || ''}
                      onSearch={onSearch}
                      onClear={() => onClear(['search'])}
                    />
                  </EntityListSearch>
                  <ListWrapper>
                    {
                      noEntry && (
                        <ListEntitiesEmpty>
                          <FormattedMessage {...messages.hints.noEntry} />
                        </ListEntitiesEmpty>
                      )
                    }
                    { hasResults &&
                      <div>
                        <EntityListHeader
                          entitiesTotal={activeTarget.get('results').size}
                          entityTitle={{
                            single: this.context.intl.formatMessage(this.getTargetTitle(activeTarget).singleLong || this.getTargetTitle(activeTarget).single),
                            plural: this.context.intl.formatMessage(this.getTargetTitle(activeTarget).pluralLong || this.getTargetTitle(activeTarget).plural),
                          }}
                          sortOptions={activeTarget.get('sorting') && activeTarget.get('sorting').toJS()}
                          sortBy={location.query.sort}
                          sortOrder={location.query.order}
                          onSortBy={onSortBy}
                          onSortOrder={onSortOrder}
                        />
                        <ListEntitiesMain>
                          { activeTarget.get('results').map((entity, key) =>
                            <EntityListItemWrapper
                              key={key}
                              entity={entity}
                              entityPath={activeTarget.get('clientPath') || activeTarget.get('path')}
                              onEntityClick={onEntityClick}
                            />
                          )}
                        </ListEntitiesMain>
                      </div>
                    }
                    {
                      noResultsNoAlternative && (
                        <ListEntitiesEmpty>
                          <FormattedMessage {...messages.hints.noResultsNoAlternative} />
                        </ListEntitiesEmpty>
                      )
                    }
                    {
                      noResults && !noResultsNoAlternative && (
                        <ListEntitiesEmpty>
                          <FormattedMessage {...messages.hints.noResults} />
                        </ListEntitiesEmpty>
                      )
                    }
                  </ListWrapper>
                </div>
              }
            </Content>
          </Container>
        </ContainerWithSidebar>
      </div>
    );
  }
}
// <EntityList
// entities={this.props.entities}
// taxonomies={this.props.taxonomies}
// connections={this.props.connections}
// connectedTaxonomies={this.props.connectedTaxonomies}
// config={CONFIG}
// header={headerOptions}
// dataReady={dataReady}
// entityTitle={{
//   single: this.context.intl.formatMessage(appMessages.entities.measures.single),
//   plural: this.context.intl.formatMessage(appMessages.entities.measures.plural),
// }}
// locationQuery={fromJS(this.props.location.query)}
// />

Search.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  dataReady: PropTypes.bool,
  entities: PropTypes.object, // List
  location: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onTargetSelect: PropTypes.func.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
};

Search.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectEntitiesByQuery(state, fromJS(props.location.query)),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onSearch: (value) => {
      // console.log('onSearch')
      dispatch(updateQuery(fromJS([
        {
          query: 'search',
          value,
          replace: true,
          checked: value !== '',
        },
      ])));
    },
    onClear: (values) => {
      dispatch(resetSearchQuery(values));
    },
    onTargetSelect: (value) => {
      // console.log('onTargetSelect')
      dispatch(updateQuery(fromJS([
        {
          query: 'path',
          value,
          replace: true,
          checked: value !== '',
        },
      ])));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    onSortOrder: (order) => {
      dispatch(updateSortOrder(order));
    },
    onSortBy: (sort) => {
      dispatch(updateSortBy(sort));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);

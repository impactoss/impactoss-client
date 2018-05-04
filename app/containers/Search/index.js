/*
 *
 * Search
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { Map, fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';

import { startsWith } from 'utils/string';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
} from 'containers/App/selectors';
import { CONTENT_LIST, VIEWPORTS } from 'containers/App/constants';

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
import SidebarGroupLabel from 'components/styled/SidebarGroupLabel';
import SupTitle from 'components/SupTitle';
import Component from 'components/styled/Component';
import Content from 'components/styled/Content';


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

const EntityListSearch = styled.div`
  padding: 0 0 2em;
`;

const Group = styled.div`
  border-bottom: ${(props) => props.hasBorder ? '1px solid' : 0};
  border-color: ${(props) => props.expanded ? palette('aside', 0) : palette('light', 2)};
  &:last-child {
    border-bottom: 0;
  }
`;

const ScrollableWrapper = styled(Scrollable)`
  background-color: ${palette('aside', 0)};
`;

// TODO compare EntityListSidebarOption
const Target = styled(Button)`
  display: table;
  width: 100%;
  padding: 0.3em 8px 0.3em 12px;
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
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0.4em 20px 0.4em 24px
  }
`;

const TargetTitle = styled.div`
  vertical-align: middle;
  display: table-cell;
  width: 99%;
`;
// font-size: ${(props) => props.theme.sizes.text.aaLargeBold};
const TargetCount = styled.div`
  padding-left: 5px;
  width: 32px;
  display: table-cell;
  vertical-align: middle;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-right: 5px;
  }
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

const ListHint = styled.div`
  color:  ${palette('dark', 3)};
  padding-bottom: 10px;
`;
const ListWrapper = styled.div``;
const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
const TargetsMobile = styled.div`
  padding-bottom: 20px;
`;

const STATE_INITIAL = {
  viewport: null,
};

export class Search extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = STATE_INITIAL;
  }
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getTargetTitle = (target) => {
    if (startsWith(target.get('path'), 'taxonomies')) {
      return appMessages.entities.taxonomies[target.get('taxId')];
    }
    return appMessages.entities[target.get('path')];
  }
  updateViewport() {
    let viewport = VIEWPORTS.MOBILE;
    if (window.innerWidth >= parseInt(this.props.theme.breakpoints.large, 10)) {
      viewport = VIEWPORTS.LARGE;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.medium, 10)) {
      viewport = VIEWPORTS.MEDIUM;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.small, 10)) {
      viewport = VIEWPORTS.SMALL;
    }
    this.setState({ viewport });
  }
  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.updateViewport();
    this.forceUpdate();
  };

  renderSearchTargets = (includeEmpty = true) => (
    <div>
      { this.props.entities && this.props.entities.map((group) => (
        <Group key={group.get('group')} hasBorder={includeEmpty}>
          { includeEmpty &&
            <SidebarGroupLabel>
              <FormattedMessage {...messages.groups[group.get('group')]} />
            </SidebarGroupLabel>
          }
          <div>
            {
              group.get('targets') && group.get('targets').entrySeq().map(([i, target]) =>
                (includeEmpty || target.get('results').size > 0 || target.get('active')) && (
                  <Target
                    key={i}
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      this.props.onTargetSelect(target.get('path'));
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
    </div>
  );

  render() {
    const { dataReady, location, onSearch, onClear, entities, onEntityClick, onSortOrder, onSortBy } = this.props;
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
        { !dataReady &&
          <EntityListSidebarLoading responsiveSmall />
        }
        { dataReady && this.state.viewport && this.state.viewport !== VIEWPORTS.MOBILE &&
          <div>
            <Sidebar responsiveSmall >
              <ScrollableWrapper>
                <Component>
                  <SidebarHeader responsiveSmall>
                    <SupTitle title={this.context.intl.formatMessage(messages.sidebarTitle)} />
                  </SidebarHeader>
                  {
                    this.renderSearchTargets(true)
                  }
                </Component>
              </ScrollableWrapper>
            </Sidebar>
          </div>
        }
        <ContainerWithSidebar sidebarResponsiveSmall>
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
                        <ListHint>
                          <FormattedMessage {...messages.hints.noEntry} />
                        </ListHint>
                      )
                    }
                    {
                      noResultsNoAlternative && (
                        <ListHint>
                          <FormattedMessage {...messages.hints.noResultsNoAlternative} />
                        </ListHint>
                      )
                    }
                    {
                      noResults && !noResultsNoAlternative && (
                        <ListHint>
                          <FormattedMessage {...messages.hints.noResults} />
                        </ListHint>
                      )
                    }
                    { !noEntry && this.state.viewport && this.state.viewport === VIEWPORTS.MOBILE &&
                      <TargetsMobile>
                        { !noResults &&
                          <ListHint>
                            <FormattedMessage {...messages.hints.targetMobile} />
                          </ListHint>
                        }
                        {
                          this.renderSearchTargets(false)
                        }
                      </TargetsMobile>
                    }
                    { hasResults &&
                      <div>
                        { this.state.viewport && this.state.viewport === VIEWPORTS.MOBILE &&
                          <ListHint>
                            <FormattedMessage {...messages.hints.resultsMobile} />
                          </ListHint>
                        }
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
  theme: PropTypes.object,
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

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Search));

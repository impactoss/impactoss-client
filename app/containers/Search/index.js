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
import { fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';

import { startsWith } from 'utils/string';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
} from 'containers/App/selectors';
import { CONTENT_LIST, VIEWPORTS } from 'containers/App/constants';

import Button from 'components/buttons/Button';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import TagSearch from 'components/TagSearch';
import SidebarGroupLabel from 'components/styled/SidebarGroupLabel';
import Content from 'components/styled/Content';
import { Box, Text } from 'grommet';

import { FormUp, FormDown } from 'grommet-icons';

import qe from 'utils/quasi-equals';

import EntityListItem from 'components/EntityListItem';

import appMessages from 'containers/App/messages';

import { DEPENDENCIES } from './constants';
import { selectEntitiesByQuery, selectPathQuery } from './selectors';
import {
  updateQuery,
  resetSearchQuery,
  updateSortBy,
  updateSortOrder,
} from './actions';

import messages from './messages';

const EntityListSearch = styled.div`
  padding: 0 0 2em;
`;

const Group = styled.div`
  border-bottom: ${({ hasBorder }) => hasBorder ? '1px solid' : 0};
  border-color: ${({ expanded }) => expanded ? palette('aside', 0) : palette('light', 2)};
  &:last-child {
    border-bottom: 0;
  }
`;

const Target = styled(Button)`
  display: table;
  width: 100%;
  font-size: 0.85em;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  padding: 0.3em 8px 0.3em 12px;
  text-align: left;
  color:  ${({ disabled, active }) => {
    if (disabled) {
      return active ? palette('asideListItem', 1) : palette('dark', 4);
    }
    return active ? palette('asideListItem', 1) : palette('asideListItem', 0);
  }};
  background-color: ${({ active }) => active ? palette('asideListItem', 3) : palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  &:hover {
    color: ${({ disabled, active }) => {
    if (disabled) {
      return active ? palette('asideListItem', 1) : palette('dark', 4);
    }
    return active ? palette('asideListItemHover', 1) : palette('asideListItemHover', 0);
  }};
    background-color: ${({ disabled, active }) => {
    if (disabled) {
      return active ? palette('asideListItem', 3) : palette('asideListItem', 2);
    }
    return active ? palette('asideListItemHover', 3) : palette('asideListItemHover', 2);
  }};
    border-bottom-color: ${palette('asideListItemHover', 4)}
  }
  &:last-child {
    border-bottom: 0;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 0.85em;
    padding: 0.3em 8px 0.3em 12px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    padding: 0.4em 20px 0.4em 24px
  }
  @media print {
    font-size: ${({ theme }) => theme.sizes.print.smaller};
  }
`;

const TargetTitle = styled.div`
  vertical-align: middle;
  display: table-cell;
  width: 99%;
`;
const TargetCount = styled.div`
  padding-left: 5px;
  width: 32px;
  display: table-cell;
  vertical-align: middle;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    padding-right: 5px;
  }
`;

const Count = styled.div`
  color:  ${({ active, disabled }) => (active || disabled) ? 'inherit' : palette('dark', 3)};
  background-color: ${({ active, disabled }) => {
    if (active) return 'inherit';
    return disabled ? 'transparent' : palette('light', 0);
  }};
  border-radius: 999px;
  padding: 3px;
  font-size: 0.85em;
  text-align: center;
  min-width: 32px;
  @media print {
    font-size: ${({ theme }) => theme.sizes.print.smaller};
  }
`;

const ListHint = styled.div`
  color:  ${palette('dark', 3)};
  padding-bottom: 10px;
`;
const ListWrapper = styled.div``;

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

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.resize);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
  };

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.updateViewport();
    this.forceUpdate();
  };

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
      {this.props.entities && this.props.entities.map((group) => (
        <Group key={group.get('group')} hasBorder={includeEmpty}>
          {includeEmpty
            && (
              <SidebarGroupLabel>
                <FormattedMessage {...messages.groups[group.get('group')]} />
              </SidebarGroupLabel>
            )
          }
          <div>
            {
              group.get('targets') && group.get('targets').entrySeq().map(([i, target]) => (includeEmpty || target.get('results').size > 0 || target.get('active')) && (
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
    const { intl } = this.context;
    const {
      dataReady,
      location,
      onSearch,
      onClear,
      entities,
      onEntityClick,
      activeTargetPath,
    } = this.props;
    const hasQuery = !!location.query.search;
    const countResults = dataReady && hasQuery && entities && entities.reduce(
      (memo, group) => group.get('targets').reduce(
        (memo2, target) => target.get('results')
          ? memo2 + target.get('results').size
          : memo2,
        memo,
      ),
      0
    );
    const countTargets = dataReady && hasQuery && entities && entities.reduce(
      (memo, group) => group.get('targets').reduce(
        (memo2, target) => {
          if (target.get('results') && target.get('results').size > 0) {
            return memo2 + 1;
          }
          return memo2;
        },
        memo,
      ),
      0,
    );
    const noEntry = !location.query.search;
    const hasResults = !noEntry && entities.reduce((memo, group) => group.get('targets').find((target) => target.get('results') && target.get('results').size > 0) || memo,
      false);
    const noResults = !hasResults;


    const headerButtons = [{
      type: 'icon',
      onClick: () => window.print(),
      title: 'Print',
      icon: 'print',
    }];

    return (
      <div>
        <Helmet
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <ContainerWrapper>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                supTitle={intl.formatMessage(messages.pageTitle)}
                title={intl.formatMessage(messages.search)}
                icon="search"
                buttons={headerButtons}
              />
              {!dataReady && <Loading />}
              {dataReady && (
                <div>
                  <EntityListSearch>
                    <TagSearch
                      filters={[]}
                      placeholder={intl.formatMessage(messages.placeholder)}
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
                      noResults && !noEntry
                      && (
                        <ListHint>
                          <FormattedMessage {...messages.hints.noResults} />
                        </ListHint>
                      )
                    }
                    {!noEntry && this.state.viewport && this.state.viewport === VIEWPORTS.MOBILE
                      && (
                        <TargetsMobile>
                          {!noResults
                            && (
                              <ListHint>
                                <FormattedMessage {...messages.hints.targetMobile} />
                              </ListHint>
                            )
                          }
                          {
                            this.renderSearchTargets(false)
                          }
                        </TargetsMobile>
                      )
                    }
                    {hasResults && (
                      <Box>
                        <ListHint>
                          <Text>
                            {`${countResults} ${countResults === 1 ? 'result' : 'results'} found in database. `}
                          </Text>
                          {countTargets > 1 && (
                            <Text>
                              <FormattedMessage {...messages.hints.hasCountTargets} />
                            </Text>
                          )}
                        </ListHint>
                        {entities.map(
                          (group, id) => {
                            const hasGroupResults = group.get('targets').some(
                              (target) => target.get('results') && target.get('results').size > 0
                            );
                            if (hasGroupResults) {
                              return (
                                <Box key={id} margin={{ bottom: 'large' }}>
                                  <Box margin={{ bottom: 'xsmall' }}>
                                    <Text size="small">
                                      <FormattedMessage {...messages.groups[group.get('group')]} />
                                    </Text>
                                  </Box>
                                  <Box>
                                    {group.get('targets') && group.get('targets').valueSeq().map(
                                      (target) => {
                                        const hasTargetResults = target.get('results') && target.get('results').size > 0;
                                        if (hasTargetResults) {
                                          const count = target.get('results').size;
                                          const title = this.getTargetTitle(target, count, intl);
                                          const active = qe(target.get('path'), activeTargetPath);
                                          const otherTargets = countTargets > 1;
                                          return (
                                            <Box key={target.get('path')}>
                                              <Box border="bottom" gap="xsmall">
                                                <Target
                                                  onClick={(evt) => {
                                                    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                                                    if (active) {
                                                      this.props.onTargetSelect('');
                                                    } else {
                                                      this.props.onTargetSelect(target.get('path'));
                                                    }
                                                  }}
                                                  active={active}
                                                >
                                                  <Box direction="row" gap="small" align="center" justify="between">
                                                    <Box direction="row" gap="xsmall" pad={{ vertical: 'small' }}>
                                                      <Text size="large">
                                                        {count}
                                                      </Text>
                                                      <Text size="large">
                                                        <FormattedMessage {...title.plural} />
                                                      </Text>
                                                    </Box>
                                                    {otherTargets && active && (
                                                      <FormUp size="large" />
                                                    )}
                                                    {otherTargets && !active && (
                                                      <FormDown size="large" />
                                                    )}
                                                  </Box>
                                                </Target>
                                              </Box>
                                              {
                                                (active || !otherTargets) && (
                                                  <Box margin={{ bottom: 'large' }}>
                                                    {target.get('results').toList().map((entity, key) => (
                                                      <EntityListItem
                                                        key={key}
                                                        entity={entity}
                                                        entityPath={target.get('clientPath') || target.get('path')}
                                                        onEntityClick={onEntityClick}
                                                      />
                                                    ))}
                                                  </Box>
                                                )
                                              }
                                            </Box>
                                          );
                                        }
                                        return null;
                                      }
                                    )}
                                  </Box>
                                </Box>
                              );
                            }
                            return null;
                          }
                        )}
                      </Box>
                    )}
                  </ListWrapper>
                </div>
              )}
            </Content>
          </Container>
        </ContainerWrapper>
      </div>
    );
  }
}

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
  activeTargetPath: PropTypes.string,
  theme: PropTypes.object,
};

Search.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectEntitiesByQuery(state, fromJS(props.location.query)),
  activeTargetPath: selectPathQuery(state, fromJS(props.location.query)),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onSearch: (value) => {
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

/*
 *
 * BookmarkList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { List, fromJS } from 'immutable';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import { loadEntitiesIfNeeded, openBookmark } from 'containers/App/actions';
import { selectReady, selectEntities } from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';
import appMessages from 'containers/App/messages';
import { Box, Text } from 'grommet';

import { FormUp, FormDown } from 'grommet-icons';

import qe from 'utils/quasi-equals';

import Button from 'components/buttons/Button';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import TagSearch from 'components/TagSearch';
import Content from 'components/styled/Content';
import EntityListItemWrapper from 'components/EntityListMain/EntityListGroups/EntityListItems/EntityListItemWrapper';


import {
  updateQuery,
  resetSearchQuery,
  updateSortBy,
  updateSortOrder,
} from './actions';

import { DEPENDENCIES } from './constants';
import { selectBookmarks, selectPathQuery } from './selectors';
import messages from './messages';

const EntityListSearch = styled.div`
  padding: 0 0 2em;
`;

// TODO compare EntityListSidebarOption
const Target = styled(Button)`
  display: table;
  width: 100%;
  font-size: 0.85em;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  padding: 0.3em 8px 0.3em 12px;
  text-align: left;
  color:  ${({ disabled }) => {
    if (disabled) {
      return palette('dark', 4);
    }
    return palette('asideListItem', 0);
  }};
  background-color: ${palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  &:hover {
    color: ${({ disabled }) => {
    if (disabled) {
      return palette('dark', 4);
    }
    return palette('asideListItemHover', 0);
  }};
    background-color: ${({ disabled }) => {
    if (disabled) {
      return palette('asideListItem', 2);
    }
    return palette('asideListItemHover', 2);
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

const ListHint = styled.div`
  color:  ${palette('dark', 3)};
  padding-bottom: 10px;
`;
const ListWrapper = styled.div``;


const getTypeLabel = (type, formatMessage, short = true) => {
  const [path, framework] = type.indexOf('_') > -1
    ? type.split('_')
    : [type, null];
  let label = formatMessage(appMessages.entities[path].plural);
  if (framework) {
    label = `${label} | ${formatMessage(appMessages[short ? 'frameworks_short' : 'frameworks'][framework])}`;
  } else if (path === 'recommendations') {
    label = `${label} | ${formatMessage(appMessages.frameworks.all)}`;
  }
  return label;
};

export class BookmarkList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const { intl } = this.context;
    const {
      dataReady,
      location,
      onSearch,
      onClear,
      bookmarksForSearch,
      activeTargetPath,
      onOpenBookmark,
      // onSortOrder,
      // onSortBy,
      onTargetSelect,
      allBookmarks,
    } = this.props;

    const groupedResults = bookmarksForSearch.groupBy((e) => e.getIn(['attributes', 'view', 'type']));
    const countResults = dataReady && bookmarksForSearch && bookmarksForSearch.size;
    const countTargets = dataReady && groupedResults && groupedResults.size;
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
                supTitle={intl.formatMessage(messages.supTitle)}
                title={intl.formatMessage(messages.pageTitle)}
                icon="bookmark_active"
              />
              {!dataReady
                && <Loading />
              }
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
                    {(allBookmarks.size === 0) && (
                      <ListHint>
                        <FormattedMessage {...messages.noBookmarks} />
                      </ListHint>
                    )}
                    {(allBookmarks.size > 0 && bookmarksForSearch.size === 0) && (
                      <ListHint>
                        <FormattedMessage {...messages.noResults} />
                      </ListHint>
                    )}
                    {bookmarksForSearch && bookmarksForSearch.size > 0 && (
                      <Box>
                        <ListHint>
                          <Text>
                            {`${countResults} ${countResults === 1 ? 'result' : 'results'} found in database. `}
                          </Text>
                          {countTargets > 1 && (
                            <Text>
                              Please select a category type below to see individual bookmarks.
                            </Text>
                          )}
                        </ListHint>
                        {groupedResults && groupedResults.size
                          && groupedResults
                            .keySeq()
                            .sort((a, b) => a > b ? 1 : -1)
                            .map((group) => {
                              const targetList = groupedResults.get(group);
                              const targetPath = targetList.get(0).getIn(['attributes', 'view', 'path']);
                              const groupLabel = getTypeLabel(group, intl.formatMessage, true);
                              const count = targetList.size;
                              const active = qe(targetPath, activeTargetPath);
                              return (
                                <Box key={targetPath}>
                                  <Box border="bottom" gap="xsmall">
                                    <Target
                                      onClick={(evt) => {
                                        if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                                        if (active) {
                                          onTargetSelect('');
                                        } else {
                                          onTargetSelect(targetPath);
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
                                            {groupLabel}
                                          </Text>
                                        </Box>
                                        {active && (
                                          <FormUp size="large" />
                                        )}
                                        {!active && (
                                          <FormDown size="large" />
                                        )}
                                      </Box>
                                    </Target>
                                  </Box>
                                  {active && (
                                    <Box margin={{ bottom: 'large' }}>
                                      {targetList.toList().map((entity, key) => {
                                        const type = entity.getIn(['attributes', 'view', 'type']);
                                        const label = getTypeLabel(type, intl.formatMessage, false);
                                        return (
                                          <EntityListItemWrapper
                                            key={key}
                                            entity={entity.setIn(['attributes', 'reference'], label)}
                                            entityPath={entity.getIn(['attributes', 'view', 'path'])}
                                            onEntityClick={() => onOpenBookmark(entity)}
                                          />
                                        );
                                      })}
                                    </Box>
                                  )}
                                </Box>
                              );
                            })
                        }
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

BookmarkList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  dataReady: PropTypes.bool,
  location: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onOpenBookmark: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onTargetSelect: PropTypes.func.isRequired,
  theme: PropTypes.object,
  bookmarksForSearch: PropTypes.instanceOf(List).isRequired,
  allBookmarks: PropTypes.object.isRequired,
  onTypeSelect: PropTypes.func.isRequired,
  activeTargetPath: PropTypes.string,
};

BookmarkList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  bookmarksForSearch: selectBookmarks(state, fromJS(props.location.query)),
  activeTargetPath: selectPathQuery(state, fromJS(props.location.query)),
  allBookmarks: selectEntities(state, 'bookmarks'),
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
    onTypeSelect: (value) => {
      // console.log('onTypeSelect')
      dispatch(updateQuery(fromJS([
        {
          query: 'type',
          value,
          replace: true,
          checked: value !== '',
        },
      ])));
    },
    onOpenBookmark: (bookmark) => {
      dispatch(openBookmark(bookmark));
    },
    onSortOrder: (order) => {
      dispatch(updateSortOrder(order));
    },
    onSortBy: (sort) => {
      dispatch(updateSortBy(sort));
    },
  };
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(BookmarkList));

/*
 *
 * Search
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';

import { startsWith } from 'utils/string';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';
import { SEARCH } from 'themes/config';

import Button from 'components/buttons/Button';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Container from 'components/styled/Container';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import TagSearch from 'components/TagSearch';
import Content from 'components/styled/Content';
import { Box, Text } from 'grommet';

import { FormUp, FormDown } from 'grommet-icons';

import qe from 'utils/quasi-equals';

import EntityListItem from 'components/EntityListItem';

import Footer from 'containers/Footer';

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

const Target = styled(Button)`
  display: table;
  width: 100%;
  font-size: 0.85em;
  font-weight: 600;
  padding: 0 12px;
  text-align: left;
  color: ${palette('asideListGroup', 0)};
  background-color: ${palette('light', 1)};
  &:hover {
    color: ${palette('text', 0)};
    background-color: ${palette('light', 2)};
  }
  border-bottom: 1px solid ${palette('asideListGroup', 1)};
  margin-bottom: 8px;
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 0.85em;
  }
  @media print {
    font-size: ${({ theme }) => theme.sizes.print.smaller};
  }
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
`;

const ListHint = styled.div`
  color:  ${palette('dark', 3)};
  padding-bottom: 10px;
`;
const ListWrapper = styled.div``;

export class Search extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getTargetTitle = (target, isSingle, intl) => {
    if (startsWith(target.get('path'), 'taxonomies')) {
      return intl.formatMessage(
        appMessages.entities.taxonomies[target.get('taxId')][isSingle ? 'single' : 'plural']
      );
    }
    return intl.formatMessage(
      appMessages.entities[target.get('path')][isSingle ? 'single' : 'plural']
    );
  };

  focusResults = () => {
    if (this.searchResults) this.searchResults.focus();
  };

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
    const hasEntry = location.query && location.query.search;
    const noEntry = !hasEntry;

    const hasResults = hasEntry
      && entities.reduce(
        (memo, group) => group.get('targets').find(
          (target) => target.get('results') && target.get('results').size > 0
        ) || memo,
        false,
      );
    const isQueryMinLength = hasEntry
      && location.query.search.length > SEARCH.MIN_LENGTH;

    const noResults = isQueryMinLength && !hasResults;

    const headerButtons = [{
      type: 'icon',
      onClick: () => window.print(),
      title: intl.formatMessage(appMessages.buttons.printTitle),
      icon: 'print',
    }];
    return (
      <div>
        <HelmetCanonical
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
                      focusOnMount
                      resultsId="search-results"
                      onSkipToResults={() => {
                        this.focusResults();
                      }}
                    />
                  </EntityListSearch>
                  <ListWrapper
                    id="search-results"
                    ref={(el) => { this.searchResults = el; }}
                    tabindex="0"
                  >
                    {noEntry && (
                      <ListHint>
                        <FormattedMessage {...messages.hints.noEntry} />
                      </ListHint>
                    )}
                    {!isQueryMinLength && hasEntry && !hasResults && (
                      <ListHint>
                        <FormattedMessage {...messages.hints.minLength} />
                      </ListHint>
                    )}
                    {noResults && !noEntry && (
                      <ListHint>
                        <FormattedMessage {...messages.hints.noResults} />
                      </ListHint>
                    )}
                    {hasResults && (
                      <Box>
                        <ListHint>
                          <Text>
                            {`${intl.formatMessage(messages.hints.resultsFound, { count: countResults })}`}
                            {countTargets > 1
                              && ` ${intl.formatMessage(messages.hints.hasCountTargets)}`
                            }
                          </Text>
                        </ListHint>
                        {entities.map(
                          (group, id) => {
                            const hasGroupResults = group.get('targets').some(
                              (target) => target.get('results') && target.get('results').size > 0
                            );
                            if (hasGroupResults) {
                              return (
                                <Box key={id} margin={{ vertical: 'medium' }}>
                                  {group.get('group') !== 'entities' && (
                                    <Box margin={{ bottom: 'xsmall' }}>
                                      <Text size="small">
                                        <FormattedMessage {...messages.groups[group.get('group')]} />
                                      </Text>
                                    </Box>
                                  )}
                                  <Box>
                                    {group.get('targets') && group.get('targets').valueSeq().map(
                                      (target) => {
                                        const hasTargetResults = target.get('results') && target.get('results').size > 0;
                                        if (hasTargetResults) {
                                          const count = target.get('results').size;
                                          const title = this.getTargetTitle(target, count === 1, this.context.intl);
                                          const otherTargets = countTargets > 1;
                                          const active = qe(target.get('path'), activeTargetPath) || !otherTargets;
                                          return (
                                            <Box key={target.get('path')}>
                                              <Box gap="xsmall">
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
                                                  disabled={!otherTargets}
                                                >
                                                  <Box direction="row" gap="small" align="center" justify="between">
                                                    <Box direction="row" gap="xsmall" pad={{ vertical: 'xsmall' }}>
                                                      <Text size="large">{count}</Text>
                                                      <Text size="large">{title}</Text>
                                                    </Box>
                                                    {otherTargets && active && (
                                                      <FormUp size="medium" />
                                                    )}
                                                    {otherTargets && !active && (
                                                      <FormDown size="medium" />
                                                    )}
                                                  </Box>
                                                </Target>
                                              </Box>
                                              {
                                                (active || !otherTargets) && (
                                                  <Box margin={{ bottom: 'large' }} gap="xsmall">
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
          <Footer fill hasBorder />
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

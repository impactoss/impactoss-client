/*
 *
 * TagSearch
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Box, ResponsiveContext } from 'grommet';
import DebounceInput from 'react-debounce-input';

import { isMinSize } from 'utils/responsive';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import PrintOnly from 'components/styled/PrintOnly';
import ScreenReaderOnly from 'components/styled/ScreenReaderOnly';
import InfoOverlay from 'components/InfoOverlay';

import SearchInfo from './SearchInfo';
import Tags from './Tags';

import messages from './messages';

const Search = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 100%;
  min-width: 0;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  background-color: ${palette('primary', 3)};
  border: 1px solid ${palette('light', 3)};
  color: ${palette('dark', 1)};
  border-radius: 22px;
  min-height: ${(props) => props.small ? 30 : 40}px;
  position: relative;
  outline: ${({ hasFocus }) => hasFocus ? 2 : 0}px solid ${palette('primary', 0)};
  cursor: text;
  @media print {
    border: none;
    box-shadow: none;
    padding: 0;
    display: ${({ hidePrint }) => hidePrint ? 'none' : 'block'};
  }
  padding: 4px 4px 4px 12px;
`;
const SearchInput = styled((p) => <DebounceInput {...p} />)`
  margin: 2px 0;
  flex: 1;
  font-size: 0.85em;
  &:focus-visible, &:focus {
    outline: 0;
  }
  @media print {
    display: none;
  }
`;

const LabelPrint = styled(PrintOnly)`
  margin-top: 10px;
  font-size: ${(props) => props.theme.sizes.print.smaller};
`;
const SearchValuePrint = styled(PrintOnly)`
  font-size: ${(props) => props.theme.sizes.print.default};
  font-weight: bold;
`;

const ButtonTagSearch = styled(Button)`
  color: ${palette('dark', 1)};
  background-color: transparent;
  border-radius: 999px;
  &:hover, &:focus-visible {
    color: ${palette('primary', 0)};
    background-color: ${palette('background', 1)};
  }
  &:focus-visible {
    outline: 1px solid ${palette('primary', 0)};
  }
  width: 30px;
  height: 30px;
  padding: 6px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: 36px;
    height: 36px;
    padding: 6px;
  }
  @media print {
    display: none;
  }
`;

export class TagSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      active: false,
      hasFocus: false,
    };
  }

  componentDidMount() {
    if (this.input && this.props.focusOnMount) {
      this.input.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filters.length !== this.props.filters.length) {
      if (this.props.filters.length > 0) {
        this.focusLastFilter();
      } else if (this.input) {
        this.input.focus();
      }
    }
  }

  focusLastFilter = () => {
    if (this.lastFilter) this.lastFilter.focus();
  };

  render() {
    const {
      filters,
      searchQuery,
      onSearch,
      placeholder,
      onClear,
      resultsId,
      searchAttributes,
      placeholderMessageId,
      intl,
      showHint,
    } = this.props;
    const searchHasFilters = (searchQuery || filters.length > 0);
    let inputPlaceholder;
    if (placeholder) {
      inputPlaceholder = placeholder;
    } else if (placeholderMessageId && messages[placeholderMessageId]) {
      inputPlaceholder = intl.formatMessage(messages[placeholderMessageId]);
    } else {
      inputPlaceholder = intl.formatMessage(
        this.props.multiselect
          ? messages.searchPlaceholderMultiSelect
          : messages.searchPlaceholderEntities,
      );
    }

    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <>
            {filters.length > 0 && !isMinSize(size, 'medium') && (
              <Box margin={{ bottom: 'small' }}>
                <Tags
                  filters={filters}
                  lastFilterRef={(el) => { this.lastFilter = el; }}
                  focusLastFilter={this.focusLastFilter}
                />
              </Box>
            )}
            <Box
              direction="row"
              align="center"
              fill="vertical"
              flex={{ shrink: 0 }}
              gap="xxsmall"
            >
              <ScreenReaderOnly id="search-hint">
                Results will update as you type
              </ScreenReaderOnly>
              <Search
                active={this.state.active}
                small={this.props.multiselect}
                hidePrint={!searchHasFilters}
                hasFocus={this.state.hasFocus}
                onClick={() => this.input && this.input.focus()}
              >
                {filters.length > 0 && (
                  <LabelPrint>
                    <FormattedMessage {...messages.labelPrintFilters} />
                  </LabelPrint>
                )}
                <Box direction="row" fill="horizontal" justify="between">
                  <Box
                    direction={filters && filters.length > 3 ? 'column' : 'row'}
                    gap="xsmall"
                    fill="horizontal"
                  >
                    {filters.length > 0 && isMinSize(size, 'medium') && (
                      <Tags
                        filters={filters}
                        lastFilterRef={(el) => { this.lastFilter = el; }}
                        focusLastFilter={this.focusLastFilter}
                      />
                    )}
                    <SearchInput
                      name="search"
                      placeholder={inputPlaceholder}
                      aria-label={inputPlaceholder}
                      aria-describedby="search-hint"
                      autoComplete="off"
                      minLength={1}
                      debounceTimeout={500}
                      value={searchQuery || ''}
                      onChange={(e) => onSearch(e.target.value)}
                      onFocus={() => this.setState({ active: true, hasFocus: true })}
                      onBlur={() => this.setState({ active: false, hasFocus: false })}
                      onKeyDown={(e) => {
                        const key = e.keyCode || e.charCode;
                        if (filters.length > 0 && (!searchQuery || searchQuery.length === 0)) {
                          // backspace
                          if (key === 8) {
                            this.focusLastFilter();
                          }
                          // enter
                        } else if (this.props.onSkipToResults && key === 13) {
                          this.props.onSkipToResults();
                        }
                      }}
                    />
                  </Box>
                  <Box direction="row" align="center" fill="vertical" flex={{ shrink: 0 }}>
                    {searchHasFilters && (
                      <ButtonTagSearch
                        onClick={onClear}
                        small={this.props.multiselect}
                        title={intl.formatMessage(messages.removeAll)}
                      >
                        <Icon name="removeSmall" />
                      </ButtonTagSearch>
                    )}
                    {searchQuery && (
                      <LabelPrint>
                        <FormattedMessage {...messages.labelPrintKeywords} />
                      </LabelPrint>
                    )}
                    {searchQuery && (
                      <SearchValuePrint>
                        {searchQuery}
                      </SearchValuePrint>
                    )}
                    <ButtonTagSearch
                      as="a"
                      href={`#${resultsId}`}
                      title={intl.formatMessage(messages.skipToResults)}
                      aria-label={intl.formatMessage(messages.skipToResults)}
                      isSearchIcon
                    >
                      <Icon name="search" size="1em" />
                    </ButtonTagSearch>
                  </Box>
                </Box>
              </Search>
              {showHint && (
                <Box style={{ minWidth: '36px' }}>
                  <InfoOverlay
                    title={intl.formatMessage(messages.searchInfoTitle)}
                    padButton="none"
                    overlayId="search-info"
                    round
                    content={(
                      <SearchInfo
                        searchAttributes={searchAttributes}
                      />
                    )}
                  />
                </Box>
              )}
            </Box>
          </>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
// colorButton={theme.global.colors.hint}
// <ButtonTagSearch
// onClick={onClear}
// small={this.props.multiselect}
// title={this.context.intl.formatMessage(messages.removeAll)}
// >
// <Icon name="info" size="medium" />
// </ButtonTagSearch>

TagSearch.defaultProps = {
  resultsId: 'entity-list-main',
};

TagSearch.propTypes = {
  filters: PropTypes.array,
  searchAttributes: PropTypes.array,
  searchQuery: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderMessageId: PropTypes.string,
  resultsId: PropTypes.string,
  onSearch: PropTypes.func,
  onSkipToResults: PropTypes.func,
  onClear: PropTypes.func,
  multiselect: PropTypes.bool,
  focusOnMount: PropTypes.bool,
  showHint: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

TagSearch.defaultProps = {
  showHint: true,
};

export default injectIntl(TagSearch);

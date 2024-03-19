/*
 *
 * TagSearch
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { reduce } from 'lodash/collection';
import { Box } from 'grommet';

import appMessage from 'utils/app-message';
import { lowerCase } from 'utils/string';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ButtonTagFilter from 'components/buttons/ButtonTagFilter';
import ButtonTagFilterInverse from 'components/buttons/ButtonTagFilterInverse';
import DebounceInput from 'react-debounce-input';
import PrintOnly from 'components/styled/PrintOnly';
import ScreenReaderOnly from 'components/styled/ScreenReaderOnly';

import appMessages from 'containers/App/messages';
import messages from './messages';

const Search = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  background-color: ${palette('primary', 3)};
  border: 1px solid ${palette('light', 3)};
  color: ${palette('dark', 1)};
  border-radius: 22px;
  min-height: ${(props) => props.small ? 30 : 36}px;
  position: relative;
  outline: ${({ hasFocus }) => hasFocus ? 2 : 0}px solid ${palette('primary', 0)};
  cursor: text;
  @media print {
    border: none;
    box-shadow: none;
    padding: 0;
    display: ${({ hidePrint }) => hidePrint ? 'none' : 'block'};
  }
  padding: 2px 3px 2px 12px;
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
const Tags = styled((p) => <Box direction="row" align="center" wrap {...p} />)``;

const ButtonTagSearch = styled(Button)`
  padding: 6px;
  color: ${palette('dark', 1)};
  background-color: 'transparent';
  width: 40px;
  height: 40px;
  border-radius: 999px;
  cursor: ${({ isDisabled }) => isDisabled ? 'auto' : 'pointer'};
  &:hover, &:focus-visible {
    color: ${({ isDisabled }) => isDisabled ? palette('dark', 1) : palette('primary', 0)};
    background-color: ${({ isDisabled }) => isDisabled ? 'transparent' : palette('background', 1)};
    outline: 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 10px;
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
// const ButtonTagSearch = styled.div``;
const StyledLabel = styled.label``;

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

  getLabels = (labels) => reduce(labels, (memo, label) => {
    if (!label.label) return memo;
    let labelValue = label.appMessage ? appMessage(this.context.intl, label.label) : label.label;
    labelValue = label.postfix ? `${labelValue}${label.postfix}` : labelValue;
    return `${memo}${label.lowerCase ? lowerCase(labelValue) : labelValue} `;
  }, '').trim();

  getFilterLabel = (filter) => {
    const { intl } = this.context;
    // not used I think?
    if (filter.message) {
      return filter.messagePrefix
        ? `${filter.messagePrefix} ${lowerCase(appMessage(intl, filter.message))}`
        : appMessage(intl, filter.message);
    }
    if (filter.labels) {
      return this.getLabels(filter.labels);
    }
    return filter.label;
  };

  getFilterTitle = (filter) => {
    let title = '';
    if (filter.titleLabels) {
      title = this.getLabels(filter.titleLabels);
    } else {
      title = filter.title || this.getFilterLabel(filter);
    }
    return this.context.intl.formatMessage(messages.removeTag, { title });
  };

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
    } = this.props;
    const { intl } = this.context;
    const searchHasFilters = (searchQuery || filters.length > 0);
    let inputPlaceholder;
    if (placeholder) {
      inputPlaceholder = placeholder;
    } else if (searchAttributes) {
      const attLength = searchAttributes.length;
      inputPlaceholder = intl.formatMessage(
        messages.searchPlaceholderEntitiesAttributes,
        {
          attributes: searchAttributes.reduce(
            (memo, att, position) => {
              const value = intl.formatMessage(appMessages.attributes[att]);
              if (position === 0) {
                return value;
              }
              if (position + 1 === attLength) {
                return `${memo} or ${value}`;
              }
              return `${memo}, ${value}`;
            },
            '',
          ),
        }
      );
    } else {
      inputPlaceholder = intl.formatMessage(
        this.props.multiselect
          ? messages.searchPlaceholderMultiSelect
          : messages.searchPlaceholderEntities
      );
    }

    const inputId = this.props.multiselect ? 'ms-search' : 'search';

    return (
      <Search
        active={this.state.active}
        small={this.props.multiselect}
        hidePrint={!searchHasFilters}
        hasFocus={this.state.hasFocus}
        onClick={() => this.input && this.input.focus()}
      >
        <ScreenReaderOnly>
          <StyledLabel htmlFor={inputId}>
            {inputPlaceholder}
          </StyledLabel>
        </ScreenReaderOnly>
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
            {filters.length > 0 && (
              <Tags>
                {filters.map((filter, i) => filter.inverse
                  ? (
                    <ButtonTagFilterInverse
                      ref={(el) => { this.lastFilter = el; }}
                      key={i}
                      onClick={filter.onClick}
                      palette={filter.type || 'attributes'}
                      paletteHover={`${filter.type || 'attributes'}Hover`}
                      pIndex={parseInt(filter.id, 10) || 0}
                      disabled={!filter.onClick}
                      title={this.getFilterTitle(filter)}
                      onKeyDown={(e) => {
                        const key = e.keyCode || e.charCode;
                        if (filter.onClick && key === 8) {
                          filter.onClick();
                          this.focusLastFilter();
                        }
                      }}
                    >
                      {this.getFilterLabel(filter)}
                      {filter.onClick
                        && <Icon name="removeSmall" text textRight hidePrint />
                      }
                    </ButtonTagFilterInverse>
                  )
                  : (
                    <ButtonTagFilter
                      ref={(el) => { this.lastFilter = el; }}
                      key={i}
                      onClick={filter.onClick}
                      palette={filter.type || 'attributes'}
                      paletteHover={`${filter.type || 'attributes'}Hover`}
                      pIndex={parseInt(filter.id, 10) || 0}
                      disabled={!filter.onClick}
                      title={this.getFilterTitle(filter)}
                      onKeyDown={(e) => {
                        const key = e.keyCode || e.charCode;
                        if (filter.onClick && key === 8) {
                          filter.onClick();
                          this.focusLastFilter();
                        }
                      }}
                    >
                      {this.getFilterLabel(filter)}
                      {filter.onClick
                        && <Icon name="removeSmall" text textRight hidePrint />
                      }
                    </ButtonTagFilter>
                  ))
                }
              </Tags>
            )}
            <SearchInput
              id={inputId}
              placeholder={inputPlaceholder}
              inputRef={(el) => { this.input = el; }}
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
                title={this.context.intl.formatMessage(messages.removeAll)}
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
              title={this.context.intl.formatMessage(messages.skipToResults)}
              isSearchIcon
            >
              <Icon name="search" size="1em" />
            </ButtonTagSearch>
          </Box>
        </Box>
      </Search>
    );
  }
}

TagSearch.defaultProps = {
  resultsId: 'entity-list-main',
};

TagSearch.propTypes = {
  filters: PropTypes.array,
  searchAttributes: PropTypes.array,
  searchQuery: PropTypes.string,
  placeholder: PropTypes.string,
  resultsId: PropTypes.string,
  onSearch: PropTypes.func,
  onSkipToResults: PropTypes.func,
  onClear: PropTypes.func,
  multiselect: PropTypes.bool,
  focusOnMount: PropTypes.bool,
};

TagSearch.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TagSearch;

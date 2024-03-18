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
  background-color: ${palette('primary', 3)};
  border: 1px solid ${palette('light', 3)};
  color: ${palette('dark', 1)};
  border-radius: 100px;
  min-height: ${(props) => props.small ? 30 : 36}px;
  position: relative;
  @media print {
    border: none;
    box-shadow: none;
    padding: 0;
    display: ${({ hidePrint }) => hidePrint ? 'none' : 'block'};
  }
`;
const SearchInput = styled(DebounceInput)`
  padding: 10px;
  padding-left: 16px;
  flex: 1;
  font-size: 0.85em;
  &:focus-visible {
    border-radius: ${({ hasFilters }) => !hasFilters ? '100px 0px 0px 100px' : 'none'};
    outline: 2px solid ${palette('primary', 0)};
  }
  @media print {
    display: none;
  }
`;
const Tags = styled.div`
  margin-top: 7px;
  margin-left: 10px;
`;

const ButtonTagSearch = styled(Button)`
  padding: ${(props) => props.small ? '4px 6px' : '8px 6px'};
  color: ${palette('dark', 1)};
  background-color: ${palette('background', 4)};
  &:hover, &:focus-visible {
    color: ${palette('primary', 0)};
  }
  &:focus-visible {
    border-radius: ${({ isSearchIcon }) => isSearchIcon ? '0px 100px 100px 0px' : 'none'};
    outline: 2px solid ${palette('primary', 0)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 10px 16px;
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
    };
  }

  componentDidMount() {
    if (this.input && this.props.focusOnMount) this.input.focus();
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
    // TODO set focus to input when clicking wrapper
    //  see https://github.com/nkbt/react-debounce-input/issues/65
    //  https://github.com/yannickcr/eslint-plugin-react/issues/678
    // for now this works all right thanks to flex layout
    // onClick={() => {
    //   this.inputNode.focus()
    // }}
    const hasFilters = (searchQuery || filters.length > 0);
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
        hidePrint={!hasFilters}
      >
        {filters.length > 0 && (
          <LabelPrint>
            <FormattedMessage {...messages.labelPrintFilters} />
          </LabelPrint>
        )}
        {filters.length > 0
          && (
            <Tags>
              {
                filters.map((filter, i) => filter.inverse
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
                    >
                      {this.getFilterLabel(filter)}
                      {filter.onClick
                        && <Icon name="removeSmall" text textRight hidePrint />
                      }
                    </ButtonTagFilter>
                  ))
              }
            </Tags>
          )
        }
        <ScreenReaderOnly>
          <StyledLabel htmlFor={inputId}>
            {inputPlaceholder}
          </StyledLabel>
        </ScreenReaderOnly>
        <SearchInput
          id={inputId}
          placeholder={inputPlaceholder}
          inputRef={(el) => { this.input = el; }}
          minLength={1}
          debounceTimeout={500}
          value={searchQuery || ''}
          hasFilters={hasFilters}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => this.setState({ active: true })}
          onBlur={() => this.setState({ active: false })}
          onKeyDown={(e) => {
            if (filters.length > 0 && (!searchQuery || searchQuery.length === 0)) {
              const key = e.keyCode || e.charCode;
              if (key === 8) {
                this.focusLastFilter();
              }
            }
          }}
        />
        {hasFilters && (
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
  onClear: PropTypes.func,
  multiselect: PropTypes.bool,
  focusOnMount: PropTypes.bool,
};

TagSearch.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TagSearch;

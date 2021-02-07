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

import messages from './messages';

const Search = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${palette('background', 0)};
  color: ${palette('dark', 2)};
  padding: ${(props) => props.small ? '2px 7px' : '7px'};
  border: 1px solid ${(props) => props.active ? palette('light', 4) : palette('light', 2)};
  box-shadow: 0 0 3px 0 ${(props) => props.active ? palette('dark', 2) : 'transparent'};
  min-height: ${(props) => props.small ? 30 : 36}px;
  border-radius: 5px;
  position: relative;
  @media print {
    border: none;
    box-shadow: none;
    padding: 0;
    display: ${({ hidePrint }) => hidePrint ? 'none' : 'block'};
  }
`;
const SearchInput = styled(DebounceInput)`
  background-color: ${palette('background', 0)};
  border: none;
  padding: 3px;
  &:focus {
    outline: none;
  }
  flex: 1;
  font-size: 0.85em;
  @media print {
    display: none;
  }
`;
const Tags = styled.div`
  margin-top: -2px;
  margin-bottom: -2px;
`;

const Clear = styled(Button)`
  padding: ${(props) => props.small ? '4px 6px' : '8px 6px'};
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${palette('background', 4)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.small ? '4px 6px' : '8px 6px'};
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

export class TagSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  getFilterLabel = (filter) => {
    const { intl } = this.context;
    // not used I think?
    if (filter.message) {
      return filter.messagePrefix
        ? `${filter.messagePrefix} ${lowerCase(appMessage(intl, filter.message))}`
        : appMessage(intl, filter.message);
    }
    if (filter.labels) {
      return reduce(filter.labels, (memo, label) => {
        if (!label.label) return memo;
        let labelValue = label.appMessage ? appMessage(intl, label.label) : label.label;
        labelValue = label.postfix ? `${labelValue}${label.postfix}` : labelValue;
        return `${memo}${label.lowerCase ? lowerCase(labelValue) : labelValue} `;
      }, '').trim();
    }
    return filter.label;
  }

  render() {
    const {
      filters,
      searchQuery,
      onSearch,
      placeholder,
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
        { filters.length > 0
          && (
            <Tags>
              {
                filters.map((filter, i) => filter.inverse
                  ? (
                    <ButtonTagFilterInverse
                      key={i}
                      onClick={filter.onClick}
                      palette={filter.type || 'attributes'}
                      paletteHover={`${filter.type || 'attributes'}Hover`}
                      pIndex={parseInt(filter.id, 10) || 0}
                      disabled={!filter.onClick}
                    >
                      {this.getFilterLabel(filter)}
                      { filter.onClick
                      && <Icon name="removeSmall" text textRight hidePrint />
                      }
                    </ButtonTagFilterInverse>
                  )
                  : (
                    <ButtonTagFilter
                      key={i}
                      onClick={filter.onClick}
                      palette={filter.type || 'attributes'}
                      paletteHover={`${filter.type || 'attributes'}Hover`}
                      pIndex={parseInt(filter.id, 10) || 0}
                      disabled={!filter.onClick}
                    >
                      {this.getFilterLabel(filter)}
                      { filter.onClick
                      && <Icon name="removeSmall" text textRight hidePrint />
                      }
                    </ButtonTagFilter>
                  ))
              }
            </Tags>
          )
        }
        <SearchInput
          id="search"
          minLength={1}
          debounceTimeout={500}
          value={searchQuery || ''}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => this.setState({ active: true })}
          onBlur={() => this.setState({ active: false })}
          placeholder={placeholder || (intl.formatMessage(
            this.props.multiselect
              ? messages.searchPlaceholderMultiSelect
              : messages.searchPlaceholderEntities
          ))}
        />
        { hasFilters && (
          <Clear
            onClick={this.props.onClear}
            small={this.props.multiselect}
          >
            <Icon name="removeSmall" />
          </Clear>
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
      </Search>
    );
  }
}

TagSearch.propTypes = {
  filters: PropTypes.array,
  searchQuery: PropTypes.string,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  multiselect: PropTypes.bool,
};

TagSearch.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TagSearch;

/*
 *
 * TagSearch
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { reduce } from 'lodash/collection';

import appMessage from 'utils/app-message';
import { lowerCase } from 'utils/string';

import Icon from 'components/Icon';
import ButtonTagFilter from 'components/buttons/ButtonTagFilter';
import ButtonTagFilterInverse from 'components/buttons/ButtonTagFilterInverse';
import DebounceInput from 'react-debounce-input';

import messages from './messages';

const Search = styled.div`
  display:flex;
  flex-direction:row;
  width: 100%;
  background-color: ${palette('primary', 4)};
  color: ${palette('dark', 2)};
  padding: ${(props) => props.small ? '0 7px' : '7px'};
  border: 1px solid ${(props) => props.active ? palette('light', 4) : palette('light', 2)};
  box-shadow: 0 0 3px 0 ${(props) => props.active ? palette('dark', 2) : 'transparent'};
  min-height: ${(props) => props.small ? 30 : 36}px;
  border-radius: 5px;
`;
const SearchInput = styled(DebounceInput)`
  background-color: ${palette('primary', 4)};
  border:none;
  padding:3px;
  &:focus {
    outline: none;
  }
  flex:1
`;
const Tags = styled.div``;

export class TagSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }
  getFilterLabel = (filter) => {
    // not used I think?
    if (filter.message) {
      return filter.messagePrefix
        ? `${filter.messagePrefix} ${lowerCase(appMessage(this.context.intl, filter.message))}`
        : appMessage(this.context.intl, filter.message);
    }
    // <<< not used?
    if (filter.labels) {
      return reduce(filter.labels, (memo, label) => {
        if (!label.label) return memo;
        let labelValue = label.appMessage ? appMessage(this.context.intl, label.label) : label.label;
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
    } = this.props;
    // TODO set focus to input when clicking wrapper
    //  see https://github.com/nkbt/react-debounce-input/issues/65
    //  https://github.com/yannickcr/eslint-plugin-react/issues/678
    // for now this works all right thanks to flex layout
    // onClick={() => {
    //   this.inputNode.focus()
    // }}

    return (
      <Search active={this.state.active} small={this.props.multiselect}>
        <Tags>
          {
            filters.map((filter, i) => filter.without
              ? (
                <ButtonTagFilterInverse
                  key={i}
                  onClick={filter.onClick}
                  palette={filter.type}
                  paletteHover={`${filter.type}Hover`}
                  pIndex={parseInt(filter.id, 10) || 0}
                >
                  {this.getFilterLabel(filter)}
                  <Icon name="removeSmall" text textRight />
                </ButtonTagFilterInverse>
              )
              : (
                <ButtonTagFilter
                  key={i}
                  onClick={filter.onClick}
                  palette={filter.type}
                  paletteHover={`${filter.type}Hover`}
                  pIndex={parseInt(filter.id, 10) || 0}
                >
                  {this.getFilterLabel(filter)}
                  <Icon name="removeSmall" text textRight />
                </ButtonTagFilter>
              )
            )
          }
        </Tags>
        <SearchInput
          id="search"
          minLength={1}
          debounceTimeout={300}
          value={searchQuery || ''}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => this.setState({ active: true })}
          onBlur={() => this.setState({ active: false })}
          placeholder={this.context.intl.formatMessage(
            this.props.multiselect
            ? messages.searchPlaceholderMultiSelect
            : messages.searchPlaceholderEntities
          )}
        />
      </Search>
    );
  }
}

TagSearch.propTypes = {
  filters: PropTypes.array,
  searchQuery: PropTypes.string,
  onSearch: PropTypes.func,
  multiselect: PropTypes.bool,
};

TagSearch.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TagSearch;

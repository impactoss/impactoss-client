/*
 *
 * EntityListSearch
 *
 */
import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import ButtonFilterTag from 'components/buttons/ButtonFilterTag';
import ButtonFilterTagInverse from 'components/buttons/ButtonFilterTagInverse';
import DebounceInput from 'react-debounce-input';

import messages from './messages';

const Styled = styled.div`
  display: block;
  width: 100%;
  background-color: ${palette('primary', 4)};
  color: ${palette('greyscaleDark', 2)};
  padding: 5px;
  border: 1px solid ${palette('greyscaleLight', 2)};
  margin-bottom: 10px;
  min-height: 24px;
  border-radius: 5px;
`;
const Search = styled(DebounceInput)`
  background-color: ${palette('primary', 4)};
  display: block;
  width: 100%;
  border:none;
  padding:3px;
`;

export class EntityListSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
      filters,
      searchQuery,
      onSearch,
    } = this.props;

    return (
      <Styled>
        {
          filters.map((filter, i) => filter.without
            ? (
              <ButtonFilterTagInverse
                key={i}
                onClick={filter.onClick}
                palette={filter.type}
                paletteHover={`${filter.type}Hover`}
                pIndex={parseInt(filter.id, 10) || 0}
              >
                {filter.label}
                <Icon name="removeSmall" text textRight />
              </ButtonFilterTagInverse>
            )
            : (
              <ButtonFilterTag
                key={i}
                onClick={filter.onClick}
                palette={filter.type}
                paletteHover={`${filter.type}Hover`}
                pIndex={parseInt(filter.id, 10) || 0}
              >
                {filter.label}
                <Icon name="removeSmall" text textRight />
              </ButtonFilterTag>
            )
          )
        }
        <Search
          id="search"
          autoFocus
          minLength={1}
          debounceTimeout={300}
          value={searchQuery || ''}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={this.context.intl.formatMessage(messages.searchPlaceholder)}
        />
      </Styled>
    );
  }
}

EntityListSearch.propTypes = {
  filters: PropTypes.array,
  searchQuery: PropTypes.string,
  onSearch: PropTypes.func,
};

EntityListSearch.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListSearch;

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
  padding: 0 0 1em;
`;
const TagSearch = styled.div`
  display:flex;
  flex-direction:row;
  width: 100%;
  background-color: ${palette('primary', 4)};
  color: ${palette('greyscaleDark', 2)};
  padding: 7px;
  border: 1px solid ${(props) => props.active ? palette('greyscaleLight', 4) : palette('greyscaleLight', 2)};
  box-shadow: 0 0 3px 0 ${(props) => props.active ? palette('greyscaleDark', 2) : 'transparent'};
  margin-bottom: 10px;
  min-height: 36px;
  border-radius: 5px;
`;
const Search = styled(DebounceInput)`
  background-color: ${palette('primary', 4)};
  border:none;
  padding:3px;
  &:focus {
    outline: none;
  }
  flex:1
`;
const Tags = styled.div`
`;

export class EntityListSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      active: false,
    };
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
      <Styled>
        <TagSearch active={this.state.active} >
          <Tags>
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
          </Tags>
          <Search
            id="search"
            minLength={1}
            debounceTimeout={300}
            value={searchQuery || ''}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => this.setState({ active: true })}
            onBlur={() => this.setState({ active: false })}
            placeholder={this.context.intl.formatMessage(messages.searchPlaceholder)}
          />
        </TagSearch>
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

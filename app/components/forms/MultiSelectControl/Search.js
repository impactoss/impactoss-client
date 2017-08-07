import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background: ${palette('primary', 4)};
  height: 55px;
  padding: 1em;
  background-color: ${palette('light', 0)};
`;

const SearchInput = styled.input`
  background: ${palette('primary', 4)};
  width:100%;
  border:1px solid ${palette('light', 1)};
  color: ${palette('dark', 4)};
  padding:5px;
`;


const Search = (props) => (
  <Styled>
    <SearchInput id="search" onChange={props.onSearch} placeholder="Filter options" />
  </Styled>
);

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
  // queryTags: PropTypes.array,
};

export default Search;

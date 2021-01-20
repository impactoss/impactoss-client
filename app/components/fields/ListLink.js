import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Link from 'containers/Link';

const ListLink = styled(
  // eslint-disable-line no-unused-vars
  ({
    paletteName, pIndex, paletteHover, pIndexHover, ...props
  }) => <Link {...props} /> // eslint-disable-line jsx-a11y/anchor-has-content
)`
  color: ${({ paletteName, pIndex }) => palette(paletteName || 'mainListItem', pIndex || 0)};
  display: block;
  &:hover {
    color: ${({ paletteHover, pIndexHover }) => palette(paletteHover || 'mainListItemHover', pIndexHover || 0)};
  }
`;

export default ListLink;

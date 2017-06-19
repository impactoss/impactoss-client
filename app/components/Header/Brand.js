import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.a`
  position: absolute;
  top:0;
  left:0;
  text-decoration:none;
  color:${palette('headerBrand', 0)};
  &:hover {
    color:${palette('headerBrandHover', 0)};
    opacity: 0.95;
  }
`;

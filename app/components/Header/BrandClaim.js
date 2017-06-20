import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  display: inline-block;
  padding: 2px 0;
  font-family: ${(props) => props.theme.fonts.headerBrandClaim};
  font-size: ${(props) => props.theme.sizes.headerBrandClaim};
  font-weight: 100;
  background-color: ${palette('header', 0)};
  color: ${palette('headerBrand', 1)};
  &:hover {
    color:${palette('headerBrandHover', 1)}
    opacity: 0.95;
  }
`;

import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  display: inline-block;
  padding: 0px 5px;
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.header.text.claimMobile};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.header.text.claim};
  }
  background-color: ${palette('header', 0)};
  color: ${palette('headerBrand', 1)};
  &:hover {
    color:${palette('headerBrandHover', 1)}
    opacity: 0.95;
  }
`;

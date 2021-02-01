import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  display: inline-block;
  padding: 0px 5px;
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.header.text.claimMobile};
  background-color: ${palette('header', 0)};
  color: ${palette('headerBrand', 1)};
  &:hover {
    color:${palette('headerBrandHover', 1)};
    opacity: 0.95;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.header.text.claim};
  }
  @media print {
    background: transparent;
  }
`;

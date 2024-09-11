import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  display: none;
  padding: 0px 5px;
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.header.text.claim};
  background-color: ${palette('header', 0)};
  color: ${palette('headerBrand', 1)};
  &:hover {
    color:${palette('headerBrandHover', 1)};
    opacity: 0.95;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: block;
  }
  @media print {
    background: transparent;
    font-size: ${(props) => props.theme.sizes.header.print.claim};
    padding: 0;
    color: ${palette('primary', 0)};
  }
`;

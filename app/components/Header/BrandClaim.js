import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  display: block;
  padding-left: 10px;
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.header.text.claimMobile};
  line-height: ${(props) => props.theme.sizes.header.text.claimMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0px 5px;
    font-size: ${(props) => props.theme.sizes.header.text.claim};
    background-color: ${palette('header', 0)};
  }
  @media print {
    background: transparent;
    font-size: ${(props) => props.theme.sizes.header.print.claim};
    padding: 0;
    color: ${palette('primary', 0)};
  }
`;

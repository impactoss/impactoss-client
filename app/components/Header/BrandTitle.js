import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  margin: 0;
  padding-left: 10px;
  font-weight: 700;
  /* text-transform: uppercase; */
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.sizes.header.text.titleMobile};
  line-height: ${(props) => props.theme.sizes.header.text.titleMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0px 5px;
    font-size: ${(props) => props.theme.sizes.header.text.title};
    line-height: ${(props) => props.theme.sizes.header.text.title};
    margin-bottom: -5px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.header.print.title};
    color: ${palette('primary', 0)};
  }
`;

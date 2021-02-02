import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.h1`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.sizes.header.text.titleMobile};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.header.text.title};
  }
  text-transform: uppercase;
  margin: 0;
  @media print {
    font-size: ${(props) => props.theme.sizes.header.print.title};
    color: ${palette('primary', 0)};
  }
`;

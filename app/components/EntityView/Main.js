import styled from 'styled-components';
import { palette } from 'styled-theme';

import Section from './Section';

const Main = styled(Section)`
  border-color: ${palette('light', 1)};
  border-width: 1px;
  border-bottom-style: solid;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    border-bottom-style: ${(props) => props.bottom ? 'none' : 'solid'};
    border-right-style: ${(props) => props.hasAside ? 'solid' : 'none'};
    display: table-cell;
    width: ${(props) => props.hasAside ? '70%' : '100%'};
  }
  @media print {
    display: ${({ hasAside, bottom }) => (hasAside && !bottom) ? 'table-cell' : 'block'};
    width: ${({ hasAside, bottom }) => (hasAside && !bottom) ? '70%' : '100%'};
    border-right-style: none;
  }
`;

export default Main;

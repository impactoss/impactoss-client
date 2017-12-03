import styled from 'styled-components';
import { palette } from 'styled-theme';

import Section from './Section';

const Main = styled(Section)`
  display: table-cell;
  width: ${(props) => props.hasAside ? '70%' : '100%'};
  border-color: ${palette('light', 1)};
  border-width: 1px;
  border-right-style: ${(props) => props.hasAside ? 'solid' : 'none'};
  border-bottom-style: ${(props) => props.bottom ? 'none' : 'solid'};
`;

export default Main;

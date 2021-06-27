import styled from 'styled-components';
import { palette } from 'styled-theme';

const EmptyHint = styled.span`
  color: ${palette('text', 1)};
  font-size: 0.85em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;


export default EmptyHint;

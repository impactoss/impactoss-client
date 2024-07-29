import styled from 'styled-components';
import { palette } from 'styled-theme';

const Required = styled.span`
  color: ${palette('primary', 1)};
  font-weight: bold;
  font-size: 1.3em;
  padding-left: 3px;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

export default Required;

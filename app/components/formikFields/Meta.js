import styled from 'styled-components';
import { palette } from 'styled-theme';

const Meta = styled.div`
  font-size: ${(props) => props.theme.sizes.text.small};
  color: ${palette('text', 1)};
  line-height: 1.6;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;
export default Meta;

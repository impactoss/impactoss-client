import styled from 'styled-components';
import { palette } from 'styled-theme';

const ReferenceLarge = styled.div`
  font-weight: bold;
  margin: 0 0 -3px 0;
  color: ${palette('text', 1)};
  font-size: 0.9em;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    font-size: 1.2em;
  }
`;


export default ReferenceLarge;

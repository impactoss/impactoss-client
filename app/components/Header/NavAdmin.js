import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  background-color: ${palette('headerNavPages', 0)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    float:right;
  }
`;

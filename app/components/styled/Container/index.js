import styled from 'styled-components';
import { palette } from 'styled-theme';

const Container = styled.div`
  margin-right: auto;
  margin-left: auto;
  max-width: 100%;
  padding-bottom: ${(props) => props.noPaddingBottom || props.inModal ? 0 : '3em'};
  background-color: ${(props) => props.inModal ? palette('light', 0) : 'transparent'};
  padding-right: 12px;
  padding-left: 12px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {    
    max-width: ${(props) => props.isNarrow ? '960' : (props.theme.breakpoints.large - 30)}px;
  }
`;
export default Container;

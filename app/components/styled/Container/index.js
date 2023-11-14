import styled from 'styled-components';
import { palette } from 'styled-theme';

const Container = styled.div`
  margin-right: auto;
  margin-left: auto;
  max-width: 100%;
  padding-bottom: ${(props) => props.noPaddingBottom || props.inModal ? 0 : '3em'};
  padding-left: ${(props) => props.inModal ? 6 : 12}px;
  padding-right: ${(props) => props.inModal ? 6 : 12}px;
  background-color: ${(props) => props.inModal ? palette('light', 0) : 'transparent'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-right: 12px;
    padding-left: 12px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    max-width: ${(props) => props.isNarrow ? '960' : (parseInt(props.theme.breakpoints.large, 10) - 30)}px;
  }
  @media print {
    max-width: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
`;
export default Container;

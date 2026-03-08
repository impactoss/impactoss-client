import styled from 'styled-components';
import { palette } from 'styled-theme';

const Container = styled.div`
  flex: ${(props) => props.inModal ? '0 1 auto' : '1'};
  margin-right: auto;
  margin-left: auto;
  margin-top: ${(props) => props.inModal ? 20 : 0}px;
  margin-bottom: ${(props) => props.inModal ? 20 : 0}px;
  width: 100%;
  max-width: 100%;
  padding-bottom: ${(props) => props.noPaddingBottom || props.inModal ? 0 : '3em'};
  padding-left: ${(props) => props.inModal ? 6 : 12}px;
  padding-right: ${(props) => props.inModal ? 6 : 12}px;
  background-color: ${(props) => props.inModal ? palette('light', 0) : 'transparent'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-top: ${(props) => props.inModal ? 60 : 0}px;
    margin-bottom: ${(props) => props.inModal ? 60 : 0}px;
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

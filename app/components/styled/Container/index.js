import styled from 'styled-components';
import { palette } from 'styled-theme';

const Container = styled.div`
  margin-right: auto;
  margin-left: auto;
  max-width: ${(props) => props.isNarrow ? '960px' : '1170px'};
  padding-bottom: ${(props) => props.noPaddingBottom || props.inModal ? 0 : '3em'};
  background-color: ${(props) => props.inModal ? palette('light', 0) : 'transparent'};
`;
export default Container;

import styled from 'styled-components';
import { palette } from 'styled-theme';

const Section = styled.div`
  min-height: 100px;
  padding: 2em 0 4em;
  background-color: ${(props) => props.dark ? palette('secondary', 1) : palette('light', 0)};
  color: ${(props) => props.dark ? palette('light', 2) : 'inherit'};
`;

export default Section;

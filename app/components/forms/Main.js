import styled from 'styled-components';

import Section from './Section';

const Main = styled(Section)`
  width: ${(props) => props.aside ? '70%' : '100%'};
`;

export default Main;

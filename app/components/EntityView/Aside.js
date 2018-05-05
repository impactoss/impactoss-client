import styled from 'styled-components';

import Main from './Main';

const Aside = styled(Main)`
  border-right-style: 'none';
  border-bottom-style: ${(props) => props.bottom ? 'none' : 'solid'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: 30%;
  }
`;

export default Aside;

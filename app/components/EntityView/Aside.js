import styled from 'styled-components';

import Main from './Main';

const Aside = styled(Main)`
  width: 30%;
  border-right-style: 'none';
  border-bottom-style: ${(props) => props.bottom ? 'none' : 'solid'};
`;

export default Aside;

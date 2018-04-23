import styled from 'styled-components';

import Link from './Link';

export default styled(Link)`
  font-size: 0.8em;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 0.9em;
  }
`;

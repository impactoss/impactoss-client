import styled from 'styled-components';

import ListLabel from './ListLabel';

const ConnectionLabel = styled(ListLabel)`
  font-size: 1.2em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1.5em;
  }
`;

export default ConnectionLabel;

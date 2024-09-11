import styled from 'styled-components';

import ListLabel from './ListLabel';

const ConnectionLabel = styled(ListLabel)`
  font-size: 1.2em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1.5em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.larger};
  }
`;

export default ConnectionLabel;

import React from 'react';
import styled from 'styled-components';
import { Box } from 'grommet';

export default styled((p) => <Box justify="center" gap="xxsmall" {...p} />)`
  padding: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 5px 15px;
  }
  @media print {
    padding: 5px 10px;
  }
`;

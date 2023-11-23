import React from 'react';

import styled from 'styled-components';
import {
  Box,
} from 'grommet';

const LayerHeader = styled((p) => (
  <Box
    direction="row"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    background="light-2"
    align="center"
    gap="small"
    justify="between"
    {...p}
  />
))``;

export default LayerHeader;

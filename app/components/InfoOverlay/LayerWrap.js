import React from 'react';

import styled from 'styled-components';
import {
  Box,
} from 'grommet';

const LayerWrap = styled((p) => (
  <Box
    background="white"
    {...p}
  />
))`
min-width: 320px;
min-height: 200px;
overflow-y: auto;
`;


export default LayerWrap;

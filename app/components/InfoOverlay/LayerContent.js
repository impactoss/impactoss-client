import React from 'react';

import styled from 'styled-components';
import {
  Box,
} from 'grommet';

const LayerContent = styled((p) => (
  <Box
    pad={{ horizontal: 'medium', vertical: 'medium' }}
    background="white"
    {...p}
  />
))``;


export default LayerContent;

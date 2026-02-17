import styled from 'styled-components';
import React from 'react';

const ScreenReaderHide = styled(
  (p) => <span tabIndex="-1" role="presentation" aria-hidden {...p} />,
)``;

export default ScreenReaderHide;

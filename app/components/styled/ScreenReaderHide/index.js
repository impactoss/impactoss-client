import styled from 'styled-components';
import React from 'react';

const ScreenReaderHide = styled(
  ({ noTabIndex, ...p }) => (
    <span
      tabIndex={noTabIndex ? undefined : '-1'}
      role="presentation"
      aria-hidden
      {...p}
    />
  ),
)``;

export default ScreenReaderHide;

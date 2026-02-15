import styled from 'styled-components';
import React from 'react';

const ScreenReaderHide = styled((p) => <span inert="" role="presentation" aria-hidden {...p} />)``;

export default ScreenReaderHide;

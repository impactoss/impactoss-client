import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { palette } from 'styled-theme';

const ANIMATION_WIDTH = 20;

const slide = keyframes`
  from { left: -${ANIMATION_WIDTH}%; }
  to { left: 100%; }
`;

const Styled = styled.div`
  display: block;
  width: 100%;
  height: 3px;
  position: relative;
  background-color: ${palette('light', 2)};
  overflow: hidden;
  margin-top: -3px;
  z-index: 2;
`;
const Bar = styled.div`
  display: block;
  height: 3px;
  position: relative;
  background-color: ${palette('primary', 2)};
  left: 0;
  width: ${({ progress }) => progress}%;
`;

const BarIndeterminate = styled.div`
  display: block;
  height: 3px;
  position: relative;
  background-color: ${palette('primary', 2)};
  width: ${ANIMATION_WIDTH}%;
  animation: ${slide} 1.2s linear infinite;
`;

function Loading({ progress = -1 }) {
  return (
    <Styled>
      {progress >= 0
        && <Bar progress={Math.max(Math.round(progress / 5) * 5, 5)} />
      }
      {progress < 0
        && <BarIndeterminate />
      }
    </Styled>
  );
}

Loading.propTypes = {
  progress: PropTypes.number,
};

export default Loading;

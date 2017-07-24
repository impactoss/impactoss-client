import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.div`
  display: block;
  width: 100%
  height: 3px;
  position: relative;
  background-color: ${palette('light', 4)};
`;
const Bar = styled.div`
  display: block;
  width: ${(props) => props.progress}%
  height: 3px;
  position: relative;
  background-color: ${palette('primary', 1)};
`;
const ProgressBar = ({ progress }) => (
  <Styled>
    <Bar progress={progress} />
  </Styled>
);

ProgressBar.propTypes = {
  progress: PropTypes.number,
};

export default ProgressBar;

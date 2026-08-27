/*
 *
 * InfoOverlay
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Box } from 'grommet';
import { CircleInformation } from 'grommet-icons';

import Button from 'components/buttons/Button';

import Overlay from './Overlay';

const StyledButton = styled(Button)`
  color: ${({ colorButton }) => colorButton || palette('dark', 3)};
  stroke: ${({ colorButton }) => colorButton || palette('dark', 3)};
  background-color: transparent;
  border-radius: ${({ round }) => round ? 999 : 0}px;
  &:hover, &:focus-visible {
    color: ${palette('primary', 0)};
    stroke: ${palette('primary', 0)};
    background-color: ${palette('primary', 4)};
  }
  &:focus-visible {
    outline: 1px solid ${palette('primary', 0)};
  }
  width: ${({ round }) => round ? '30px' : 'auto'};
  height: ${({ round }) => round ? '30px' : 'auto'};
  padding: ${({ round }) => round ? 6 : 3}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: ${({ round }) => round ? '36px' : 'auto'};
    height: ${({ round }) => round ? '36px' : 'auto'};
    padding: ${({ round }) => round ? 6 : 3}px;
  }
  @media print {
    display: none;
  }
  svg {
    stroke: inherit;
  }
`;

function InfoOverlay({
  content,
  title,
  padButton = null,
  colorButton,
  round,
  overlayId,
}) {
  const [info, showInfo] = useState(false);
  return (
    <>
      <Box
        pad={padButton || { horizontal: 'small' }}
        flex={{ grow: 0, shrink: 0 }}
        align="center"
        justify="center"
      >
        <StyledButton
          type="button"
          title={title}
          aria-label={title}
          colorButton={colorButton}
          round={round}
          onClick={() => showInfo(!info)}
        >
          <CircleInformation
            size="21px"
            aria-hidden="true"
            aria-label={null}
          />
        </StyledButton>
      </Box>
      {info && (
        <Overlay
          onClose={() => showInfo(false)}
          title={title}
          content={content}
          overlayId={overlayId || 'info-overlay'}
        />
      )}
    </>
  );
}

InfoOverlay.propTypes = {
  round: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  title: PropTypes.string,
  colorButton: PropTypes.string,
  overlayId: PropTypes.string,
  padButton: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default InfoOverlay;

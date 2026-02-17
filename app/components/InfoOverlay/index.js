/* eslint-disable react/no-children-prop */
/*
 *
 * InfoOverlay
 *
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  Box,
  Drop,
} from 'grommet';
import { CircleInformation, CircleQuestion } from 'grommet-icons';

import Button from 'components/buttons/Button';

import Overlay from './Overlay';

const DropContent = styled(({ dropBackground, ...p }) => (
  <Box
    pad="xxsmall"
    background={dropBackground}
    {...p}
  />
))`
  max-width: 280px;
`;

const Markdown = styled(ReactMarkdown)`
  font-size: ${(props) => props.theme.sizes.text.markdownMobile};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.sizes.text.markdown};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.markdown};
  }
`;

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
`;

function InfoOverlay({
  content,
  tooltip,
  title,
  padButton = null,
  colorButton,
  icon,
  markdown,
  inline,
  dropBackground,
  round,
  overlayId,
}) {
  const infoRef = useRef(null);
  const [info, showInfo] = useState(false);
  return (
    <>
      <Box
        as={inline ? 'span' : 'div'}
        fill={false}
        pad={padButton || (inline ? null : { horizontal: 'small' })}
        ref={infoRef}
        flex={inline ? false : { grow: 0, shrink: 0 }}
        style={inline ? { width: 'auto', display: 'inline' } : null}
        align="center"
        justify="center"
      >
        <StyledButton
          onMouseOver={() => tooltip && showInfo(true)}
          onMouseLeave={() => tooltip && showInfo(false)}
          onFocus={() => tooltip && showInfo(true)}
          onBlur={() => null}
          onClick={() => !tooltip && showInfo(!info)}
          title={title}
          colorButton={colorButton}
          round={round}
        >
          {(tooltip || icon === 'question')
            ? (
              <CircleQuestion
                style={{ stroke: 'inherit' }}
                size="21px"
              />
            )
            : (
              <CircleInformation
                style={{ stroke: 'inherit' }}
                size="21px"
              />
            )}
        </StyledButton>
      </Box>
      {info && infoRef && tooltip && (
        <Drop
          align={{ bottom: 'top' }}
          target={infoRef.current}
          plain
        >
          <DropContent dropBackground={dropBackground}>
            {markdown && (
              <div>
                <Markdown
                  children={content}
                  className="react-markdown"
                  rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
                />
              </div>
            )}
            {!markdown && content}
          </DropContent>
        </Drop>
      )}
      {info && !tooltip && (
        <Overlay
          onClose={() => showInfo(false)}
          title={title}
          markdown={markdown}
          content={content}
          overlayId={overlayId || 'info-overlay'}
        />
      )}
    </>
  );
}

InfoOverlay.propTypes = {
  round: PropTypes.bool,
  markdown: PropTypes.bool,
  inline: PropTypes.bool,
  tooltip: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  title: PropTypes.string,
  icon: PropTypes.string,
  dropBackground: PropTypes.string,
  colorButton: PropTypes.string,
  overlayId: PropTypes.string,
  padButton: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default InfoOverlay;

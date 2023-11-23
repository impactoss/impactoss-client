/*
 *
 * InfoOverlay
 *
 */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import styled from 'styled-components';
import {
  Box,
  Button,
  Drop,
} from 'grommet';
import { CircleInformation, CircleQuestion } from 'grommet-icons';

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

function InfoOverlay({
  dark,
  content,
  tooltip,
  title,
  padButton = null,
  colorButton,
  icon,
  markdown,
  inline,
  dropBackground,
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
        <Button
          plain
          icon={
            (tooltip || icon === 'question')
              ? (
                <CircleQuestion
                  color={colorButton || (dark ? 'light-5' : 'dark-5')}
                  size="21px"
                />
              )
              : (
                <CircleInformation
                  color={colorButton || (dark ? 'light-5' : 'dark-5')}
                  size="21px"
                />
              )
          }
          fill={false}
          onMouseOver={() => tooltip && showInfo(true)}
          onMouseLeave={() => tooltip && showInfo(false)}
          onFocus={() => tooltip && showInfo(true)}
          onBlur={() => null}
          onClick={() => !tooltip && showInfo(!info)}
        />
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
                <Markdown source={content} className="react-markdown" linkTarget="_blank" />
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
        />
      )}
    </>
  );
}

InfoOverlay.propTypes = {
  dark: PropTypes.bool,
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
  padButton: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default InfoOverlay;

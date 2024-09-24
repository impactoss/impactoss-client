/*
 *
 * Overlay
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { palette } from 'styled-theme';

import styled from 'styled-components';
import {
  Box,
  Button,
  Layer,
  Text,
} from 'grommet';
import { FormClose } from 'grommet-icons';

import Loading from 'components/Loading';

import LayerHeader from './LayerHeader';
import LayerWrap from './LayerWrap';
import LayerContent from './LayerContent';

const Markdown = styled(ReactMarkdown)`
  font-size: ${(props) => props.theme.sizes.text.markdownMobile};
  a:focus-visible { 
    outline: none !important;
    text-decoration: underline;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.sizes.text.markdown};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.markdown};
  }
`;
const StyledButton = styled((p) => <Button {...p} />)`
  &:focus {
    box-shadow: none;
  }
  &:focus-visible {
    color: ${palette('primary', 0)};
    outline: 2px solid  ${palette('primary', 0)};
    border-radius: 0.5em;
    outline-offset: 2px;
    svg {
      stroke: ${palette('primary', 0)};
    }
  }
`;
function Overlay({
  onClose,
  title,
  markdown,
  content,
  loading,
}) {
  return (
    <Layer
      onEsc={onClose}
      onClickOutside={onClose}
      margin={{ top: 'large' }}
      position="top"
      animate={false}
    >
      <LayerWrap>
        <LayerHeader flex={{ grow: 0, shrink: 0 }}>
          <Box>
            {title && (
              <Text weight={600}>{title}</Text>
            )}
          </Box>
          {onClose && (
            <Box flex={{ grow: 0 }}>
              <StyledButton plain icon={<FormClose size="medium" />} onClick={onClose} />
            </Box>
          )}
        </LayerHeader>
        {loading && <Loading />}
        <LayerContent flex={{ grow: 1 }}>
          <div>
            {markdown && (
              <Markdown source={content} className="react-markdown" linkTarget="_blank" />
            )}
            {!markdown && content}
          </div>
        </LayerContent>
      </LayerWrap>
    </Layer>
  );
}

Overlay.propTypes = {
  markdown: PropTypes.bool,
  loading: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  onClose: PropTypes.func,
  title: PropTypes.string,
};

export default Overlay;

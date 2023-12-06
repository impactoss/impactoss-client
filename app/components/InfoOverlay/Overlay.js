/*
 *
 * Overlay
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

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
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.sizes.text.markdown};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.markdown};
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
              <Button plain icon={<FormClose size="medium" />} onClick={onClose} />
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

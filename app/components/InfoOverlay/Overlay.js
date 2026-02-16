/* eslint-disable react/no-children-prop */
/*
 *
 * Overlay
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import { palette } from 'styled-theme';
import { injectIntl } from 'react-intl';

import styled from 'styled-components';
import { Box, Text } from 'grommet';
import ReactModal from 'react-modal';

import Icon from 'components/Icon';
import ButtonDefaultIconOnly from 'components/buttons/ButtonDefaultIconOnly';

import Loading from 'components/Loading';
import appMessages from 'containers/App/messages';

// import LayerHeader from './LayerHeader';
// import LayerWrap from './LayerWrap';
// import LayerContent from './LayerContent';
const CloseButton = styled((p) => <ButtonDefaultIconOnly {...p} />)``;

const StyledContainer = styled((p) => <Box {...p} />)`
  padding-bottom: 0px;
`;
const StyledTitle = styled(Text)`
  text-transform: uppercase;
  color: ${palette('text', 0)};
`;
const TitleWrapper = styled((p) => <Box {...p} />)`
  fill: ${palette('text', 0)};
`;

const Markdown = styled(ReactMarkdown)`
  color: ${palette('text', 0)};
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
  intl,
  overlayId = 'overlay-info',
}) {
  const titleId = `${overlayId}-dialog-title`;

  return (
    <ReactModal
      isOpen
      appElement={document.getElementById('app')}
      onRequestClose={onClose}
      aria={{
        labelledby: titleId,
      }}
      className="overlay-modal"
      overlayClassName="overlay-modal-overlay"
      style={{
        overlay: { zIndex: 99999999 },
      }}
    >
      <Box background="white" pad="large" round="small">
        <StyledContainer>
          <Box
            direction="row"
            justify="between"
            margin={{ bottom: 'medium' }}
            align="center"
          >
            <TitleWrapper direction="row" gap="small">
              <StyledTitle
                id={titleId}
                role="heading"
                aria-level="2"
                size="large"
                weight="bold"
              >
                {title}
              </StyledTitle>
            </TitleWrapper>
            {onClose && (
              <Box>
                <CloseButton
                  onClick={onClose}
                  aria-label={intl.formatMessage(appMessages.buttons.close)}
                  title={intl.formatMessage(appMessages.buttons.close)}
                >
                  <Icon name="close" />
                </CloseButton>
              </Box>
            )}
          </Box>
          {loading && <Loading />}
          <Box flex={{ grow: 1 }}>
            <div>
              {markdown && (
                <Markdown
                  children={content}
                  className="react-markdown"
                  rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
                />
              )}
              {!markdown && content}
            </div>
          </Box>
        </StyledContainer>
      </Box>
    </ReactModal>
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
  overlayId: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(Overlay);

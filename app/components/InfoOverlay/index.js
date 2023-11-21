/*
 *
 * InfoOverlay
 *
 */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const ButtonWrapper = styled.div.attrs(({ as }) => ({
  as,
}))``;

const IconWrapper = styled.span``;

const ContentWrapper = styled.div`
width: 50%;
min-width: 320px;
min-height: 200px;
overflow-y: auto;
background: white;
`;
const LayerWrap = styled((p) => (<div {...p} />))`
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 102;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
`;

const LayerHeader = styled.div`
display: flex;
flex-direction: row;
padding: 12px 12px 12px 24px;
background: ${() => palette('background', 1)};
gap: 5px;
justify-content: between;
align-content: center;
flex: 0;
`;

const LayerContent = styled.div`
padding: 24px;
background: white;
flex: 1;
`;

const Markdown = styled(ReactMarkdown)`
font-size: ${({ theme }) => theme.sizes.text.markdownMobile};
@media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
  font-size: ${({ theme }) => theme.sizes.text.markdown};
}
@media print {
 font-size: ${({ theme }) => theme.sizes.print.markdown};
}
`;

const CloseButtonWrapper = styled.div`
display: flex;
flex-grow: 1;
justify-content: end;
`;
const HeaderTitle = styled.span`
font-size: 16px;
line-height: 21px;
font-weight: 600;
`;

function InfoOverlay({
  content,
  tooltip,
  title,
  padButton = null,
  icon,
  markdown,
  inline,
}) {
  const infoRef = useRef(null);
  const [info, showInfo] = useState(false);

  return (
    <>
      <ButtonWrapper
        as={inline ? 'span' : 'div'}
        pad={padButton || (inline ? null : { horizontal: 'small' })}
        ref={infoRef}
        flex={inline ? false : { grow: 0, shrink: 0 }}
        style={inline ? { width: 'auto', display: 'inline-block' } : null}
      >
        <IconWrapper
          tabindex={0}
          onClick={() => !tooltip && showInfo(!info)}
        >
          <Icon
            color={palette('text', 1)}
            name={(tooltip || icon === 'question') ? 'question' : 'info'}
            size="16px"
          />
        </IconWrapper>
      </ButtonWrapper>
      {info ? (
        <LayerWrap onClick={() => showInfo(false)}>
          <ContentWrapper onClick={(event) => event.stopPropagation()}>
            <LayerHeader>
              <div>
                {title && (<HeaderTitle>{title}</HeaderTitle>)}
              </div>
              <CloseButtonWrapper>
                <Button onClick={() => showInfo(false)}>
                  <Icon name="close" size="24px" />
                </Button>
              </CloseButtonWrapper>
            </LayerHeader>
            <LayerContent>
              <div>
                {markdown && (
                  <Markdown source={content} className="react-markdown" linkTarget="_blank" />
                )}
                {!markdown && content}
              </div>
            </LayerContent>
          </ContentWrapper>
        </LayerWrap>
      )
        : null}
    </>
  );
}

InfoOverlay.propTypes = {
  markdown: PropTypes.bool,
  inline: PropTypes.bool,
  tooltip: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  title: PropTypes.string,
  icon: PropTypes.string,
  padButton: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default InfoOverlay;

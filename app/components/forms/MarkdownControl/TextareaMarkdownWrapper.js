import React, {
  useRef, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { palette } from 'styled-theme';
import styled, { withTheme } from 'styled-components';

import Icon from 'components/Icon';
import TextareaMarkdown from 'textarea-markdown-editor';
import MarkdownField from 'components/fields/MarkdownField';
import InfoOverlay from 'components/InfoOverlay';
import A from 'components/styled/A';
import MarkdownButton from './MarkdownButton';
import messages from './messages';

const MIN_TEXTAREA_HEIGHT = 320;

const MarkdownHint = styled.div`
text-align: right;
color: ${palette('text', 1)};
font-size: 0.85em;
@media print {
font-size: ${({ theme }) => theme.sizes.print.smaller};
}`;

const StyledTextareaMarkdown = styled(
  React.forwardRef((p, ref) => <TextareaMarkdown ref={ref} {...p} />)
)`
background-color: ${palette('background', 0)};
width: 100%;
border: 1px solid ${palette('light', 1)};
padding: 0.7em;
border-radius: 0.5em;
color: ${palette('text', 0)};
min-height: ${MIN_TEXTAREA_HEIGHT}px;
resize: none;
`;

const Preview = styled((p) => <div {...p} />)`
background-color: ${palette('background', 0)};
width: 100%;
border: 1px solid ${palette('light', 1)};
padding: 0.7em;
color: ${palette('text', 0)};
min-height: ${MIN_TEXTAREA_HEIGHT}px;
`;

const ViewButton = styled.button`
background: none;
opacity: ${({ active }) => active ? 1 : 0.6};
border-bottom: 3px solid;
border-bottom-color: ${({ active, theme }) => active ? theme.palette.linkHover[0] : 'transparent'};
&:hover {
opacity: 0.8;
border-bottom-color: ${palette('light', 2)};
}`;

const MDButtonText = styled((p) => (
  <TextLabel weight="bold" {...p} />
))`
position: relative;
top: -2px;
`;
const ComponentWrapper = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin: 5px 0px;
`;
const ActionButtonsWrapper = styled.div`
display: flex;
flex-direction: row;
gap: 5px; 
align-items: center;
`;
const EditorButtonsWrapper = styled.div`
display: flex;
flex-direction: row; 
align-items: center; 
gap: 2px;
`;
const InnerWrapper = styled.div`
margin-right: 2px;
`;
const FormatTextWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 8px;
`;
const TextLabel = styled.p`
font-weight: ${({ weight }) => weight || '400'};
color:${({ color }) => color ? palette('text', 1) : 'black'};
font-size:${({ size }) => size === 'xsmall' ? ' 0.85em' : '1em'};
margin: 0px;
`;

function TextareaMarkdownWrapper(props) {
  const { value, intl, theme } = props;
  const textareaRef = useRef(null);
  const [view, setView] = useState('write');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight
        + 20, MIN_TEXTAREA_HEIGHT)} px`;
    }
  });
  const mdDisabled = view !== 'write';
  return (
    <div>
      <ComponentWrapper>
        <ActionButtonsWrapper>
          <ViewButton
            onClick={() => setView('write')}
            active={view === 'write'}
          >
            Write
          </ViewButton>
          <ViewButton
            onClick={() => setView('preview')}
            active={view === 'preview'}
          >
            Preview
          </ViewButton>
        </ActionButtonsWrapper>
        <EditorButtonsWrapper>
          <InnerWrapper>
            <FormatTextWrapper>
              <TextLabel size="small" color="hint">Format text</TextLabel>
              <InfoOverlay
                colorButton={theme.palette.link[0]}
                inline
                title="Format text using markdown"
                content={(
                  <div>
                    <p>
                      <TextLabel size="small">
                        {'This text field supports basic formatting using markdown, incuding section headings, '}
                        <strong>**bold**</strong>
                        {', '}
                        <em>_italic_</em>
                        , links, and more.
                      </TextLabel>
                    </p>
                    <p>
                      <TextLabel size="small">
                        You can either directly type markdown code or use one of the format buttons above the text area to insert it, by either
                      </TextLabel>
                    </p>
                    <ul>
                      <li>
                        <TextLabel size="small">
                          first clicking one of the buttons and then replace the generated placeholder text, or
                        </TextLabel>
                      </li>
                      <li>
                        <TextLabel size="small">
                          first select some existing text and then apply a format using one the buttons.
                        </TextLabel>
                      </li>
                    </ul>
                    <p>
                      <TextLabel size="small">
                        {'You can learn more about '}
                        <A
                          href={intl.formatMessage(messages.url)}
                          target="_blank"
                          isOnLightBackground
                        >
                          markdown and additional formatting options here
                        </A>
                        .
                      </TextLabel>
                    </p>
                  </div>
                )}
              />
            </FormatTextWrapper>
          </InnerWrapper>
          <MarkdownButton
            title="## Heading"
            disabled={mdDisabled}
            onClick={() => {
              if (!mdDisabled && textareaRef.current) {
                textareaRef.current.trigger('h2');
              }
            }}
            label={<MDButtonText>H2</MDButtonText>}
          >
          </MarkdownButton>
          <MarkdownButton
            title="### Secondary heading"
            disabled={mdDisabled}
            onClick={() => {
              if (!mdDisabled && textareaRef.current) {
                textareaRef.current.trigger('h3');
              }
            }}
            label={<MDButtonText>H3</MDButtonText>}
          >
          </MarkdownButton>
          <MarkdownButton
            title="Bold: **bold**"
            disabled={mdDisabled}
            onClick={() => {
              if (!mdDisabled && textareaRef.current) {
                textareaRef.current.trigger('bold');
              }
            }}
            icon={<Icon name="calendar" text />}
          />
          <MarkdownButton
            title="Italic: _italic_"
            disabled={mdDisabled}
            onClick={() => {
              if (!mdDisabled && textareaRef.current) {
                textareaRef.current.trigger('italic');
              }
            }}
            icon={<Icon name="calendar" />}
          />
          <MarkdownButton
            title="Link: (text)[url]"
            disabled={mdDisabled}
            onClick={() => {
              if (!mdDisabled && textareaRef.current) {
                textareaRef.current.trigger('link');
              }
            }}
            icon={<Icon name="calendar" />}
          />
          <MarkdownButton
            title="Unordered list: -"
            disabled={mdDisabled}
            onClick={() => {
              if (!mdDisabled && textareaRef.current) {
                textareaRef.current.trigger('unordered-list');
              }
            }}
            icon={<Icon name="calendar" />}
          />
          <MarkdownButton
            title="Ordered list: 1."
            disabled={mdDisabled}
            onClick={() => {
              if (!mdDisabled && textareaRef.current) {
                textareaRef.current.trigger('ordered-list');
              }
            }}
            label={
              <MDButtonText size="xxsmall">123</MDButtonText>
            }
          >
          </MarkdownButton>
        </EditorButtonsWrapper>
      </ComponentWrapper>
      {view === 'preview' && (
        <Preview>
          <MarkdownField field={{ value }} />
        </Preview>
      )}
      {view === 'write' && (
        <div>
          <StyledTextareaMarkdown
            ref={textareaRef}
            options={{
              preferredItalicSyntax: '_',
            }}
            {...props}
          />
          <MarkdownHint>
            <A
              href={intl.formatMessage(messages.url)}
              target="_blank"
              isOnLightBackground
            >
              {intl.formatMessage(messages.anchor)}
            </A>
          </MarkdownHint>
        </div>
      )}
    </div>
  );
}

TextareaMarkdownWrapper.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  intl: intlShape,
  theme: PropTypes.object,
};

export default injectIntl(withTheme(TextareaMarkdownWrapper));

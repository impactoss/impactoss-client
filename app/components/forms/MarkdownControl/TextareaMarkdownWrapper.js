import React, {
  useRef, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { palette } from 'styled-theme';
import styled, { withTheme } from 'styled-components';
import { Box, Text, Button } from 'grommet';

import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
} from 'grommet-icons';

import TextareaMarkdown from 'textarea-markdown-editor';
import MarkdownField from 'components/fields/MarkdownField';
import InfoOverlay from 'components/InfoOverlay';
import A from 'components/styled/A';
import messages from './messages';

const MIN_TEXTAREA_HEIGHT = 320;

const MarkdownHint = styled.div`
  text-align: right;
  color: ${palette('text', 1)};
  font-size: 0.85em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

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
  resize: "none";
`;
const Preview = styled((p) => <Box {...p} />)`
  background-color: ${palette('background', 0)};
  width: 100%;
  border: 1px solid ${palette('light', 1)};
  padding: 0.7em;
  color: ${palette('text', 0)};
  min-height: ${MIN_TEXTAREA_HEIGHT}px;
`;

const MDButton = styled((p) => (
  <Button
    plain
    as="div"
    {...p}
  />
))`
  min-width: 30px;
  min-height: 30px;
  text-align: center;
  padding: 4px 7px;
  &:hover {
    background-color: ${({ disabled }) => disabled ? 'transparent' : palette('light', 2)};
  }
`;
const ViewButton = styled((p) => (
  <Button
    plain
    {...p}
  />
))`
  background: none;
  opacity: ${({ active }) => active ? 1 : 0.6};
  border-bottom: 3px solid;
  border-bottom-color: ${(
    { active, theme }
  ) => active ? theme.global.colors.aHover : 'transparent'
};
  &:hover {
    opacity: 0.8;
    border-bottom-color: ${palette('light', 2)};
  }
`;
const MDButtonText = styled((p) => (
  <Text weight="bold" size="medium" {...p} />
))`
  position: relative;
  top: -1px;
`;

function TextareaMarkdownWrapper(props) {
  const { value, intl, theme } = props;
  const textareaRef = useRef(null);
  const [view, setView] = useState('write');
  // const [hasFocus, setHasFocus] = useState(false);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${
        Math.max(textareaRef.current.scrollHeight + 20, MIN_TEXTAREA_HEIGHT)
      }px`;
    }
    // has textarea focus?
    // setHasFocus(document.activeElement === textareaRef.current);
  });
  const mdDisabled = view !== 'write';
  return (
    <Box>
      <Box direction="row" justify="between" align="center" margin={{ vertical: 'small' }} wrap>
        <Box direction="row" gap="small" align="center">
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
        </Box>
        <Box direction="row" align="center" gap="xsmall" wrap justify="end">
          <Box direction="row" align="center" gap="xsmall" justify="end">
            <Box fill="vertical">
              <Text size="xsmall" color="hint">Format text</Text>
            </Box>
            <Box>
              <InfoOverlay
                title="Format text using markdown"
                colorButton={theme.global.colors.hint}
                padButton="none"
                content={(
                  <div>
                    <p>
                      <Text size="small">
                        {'This text field supports basic formatting using markdown, incuding section headings, '}
                        <strong>**bold**</strong>
                        {', '}
                        <em>_italic_</em>
                        , links, and more.
                      </Text>
                    </p>
                    <p>
                      <Text size="small">
                        You can either directly type markdown code or use one of the format buttons above the text area to insert it, by either
                      </Text>
                    </p>
                    <ul>
                      <li>
                        <Text size="small">
                          first clicking one of the buttons and then replace the generated placeholder text, or
                        </Text>
                      </li>
                      <li>
                        <Text size="small">
                          first select some existing text and then apply a format using one the buttons.
                        </Text>
                      </li>
                    </ul>
                    <p>
                      <Text size="small">
                        {'You can learn more about '}
                        <A
                          href={intl.formatMessage(messages.url)}
                          target="_blank"
                          isOnLightBackground
                        >
                          markdown and additional formatting options here
                        </A>
                        .
                      </Text>
                    </p>
                  </div>
                )}
              />
            </Box>
          </Box>
          <Box direction="row" align="center" gap="hair" justify="end">
            <MDButton
              title="## Heading"
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('h2');
                }
              }}
            >
              <MDButtonText>H2</MDButtonText>
            </MDButton>
            <MDButton
              title="### Secondary heading"
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('h3');
                }
              }}
            >
              <MDButtonText>H3</MDButtonText>
            </MDButton>
            <MDButton
              title="Bold: **bold**"
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('bold');
                }
              }}
              icon={<Bold size="xsmall" />}
            />
            <MDButton
              title="Italic: _italic_"
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('italic');
                }
              }}
              icon={<Italic size="xsmall" />}
            />
            <MDButton
              title="Link: (text)[url]"
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('link');
                }
              }}
              icon={<LinkIcon size="18px" />}
            />
            <MDButton
              title="Unordered list: -"
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('unordered-list');
                }
              }}
              icon={<List size="xsmall" />}
            />
            <MDButton
              title="Ordered list: 1."
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('ordered-list');
                }
              }}
            >
              <MDButtonText size="xxsmall" style={{ top: '-4px' }}>123</MDButtonText>
            </MDButton>
          </Box>
        </Box>
      </Box>
      {view === 'preview' && (
        <Preview>
          <MarkdownField field={{ value }} />
        </Preview>
      )}
      {view === 'write' && (
        <Box>
          <StyledTextareaMarkdown
            ref={textareaRef}
            options={{
              preferredItalicSyntax: '_',
              linkTextPlaceholder: 'link-title',
              linkUrlPlaceholder: 'https://link-url.ext',
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
        </Box>
      )}
    </Box>
  );
}

TextareaMarkdownWrapper.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  intl: intlShape,
  theme: PropTypes.object,
};

export default injectIntl(withTheme(TextareaMarkdownWrapper));

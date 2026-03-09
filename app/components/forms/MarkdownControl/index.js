import React, {
  useRef, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
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
  React.forwardRef((p, ref) => <TextareaMarkdown ref={ref} {...p} />),
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

const MDButton = styled(React.forwardRef((p, ref) => (
  <Button plain ref={ref} {...p} />
)))`
  min-width: 30px;
  min-height: 30px;
  text-align: center;
  padding: 4px 7px;
  &:hover, &:focus-visible {
    background-color: #fff;
  }
  &:focus-visible {
    outline: 1px solid #0065BD;
  }
  &:focus {
    box-shadow: none;
  }
`;
const ViewButton = styled((p) => (
  <Button plain {...p} />
))`
  background: none;
  border-bottom: 3px solid;
  border-bottom-color: ${({ active }) => active ? palette('primary', 1) : 'transparent'};
  color: ${({ active }) => active ? palette('primary', 1) : palette('text', 1)};
  &:hover, &:focus-visible {
    border-bottom-color: ${({ active }) => active ? palette('primary', 0) : palette('text', 1)};
    color: ${({ active }) => active ? palette('primary', 1) : palette('text', 1)};
  }
  &:focus-visible {
    outline: 1px solid #0065BD;
  }
  &:focus {
    box-shadow: none;
  }
`;
const MDButtonText = styled((p) => (
  <Text weight="bold" size="medium" {...p} />
))``;

const MD_BUTTONS_COUNT = 7;

function MarkdownControl(props) {
  const { value, theme } = props;
  const intl = useIntl();
  const textareaRef = useRef(null);
  const mdButtonRefs = useRef([]);
  const [view, setView] = useState('write');
  const [mdButtonIndex, setMdButtonIndex] = useState(0);

  const handleKeyDown = (e) => {
    let newIndex;
    if (e.key === 'ArrowRight') {
      newIndex = (mdButtonIndex + 1) % MD_BUTTONS_COUNT;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (mdButtonIndex - 1 + MD_BUTTONS_COUNT) % MD_BUTTONS_COUNT;
    } else {
      return;
    }
    e.preventDefault();
    setMdButtonIndex(newIndex);
    const ref = mdButtonRefs.current[newIndex];
    if (ref) ref.focus();
  };
  // const [hasFocus, setHasFocus] = useState(false);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight + 20, MIN_TEXTAREA_HEIGHT)}px`;
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
            <FormattedMessage {...messages.writeLabel} />
          </ViewButton>
          <ViewButton
            onClick={() => setView('preview')}
            active={view === 'preview'}
          >
            <FormattedMessage {...messages.previewLabel} />
          </ViewButton>
        </Box>
        <Box direction="row" align="center" gap="xsmall" wrap justify="end">
          <Box direction="row" align="center" gap="xsmall" justify="end">
            <Box fill="vertical">
              <Text size="xsmall" color="hint">
                <FormattedMessage {...messages.formatTextLabel} />
              </Text>
            </Box>
            <Box>
              <InfoOverlay
                title={intl.formatMessage(messages.infoOverlayTitle)}
                colorButton={theme.global.colors.hint}
                padButton="none"
                overlayId="markdown-help"
                round
                content={(
                  <div>
                    <p>
                      <Text size="small">
                        <FormattedMessage
                          {...messages.infoOverlayFirstSection}
                          values={
                            {
                              strong: <strong>bold</strong>,
                              italic: <em>_italic_</em>,
                            }
                          }
                        />
                      </Text>
                    </p>
                    <p>
                      <Text size="small">
                        <FormattedMessage {...messages.infoOverlaySecondSection} />
                      </Text>
                    </p>
                    <ul>
                      <li>
                        <Text size="small">
                          <FormattedMessage {...messages.infoOverlayThirdSection} />
                        </Text>
                      </li>
                      <li>
                        <Text size="small">
                          <FormattedMessage {...messages.infoOverlayFourthSection} />
                        </Text>
                      </li>
                    </ul>
                    <p>
                      <Text size="small">
                        <FormattedMessage
                          {...messages.infoOverlayFifthSection}
                          values={{
                            link:
                              <A
                                href={intl.formatMessage(messages.url)}
                                target="_blank"
                              >
                                <FormattedMessage {...messages.infoOverlaySixthSection} />
                              </A>,
                          }}
                        />
                      </Text>
                    </p>
                  </div>
                )}
              />
            </Box>
          </Box>
          <Box
            direction="row"
            align="center"
            gap="hair"
            justify="end"
            role="toolbar"
            aria-label="Markdown text formatting"
            onKeyDown={handleKeyDown}
          >
            <MDButton
              title={intl.formatMessage(messages.buttonTitleHeading2)}
              aria-label={intl.formatMessage(messages.buttonTitleHeading2)}
              disabled={mdDisabled}
              tabIndex={mdButtonIndex === 0 ? 0 : -1}
              ref={(el) => { mdButtonRefs.current[0] = el; }}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('h2');
                }
              }}
            >
              <MDButtonText aria-hidden="true">H2</MDButtonText>
            </MDButton>
            <MDButton
              title={intl.formatMessage(messages.buttonTitleHeading3)}
              aria-label={intl.formatMessage(messages.buttonTitleHeading3)}
              tabIndex={mdButtonIndex === 1 ? 0 : -1}
              ref={(el) => { mdButtonRefs.current[1] = el; }}
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('h3');
                }
              }}
            >
              <MDButtonText aria-hidden="true">H3</MDButtonText>
            </MDButton>
            <MDButton
              title={intl.formatMessage(messages.buttonTitleBold)}
              aria-label={intl.formatMessage(messages.buttonTitleBold)}
              tabIndex={mdButtonIndex === 2 ? 0 : -1}
              ref={(el) => { mdButtonRefs.current[2] = el; }}
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('bold');
                }
              }}
              icon={(
                <Bold
                  size="xsmall"
                  aria-hidden="true"
                  aria-label={null}
                  color="text"
                />
              )}
            />
            <MDButton
              title={intl.formatMessage(messages.buttonTitleItalic)}
              aria-label={intl.formatMessage(messages.buttonTitleItalic)}
              ref={(el) => { mdButtonRefs.current[3] = el; }}
              tabIndex={mdButtonIndex === 3 ? 0 : -1}
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('italic');
                }
              }}
              icon={(
                <Italic
                  size="xsmall"
                  aria-hidden="true"
                  aria-label={null}
                  color="text"
                />
              )}
            />
            <MDButton
              title={intl.formatMessage(messages.buttonTitleLink)}
              aria-label={intl.formatMessage(messages.buttonTitleLink)}
              tabIndex={mdButtonIndex === 4 ? 0 : -1}
              ref={(el) => { mdButtonRefs.current[4] = el; }}
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('link');
                }
              }}
              icon={(
                <LinkIcon
                  size="xsmall"
                  aria-hidden="true"
                  aria-label={null}
                  color="text"
                />
              )}
            />
            <MDButton
              title={intl.formatMessage(messages.buttonTitleUnorderedList)}
              aria-label={intl.formatMessage(messages.buttonTitleUnorderedList)}
              tabIndex={mdButtonIndex === 5 ? 0 : -1}
              ref={(el) => { mdButtonRefs.current[5] = el; }}
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('unordered-list');
                }
              }}
              icon={(
                <List
                  size="xsmall"
                  aria-hidden="true"
                  aria-label={null}
                  color="text"
                />
              )}
            />
            <MDButton
              title={intl.formatMessage(messages.buttonTitleOrderedList)}
              aria-label={intl.formatMessage(messages.buttonTitleOrderedList)}
              tabIndex={mdButtonIndex === 6 ? 0 : -1}
              ref={(el) => { mdButtonRefs.current[6] = el; }}
              disabled={mdDisabled}
              onClick={() => {
                if (!mdDisabled && textareaRef.current) {
                  textareaRef.current.trigger('ordered-list');
                }
              }}
            >
              <MDButtonText
                size="xxsmall"
                style={{ position: 'relative', top: '-1px' }}
                aria-hidden="true"
              >
                123
              </MDButtonText>
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
              enableIndentExtension: false,
            }}
            {...props}
          />
          <MarkdownHint>
            <A
              href={intl.formatMessage(messages.url)}
              target="_blank"
              isOnLightBackground
            >
              <FormattedMessage {...messages.anchor} />
            </A>
          </MarkdownHint>
        </Box>
      )}
    </Box>
  );
}

MarkdownControl.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  theme: PropTypes.object,
};

export default withTheme(MarkdownControl);

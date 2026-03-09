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

import TurndownService from 'turndown';
import DOMPurify from 'dompurify';
import TextareaMarkdown from 'textarea-markdown-editor';

import MarkdownField from 'components/fields/MarkdownField';
import InfoOverlay from 'components/InfoOverlay';
import A from 'components/styled/A';
import messages from './messages';

const MIN_TEXTAREA_HEIGHT = 320;
const MAX_TEXTAREA_HEIGHT = 640;

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
  max-height: ${MAX_TEXTAREA_HEIGHT}px;
  overflow-y: auto;
`;
const Preview = styled((p) => <Box {...p} />)`
  background-color: ${palette('background', 0)};
  width: 100%;
  border: 1px solid ${palette('light', 1)};
  padding: 0.7em;
  color: ${palette('text', 0)};
  min-height: ${MIN_TEXTAREA_HEIGHT}px;
  max-height: ${MAX_TEXTAREA_HEIGHT}px;
  overflow-y: auto;
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


const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

// custom rule to ignore <b> tags that are styled to be NOT bold (Google Doc issue)
turndownService.addRule(
  'nonBoldB', {
    filter: (node) => (
      node.nodeName === 'B'
      && node.getAttribute('style')
      && node.getAttribute('style').includes('font-weight:normal')
    ),
    replacement: (content) => content, // don't wrap in **
  },
);
// custom rule to catch span tags with inline bold styling (Google Doc issue)
turndownService.addRule('boldSpan', {
  filter: (node) => {
    if (node.nodeName !== 'SPAN') return false;
    const style = node.getAttribute('style') ? node.getAttribute('style').toLowerCase() : '';
    return style.includes('font-weight:bold') || style.includes('font-weight:700') || style.includes('font-weight:600');
  },
  replacement: (content) => `**${content}**`,
});
// custom rule to catch span tags with inline italic styling (Google Doc issue)
turndownService.addRule('italicSpan', {
  filter: (node) => {
    if (node.nodeName !== 'SPAN') return false;
    const style = node.getAttribute('style') ? node.getAttribute('style').toLowerCase() : '';
    return style.includes('font-style:italic');
  },
  replacement: (content) => `_${content}_`,
});

// from https://github.com/alphagov/paste-html-to-govspeak/pull/42/files
turndownService.addRule('removeWordListBullets', {
  filter: (node) => {
    if (node.nodeName.toLowerCase() === 'span') {
      const style = node.getAttribute('style');
      return style ? style.match(/mso-list:ignore/i) : false;
    }
    return false;
  },
  replacement: () => '',
});

// from https://github.com/alphagov/paste-html-to-govspeak/pull/42/files
turndownService.addRule('addWordListItem', {
  filter: (node) => {
    if (node.nodeName.toLowerCase() !== 'p') {
      return false;
    }

    return node.className.match(/msolistparagraphcxsp/i);
  },
  replacement: (content, node, options) => {
    // the first item in a list (nested or otherwise) has first in the class
    // name
    let prefix = node.className.match(/first/i) ? '\n\n' : '';

    const getLevel = (element) => {
      const style = element.getAttribute('style');
      const levelMatch = style ? style.match(/level(\d+)/) : null;
      return levelMatch ? parseInt(levelMatch[1], 10) : 0;
    };
    // we can determine the nesting of a list by a mso-list style attribute
    // with a level
    const nodeLevel = getLevel(node);
    /* eslint-disable no-plusplus */
    for (let i = 1; i < nodeLevel; i++) {
      prefix += options.listIndent;
    }
    /* eslint-enable no-plusplus */

    // the last item in a list has last in the class name
    const suffix = node.className.match(/last/i) ? '\n\n' : '\n';

    let listMarker = options.bulletListMarker;
    const markerElement = node.querySelector('span[style="mso-list:Ignore"]');

    // assume the presence of a period in a marker is an indicator of an
    // ordered list
    if (markerElement && markerElement.textContent.match(/\./)) {
      let item = 1;
      let potentialListItem = node.previousElementSibling;
      // loop through previous siblings to count list items
      while (potentialListItem && potentialListItem.className.match(/msolistparagraphcxsp/i)) {
        const itemLevel = getLevel(potentialListItem);

        // if we encounter the lists parent we've reached the end of counting
        if (itemLevel < nodeLevel) {
          break;
        }

        // if on same level increment the list items
        if (nodeLevel === itemLevel) {
          item += 1;
        }

        potentialListItem = potentialListItem.previousElementSibling;
      }

      listMarker = `${item}.`;
    }

    return `${prefix}${listMarker} ${content.trim()}${suffix}`;
  },
});

turndownService.addRule('linkNoTitle', {
  filter: 'a',
  replacement: (content, node) => {
    const href = node.getAttribute('href');
    if (!href) return content;
    return `[${content}](${href})`;
  },
});

function MarkdownControl(props) {
  const { value, theme, onChange } = props;
  const intl = useIntl();
  const textareaRef = useRef(null);
  const mdButtonRefs = useRef([]);
  const [view, setView] = useState('write');
  const [scrollTop, setScrollTop] = useState(0);
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
      textareaRef.current.scrollTop = scrollTop;
    }
  });
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.scrollTop !== scrollTop) {
      textareaRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);
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
            commands={[
              {
                name: 'strike-through',
                shortcut: ['command+shift+x', 'ctrl+shift+x'],
                shortcutPreventDefault: true,
                enable: false,
              },
            ]}
            onScroll={(e) => {
              setScrollTop((e.target && e.target.scrollTop) || 0);
            }}
            onChange={(e) => {
              onChange(e);
              requestAnimationFrame(() => {
                const scroll = textareaRef.current && textareaRef.current.scrollTop;
                if (scroll !== scrollTop) {
                  if (scroll !== 0) {
                    setScrollTop(scroll);
                  } else {
                    setScrollTop(scrollTop);
                  }
                }
              });
            }}
            onPaste={(e) => {
              const html = e.clipboardData.getData('text/html');
              if (html) {
                e.preventDefault();
                const cleanHtml = DOMPurify.sanitize(html);
                const markdown = turndownService.turndown(cleanHtml);
                document.execCommand('insertText', false, markdown);
                // wait until re-rendered
              }
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

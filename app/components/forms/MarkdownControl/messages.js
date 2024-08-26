/*
 * MarkdownControl Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  anchor: {
    id: 'app.components.MarkdownControl.anchor',
    defaultMessage: 'Learn more about markdown format options here',
  },
  url: {
    id: 'app.components.MarkdownControl.url',
    defaultMessage: 'http://commonmark.org/help/',
  },
  hint: {
    id: 'app.components.MarkdownControl.hint',
    defaultMessage: ' ## Subheader, **bold**, _italic_',
  },
  writeLabel: {
    id: 'app.components.MarkdownControl.writeLabel',
    defaultMessage: 'Write',
  },
  previewLabel: {
    id: 'app.components.MarkdownControl.previewLabel',
    defaultMessage: 'Preview',
  },
  formatTextLabel: {
    id: 'app.components.MarkdownControl.formatTextLabel',
    defaultMessage: 'Format Text',
  },
  infoOverlayTitle: {
    id: 'app.components.MarkdownControl.infoOverlayTitle',
    defaultMessage: 'Format text using markdown',
  },
  infoOverlayFirstSection: {
    id: 'app.components.MarkdownControl.infoOverlayFirstSection',
    defaultMessage: 'This text field supports basic formatting using markdown, incuding section headings, {strong}, {italic}, links, and more.',
  },
  infoOverlaySecondSection: {
    id: 'app.components.MarkdownControl.infoOverlaySecondSection',
    defaultMessage: 'You can either directly type markdown code or use one of the format buttons above the text area to insert it, by either',
  },
  infoOverlayThirdSection: {
    id: 'app.components.MarkdownControl.infoOverlayThirdSection',
    defaultMessage: 'first clicking one of the buttons and then replace the generated placeholder text, or',
  },
  infoOverlayFourthSection: {
    id: 'app.components.MarkdownControl.infoOverlayFourthSection',
    defaultMessage: ' select some existing text and then apply a format using one the buttons.',
  },
  infoOverlayFifthSection: {
    id: 'app.components.MarkdownControl.infoOverlayFifthSection',
    defaultMessage: 'You can learn more about {link}.',
  },
  infoOverlaySixthSection: {
    id: 'app.components.MarkdownControl.infoOverlaySixthSection',
    defaultMessage: 'markdown and additional formatting options here',
  },
  buttonTitleHeading2: {
    id: 'app.components.MarkdownControl.buttonTitleHeading2',
    defaultMessage: '## Heading',
  },
  buttonTitleHeading3: {
    id: 'app.components.MarkdownControl.buttons.titles.heading3',
    defaultMessage: '### Secondary heading',
  },
  buttonTitleBold: {
    id: 'app.components.MarkdownControl.buttonTitleBold',
    defaultMessage: 'Bold: **bold**',
  },
  buttonTitleItalic: {
    id: 'app.components.MarkdownControl.buttonTitleItalic',
    defaultMessage: 'Italic: _italic_',
  },
  buttonTitleLink: {
    id: 'app.components.MarkdownControl.buttonTitleLink',
    defaultMessage: 'Link: (text)[url]',
  },
  buttonTitleUnorderedList: {
    id: 'app.components.MarkdownControl.buttonTitleUnorderedList',
    defaultMessage: 'Unordered list: -',
  },
  buttonTitleOrderedList: {
    id: 'app.components.MarkdownControl.buttonTitleOrderedList',
    defaultMessage: 'Ordered list: 1.',
  },
});

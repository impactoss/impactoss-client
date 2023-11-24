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
  buttons: {
    titles: {
      heading2: {
        id: 'app.components.MarkdownControl.buttons.titles.heading2',
        defaultMessage: '## Heading',
      },
      heading3: {
        id: 'app.components.MarkdownControl.buttons.titles.heading3',
        defaultMessage: '### Secondary heading',
      },
      bold: {
        id: 'app.components.MarkdownControl.buttons.titles.bold',
        defaultMessage: 'Bold: **bold**',
      },
      italic: {
        id: 'app.components.MarkdownControl.buttons.titles.italic',
        defaultMessage: 'Italic: _italic_',
      },
      link: {
        id: 'app.components.MarkdownControl.buttons.titles.link',
        defaultMessage: 'Link: (text)[url]',
      },
      unorderedList: {
        id: 'app.components.MarkdownControl.buttons.titles.unorderedList',
        defaultMessage: 'Unordered list: -',
      },
      orderedList: {
        id: 'app.components.MarkdownControl.buttons.titles.orderedList',
        defaultMessage: 'Ordered list: 1.',
      },
    },
    labels: {
      heading2: {
        id: 'app.components.MarkdownControl.buttons.labels.heading2',
        defaultMessage: 'H2',
      },
      heading3: {
        id: 'app.components.MarkdownControl.buttons.labels.heading3',
        defaultMessage: 'H3',
      },
      orderedList: {
        id: 'app.components.MarkdownControl.buttons.labels.orderedList',
        defaultMessage: '123',
      },
      write: {
        id: 'app.components.MarkdownControl.buttons.labels.write',
        defaultMessage: 'Write',
      },
      preview: {
        id: 'app.components.MarkdownControl.buttons.labels.preview',
        defaultMessage: 'Preview',
      },
      formatText: {
        id: 'app.components.MarkdownControl.buttons.labels.formatText',
        defaultMessage: 'Format Text',
      },
    },
  },
  infoOverlay: {
    firstSection: {
      id: 'app.components.MarkdownControl.infoOverlay.firstSection',
      defaultMessage: 'This text field supports basic formatting using markdown, incuding section headings, {strong}, {italic}, links, and more.',
    },
    secondSection: {
      id: 'app.components.MarkdownControl.infoOverlay.secondSection',
      defaultMessage: 'You can either directly type markdown code or use one of the format buttons above the text area to insert it, by either',
    },
    thirdSection: {
      id: 'app.components.MarkdownControl.infoOverlay.thirdSection',
      defaultMessage: 'first clicking one of the buttons and then replace the generated placeholder text, or',
    },
    fourthSection: {
      id: 'app.components.MarkdownControl.infoOverlay.fourthSection',
      defaultMessage: ' select some existing text and then apply a format using one the buttons.',
    },
    fifthSection: {
      id: 'app.components.MarkdownControl.infoOverlay.fifthSection',
      defaultMessage: 'You can learn more about {link}.',
    },
    sixthSection: {
      id: 'app.components.MarkdownControl.infoOverlay.sixthSection',
      defaultMessage: 'markdown and additional formatting options here',
    },

  },
});

/*
 * MultiSelectControl Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  new: {
    id: 'app.components.MultiSelectControl.new',
    defaultMessage: 'New',
  },
  empty: {
    id: 'app.components.MultiSelectControl.empty',
    defaultMessage: 'No options currently available',
  },
  showingOptions: {
    id: 'app.components.MultiSelectControl.showingOptions',
    defaultMessage: 'Showing {no} of {total} options. ',
  },
  showMore: {
    id: 'app.components.MultiSelectControl.showMore',
    defaultMessage: 'Show more',
  },
  changeHint: {
    id: 'app.components.MultiSelectControl.changeHint',
    defaultMessage: 'Your changes:',
  },
  changeHintSelected: {
    id: 'app.components.MultiSelectControl.changeHintSelected',
    defaultMessage: ' {no} selected',
  },
  changeHintUnselected: {
    id: 'app.components.MultiSelectControl.changeHintUnselected',
    defaultMessage: ' {no} unselected',
  },
});

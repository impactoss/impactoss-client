/*
 * EntityList Messages
 *
 * This contains all the text for the ActionView component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  processingUpdates: {
    id: 'app.containers.EntityList.processingUpdates',
    defaultMessage: 'Processing {processNo} of {totalNo} updates.',
  },
  updatesFailed: {
    id: 'app.containers.EntityList.updatesFailed',
    defaultMessage: '{errorNo} update(s) failed! Please wait for the items to be updated from the server and then carefully review the affected items above.',
  },
  updatesSuccess: {
    id: 'app.containers.EntityList.updatesSuccess',
    defaultMessage: 'All {successNo} update(s) succeeded!',
  },
});

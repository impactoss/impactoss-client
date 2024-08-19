/*
 * NotFoundEntity Messages
 *
 * This contains all the text for the NotFoundEntity component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  notFound: {
    id: 'app.containers.NotFoundEntity.notFound',
    defaultMessage: 'Sorry, no {type} with id {id} was found with the current data settings.',
  },
  notFoundAllLoaded: {
    id: 'app.containers.NotFoundEntity.notFoundAllLoaded',
    defaultMessage: 'Sorry, the {type} with id {id} was not found',
  },
  settingsHint: {
    id: 'app.containers.NotFoundEntity.settingsHint',
    defaultMessage: 'You can try including content from previous cycles or archived content in the {settingsLink}.',
  },
  settingsLinkAnchor: {
    id: 'app.containers.NotFoundEntity.settingsLinkAnchor',
    defaultMessage: 'Settings',
  },
});

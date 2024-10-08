/*
 * ActionList Messages
 *
 * This contains all the text for the ActionList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.containers.Search.pageTitle',
    defaultMessage: 'Search',
  },
  metaDescription: {
    id: 'app.containers.Search.metaDescription',
    defaultMessage: 'Search page description',
  },
  sidebarTitle: {
    id: 'app.containers.Search.sidebarTitle',
    defaultMessage: 'Select search target',
  },
  search: {
    id: 'app.containers.Search.search',
    defaultMessage: 'Search database',
  },
  settingsHint: {
    id: 'app.containers.Search.settingsHint',
    defaultMessage: 'Please note: search results {settingsHintContent}.',
  },
  loadArchived: {
    id: 'app.containers.Search.loadArchived',
    defaultMessage: '{active, select, true {include} other {do not include}} archived content',
  },
  loadNonCurrent: {
    id: 'app.containers.Search.loadNonCurrent',
    defaultMessage: '{active, select, true {include} other {do not include}} content from past reporting cycles',
  },
  settingsHint2: {
    id: 'app.containers.Search.settingsHint2',
    defaultMessage: 'You can configure the relevant content in the {settingsLink}.',
  },
  and: {
    id: 'app.containers.Search.and',
    defaultMessage: 'and',
  },
  settingsLinkAnchor: {
    id: 'app.containers.Search.settingsLinkAnchor',
    defaultMessage: 'Settings',
  },
  placeholder: {
    id: 'app.containers.Search.placeholder',
    defaultMessage: 'Search database by keyword',
  },
  groups: {
    entities: {
      id: 'app.containers.Search.groups.entities',
      defaultMessage: 'Subjects',
    },
    taxonomies: {
      id: 'app.containers.Search.groups.taxonomies',
      defaultMessage: 'Category groups',
    },
    content: {
      id: 'app.containers.Search.groups.content',
      defaultMessage: 'Content',
    },
  },
  hints: {
    noEntry: {
      id: 'app.containers.Search.hints.noEntry',
      defaultMessage: 'Please enter a search text to start your search.',
    },
    minLength: {
      id: 'app.containers.Search.hints.minLength',
      defaultMessage: 'Please continue entering your search text',
    },
    noResults: {
      id: 'app.containers.Search.hints.noResults',
      defaultMessage: 'We are sorry, no content matched your search! Please try a different search text.',
    },
    hasCountTargets: {
      id: 'app.containers.Search.hints.hasCountTargets',
      defaultMessage: 'Please select a content type below to see individual results',
    },
    resultsFound: {
      id: 'app.containers.Search.hints.resultsFound',
      defaultMessage: '{count} {count, select, 1 {result} other {results}} found in database.',
    },
  },
});

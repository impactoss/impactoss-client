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
    noResults: {
      id: 'app.containers.Search.hints.noResults',
      defaultMessage: 'We are sorry, there are no results for the selected search target. Please select a different target or try a different search text.',
    },
    noResultsNoAlternative: {
      id: 'app.containers.Search.hints.noResultsNoAlternative',
      defaultMessage: 'We are sorry, no content matched your search! Please try a different search text.',
    },
    targetMobile: {
      id: 'app.containers.Search.hints.targetMobile',
      defaultMessage: 'Select search target - see results below',
    },
    resultsMobile: {
      id: 'app.containers.Search.hints.resultsMobile',
      defaultMessage: 'Search results',
    },
  },
});

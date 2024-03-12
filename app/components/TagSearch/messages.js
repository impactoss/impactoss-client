/*
 * TagSearch Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  searchPlaceholderEntities: {
    id: 'app.components.TagSearch.searchPlaceholderEntities',
    defaultMessage: 'Filter items by reference or title',
  },
  searchPlaceholderEntitiesAttributes: {
    id: 'app.components.TagSearch.searchPlaceholderEntitiesAttributes',
    defaultMessage: 'Filter items by {attributes}',
  },
  searchPlaceholderMultiSelect: {
    id: 'app.components.TagSearch.searchPlaceholderMultiSelect',
    defaultMessage: 'Filter options by reference or title',
  },
  labelPrintFilters: {
    id: 'app.components.TagSearch.labelPrintFilters',
    defaultMessage: 'Filters:',
  },
  labelPrintKeywords: {
    id: 'app.components.TagSearch.labelPrintKeywords',
    defaultMessage: 'Keyword search:',
  },
  removeTag: {
    id: 'app.components.TagSearch.removeTag',
    defaultMessage: 'Active filter: {title} - click to remove',
  },
  removeAll: {
    id: 'app.components.TagSearch.removeAll',
    defaultMessage: 'Click to remove all filters',
  },
  skipToResults: {
    id: 'app.components.TagSearch.skipToResults',
    defaultMessage: 'Skip to list of results',
  },
});

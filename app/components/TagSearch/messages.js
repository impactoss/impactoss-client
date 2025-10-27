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
  searchPlaceholderUsers: {
    id: 'app.components.TagSearch.searchPlaceholderUsers',
    defaultMessage: 'Filter items by name or domain',
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
  searchInfoTitle: {
    id: 'app.components.TagSearch.searchInfoTitle',
    defaultMessage: 'How to use the Search',
  },
  searchInfoSectionAttributesTitle: {
    id: 'app.components.TagSearch.searchInfoSectionAttributesTitle',
    defaultMessage: 'Matched attributes',
  },
  searchInfoSectionAttributesInfo: {
    id: 'app.components.TagSearch.searchInfoSectionAttributesInfo',
    defaultMessage: 'The search terms entered are matched against the following content attributes (where available):',
  },
  searchInfoSectionBehaviourTitle: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourTitle',
    defaultMessage: 'Search behaviour',
  },
  searchInfoSectionBehaviourInfo: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourInfo',
    defaultMessage: 'Please note:',
  },
  searchInfoSectionBehaviourCapitalization: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourCapitalization',
    defaultMessage: 'Searches are not case-sensitive',
  },
  searchInfoSectionBehaviourPartial: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourPartial',
    defaultMessage: "Results will also include partial matches (e.g. 'child' will also return content mentioning 'children')",
  },
  searchInfoSectionBehaviourQuotes: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourQuotes',
    defaultMessage: 'Use double quotes to search for exact terms and phrases (e.g. "domestic violence")',
  },
  searchInfoSectionBehaviourMacrons: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourMacrons',
    defaultMessage: "Macrons are ignored (e.g. searching for 'maori' will also return results including 'māori')",
  },
});

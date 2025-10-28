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
    defaultMessage: 'How to use the search',
  },
  searchInfoSectionAttributesTitle: {
    id: 'app.components.TagSearch.searchInfoSectionAttributesTitle',
    defaultMessage: 'What attributes are searched',
  },
  searchInfoSectionAttributesInfo: {
    id: 'app.components.TagSearch.searchInfoSectionAttributesInfo',
    defaultMessage: 'The search terms are checked against the following **content attributes** (where available):',
  },
  searchInfoSectionBehaviourTitle: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourTitle',
    defaultMessage: 'How the search works',
  },
  searchInfoSectionBehaviourInfo: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourInfo',
    defaultMessage: 'Please note:',
  },
  searchInfoSectionBehaviourAllTerms: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourAllTerms',
    defaultMessage: 'Searches are **not case-sensitive**',
  },
  searchInfoSectionBehaviourCapitalization: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourCapitalization',
    defaultMessage: 'Searches are **not case-sensitive**',
  },
  searchInfoSectionBehaviourPartial: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourPartial',
    defaultMessage: "Results will include **partial matches** (e.g. 'child' will also return content mentioning 'children')",
  },
  searchInfoSectionBehaviourQuotes: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourQuotes',
    defaultMessage: "Use **double quotes** to search for **exact terms and phrases** (thus ignoring partial matches - \"child\" will not return content mentioning 'children', )",
  },
  searchInfoSectionBehaviourDeburr: {
    id: 'app.components.TagSearch.searchInfoSectionBehaviourDeburr',
    defaultMessage: "**Macrons and accents are ignored** (e.g. searching for 'maori' will also return results including 'māori')",
  },
});

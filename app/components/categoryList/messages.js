/*
 * categoryList Messages
 *
 * This contains all the text for the EntityListMain component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  titleColumnSortTitle: {
    id: 'app.components.CategoryList.titleColumnSortTitle',
    defaultMessage: 'Sort categories list by title or reference',
  },
  titleColumnSortTitleSorted: {
    id: 'app.components.CategoryList.titleColumnSortTitleSorted',
    defaultMessage: 'Categories sorted by title or reference',
  },
  columnSortTitleSortedAsc: {
    id: 'app.components.CategoryList.titleColumnSortTitleSortedAsc',
    defaultMessage: '(ascending - click to reverse)',
  },
  columnSortTitleSortedDesc: {
    id: 'app.components.CategoryList.columnSortTitleSortedDesc',
    defaultMessage: '(descending - click to reverse)',
  },
  numberColumnSortTitle: {
    id: 'app.components.CategoryList.numberColumnSortTitle',
    defaultMessage: 'Sort categories by number of {value}',
  },
  numberColumnSortTitleSorted: {
    id: 'app.components.CategoryList.numberColumnSortTitleSorted',
    defaultMessage: 'Categories sorted by number of {value}',
  },
});

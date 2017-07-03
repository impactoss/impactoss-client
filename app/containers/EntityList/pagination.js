import { range } from 'lodash/util';

const PAGE_SIZE = 25;
const PAGE_LINKS = 5;

// default to first page
export const getPager = (totalItems, currentPage = 1, pageSize = PAGE_SIZE) => {
  // calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  // make sure we dont overshoot
  const currentMaxPage = Math.min(currentPage, totalPages);
  // less than 5 total pages so show all
  let startPage = 1;
  let endPage = totalPages;
  if (totalPages > PAGE_LINKS) {
    // more than 5 total pages so calculate start and end pages
    if (currentMaxPage <= Math.ceil(PAGE_LINKS / 2)) {
      startPage = 1;
      endPage = PAGE_LINKS;
    } else if ((currentMaxPage + ((PAGE_LINKS - 1) / 2)) >= totalPages) {
      startPage = totalPages - (PAGE_LINKS - 1);
      endPage = totalPages;
    } else {
      startPage = currentMaxPage - ((PAGE_LINKS - 1) / 2);
      endPage = currentMaxPage + ((PAGE_LINKS - 1) / 2);
    }
  }


  // calculate start and end item indexes
  const startIndex = (currentMaxPage - 1) * pageSize;
  const endIndex = Math.min((startIndex + pageSize) - 1, totalItems - 1);

  // create an array of pages to ng-repeat in the pager control
  const pages = range(startPage, endPage + 1);
  // return object with all pager properties required by the view
  return {
    totalItems,
    currentPage: currentMaxPage,
    pageSize,
    totalPages,
    startPage,
    endPage,
    startIndex,
    endIndex,
    pages,
  };
};

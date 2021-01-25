export const scrollToTop = (scrollContainer) => {
  /* eslint-disable no-param-reassign */
  scrollContainer.scrollTop = 0;
  /* eslint-enable no-param-reassign */
};

export const jumpToComponent = (scrollTarget, scrollReference, scrollContainer) => {
  if (!scrollTarget || !scrollReference) {
    scrollToTop(scrollContainer);
  } else if (scrollTarget.getBoundingClientRect && scrollReference.getBoundingClientRect) {
    /* eslint-disable no-param-reassign */
    scrollContainer.scrollTop = scrollTarget.getBoundingClientRect().top
      - scrollReference.getBoundingClientRect().top;
    /* eslint-enable no-param-reassign */
  }
};
export const SCROLL_PADDING = 5;
export const fitComponent = (scrollTarget, scrollContainer) => {
  if (
    scrollTarget
    && scrollTarget.getBoundingClientRect
    && scrollContainer
    && scrollContainer.getBoundingClientRect
  ) {
    if (
      scrollTarget.getBoundingClientRect().height > scrollContainer.getBoundingClientRect().height
      || scrollTarget.getBoundingClientRect().top < scrollContainer.getBoundingClientRect().top
    ) {
      /* eslint-disable no-param-reassign */
      scrollContainer.scrollTop
        += scrollTarget.getBoundingClientRect().top
        - scrollContainer.getBoundingClientRect().top
        - SCROLL_PADDING; // eslint-disable-line no-param-reassign
    }
    if (scrollTarget.getBoundingClientRect().bottom > scrollContainer.getBoundingClientRect().bottom) {
      scrollContainer.scrollTop += ((scrollTarget.getBoundingClientRect().bottom - scrollContainer.getBoundingClientRect().bottom) + SCROLL_PADDING); // eslint-disable-line no-param-reassign
    }
  }
};

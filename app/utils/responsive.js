// import { BREAKPOINTS } from 'themes/theme';

// if a given size is larger than a reference size
const isMinXXLarge = (size) => size === 'xxlarge';
const isMinXLarge = (size) => isMinXXLarge(size) || size === 'xlarge';
const isMinLarge = (size) => isMinXLarge(size) || size === 'large';
const isMinMedium = (size) => isMinLarge(size) || size === 'medium';
const isMinSM = (size) => isMinMedium(size) || size === 'ms';
const isMinSmall = () => true;

export const isMinSize = (currentSize, checkSize) => {
  if (checkSize === 'small') return isMinSmall(currentSize);
  if (checkSize === 'ms') return isMinSM(currentSize);
  if (checkSize === 'medium') return isMinMedium(currentSize);
  if (checkSize === 'large') return isMinLarge(currentSize);
  if (checkSize === 'xlarge') return isMinXLarge(currentSize);
  if (checkSize === 'xxlarge') return isMinXXLarge(currentSize);
  return false;
};

// If a given size is smaller than a reference size
const isMaxXXLarge = () => true;
const isMaxXLarge = (size) => isMaxLarge(size) || size === 'xlarge';
const isMaxLarge = (size) => isMaxMedium(size) || size === 'large';
const isMaxMedium = (size) => isMaxSM(size) || size === 'medium';
const isMaxSM = (size) => isMaxSmall(size) || size === 'ms';
const isMaxSmall = (size) => size === 'small';

export const isMaxSize = (currentSize, checkSize) => {
  if (checkSize === 'small') return isMaxSmall(currentSize);
  if (checkSize === 'ms') return isMaxSM(currentSize);
  if (checkSize === 'medium') return isMaxMedium(currentSize);
  if (checkSize === 'large') return isMaxLarge(currentSize);
  if (checkSize === 'xlarge') return isMaxXLarge(currentSize);
  if (checkSize === 'xxlarge') return isMaxXXLarge(currentSize);
  return false;
};

export const getWindowDimensions = () => {
  // const { innerWidth: width, innerHeight: height } = window;
  if (document.compatMode === 'BackCompat') {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };
  }
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
};

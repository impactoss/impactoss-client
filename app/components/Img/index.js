/**
 *
 * Img
 *
 * Renders an image, enforcing the usage of the alt="" tag
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

const generateSrcSet = (srcArray) =>
  srcArray.slice(1).map((src, index) => `${src} ${index + 2}x`).join(', ');
function Img({
  src,
  alt,
  className,
  style,
}) {
  const isArray = Array.isArray(src);
  return (
    <img
      className={className}
      src={isArray ? src[0] : src}
      srcSet={isArray && src.length > 1 ? generateSrcSet(src) : undefined}
      alt={alt}
      style={style}
    />
  );
}

// We require the use of src and alt, only enforced by react in dev mode
Img.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Img;

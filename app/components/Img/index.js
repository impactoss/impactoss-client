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
}) {
  return (
    <img
      className={className}
      src={src[0]}
      srcSet={generateSrcSet(src)}
      alt={alt}
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
};

export default Img;

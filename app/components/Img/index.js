/**
 *
 * Img.react.js
 *
 * Renders an image, enforcing the usage of the alt="" tag
 *
 * see https://github.com/KyleAMathews/react-retina-image
 */

import React from 'react';
import PropTypes from 'prop-types';
import RetinaImage from 'react-retina-image';

function Img({
  src,
  alt,
  className,
  checkIfRetinaImgExists = true,
  forceOriginalDimensions = false,
}) {
  return (
    <RetinaImage
      className={className}
      src={src}
      alt={alt}
      forceOriginalDimensions={forceOriginalDimensions}
      checkIfRetinaImgExists={checkIfRetinaImgExists}
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
  forceOriginalDimensions: PropTypes.bool,
  checkIfRetinaImgExists: PropTypes.bool,
};

export default Img;

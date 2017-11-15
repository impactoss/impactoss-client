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

function Img(props) {
  return (
    <RetinaImage
      className={props.className}
      src={props.src}
      alt={props.alt}
      forceOriginalDimensions={props.forceOriginalDimensions}
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
};

Img.defaultProps = {
  forceOriginalDimensions: false,
};

export default Img;

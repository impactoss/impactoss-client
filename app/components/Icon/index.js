import React from 'react';
import PropTypes from 'prop-types';
import icons from 'themes/icons';
import asArray from 'utils/as-array';

import SVG from './SVG';

class Icon extends React.PureComponent {
  render() {
    const {
      name,
      title,
      size,
      sizes,
      palette,
      paletteIndex,
      color,
      iconSize,
      text,
      textRight,
      textLeft,
      hasStroke,
      hidePrint,
      hideScreenreader,
      role,
    } = this.props;
    const icon = icons[name];

    if (icon) {
      const iSize = icon.size || iconSize;
      const iconPaths = icon.paths || icon.path || icon;
      return (
        <SVG
          viewBox={`0 0 ${iSize} ${iSize}`}
          preserveAspectRatio="xMidYMid meet"
          role={role}
          aria-hidden={hideScreenreader}
          palette={palette}
          paletteIndex={paletteIndex}
          size={size || `${iSize}px`}
          color={color}
          text={text}
          textLeft={textLeft}
          textRight={textRight}
          hasStroke={hasStroke}
          sizes={sizes}
          hidePrint={hidePrint}
        >
          <title>{title || `Icon: ${name}`}</title>
          <path d={asArray(iconPaths).reduce((memo, path) => `${memo}${path}`, '')}></path>
        </SVG>
      );
    }
    return null;
  }
}

Icon.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  palette: PropTypes.string,
  paletteIndex: PropTypes.number,
  size: PropTypes.string,
  iconSize: PropTypes.number,
  color: PropTypes.string,
  text: PropTypes.bool,
  textLeft: PropTypes.bool,
  textRight: PropTypes.bool,
  hasStroke: PropTypes.bool,
  sizes: PropTypes.object,
  hidePrint: PropTypes.bool,
  hideScreenreader: PropTypes.bool,
  role: PropTypes.string,
};
Icon.defaultProps = {
  name: 'placeholder',
  iconSize: 24,
  textLeft: false,
  textRight: false,
  hideScreenreader: true,
  role: null,
};


export default Icon;

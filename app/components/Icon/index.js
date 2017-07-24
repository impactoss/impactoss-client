import React from 'react';
import PropTypes from 'prop-types';
import icons from 'themes/icons';

import SVG from './SVG';

class Icon extends React.PureComponent {
  render() {
    const { name, title, size, palette, paletteIndex, color, iconSize, text, textRight, textLeft } = this.props;
    const icon = icons[name];
    if (icon) {
      const iSize = icon.size || iconSize;
      const iconPaths = icon.paths || icon;
      return (
        <SVG
          viewBox={`0 0 ${iSize} ${iSize}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          palette={palette}
          paletteIndex={paletteIndex}
          size={size || `${iSize}px`}
          color={color}
          text={text}
          textLeft={textLeft}
          textRight={textRight}
        >
          <title>{title || `Icon: ${name}`}</title>
          {
            iconPaths.map((path, index) => (<path d={path} key={index}></path>))
          }
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
};
Icon.defaultProps = {
  name: 'placeholder',
  iconSize: 24,
  textLeft: false,
  textRight: false,
};


export default Icon;

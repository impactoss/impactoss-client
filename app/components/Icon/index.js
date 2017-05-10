import React from 'react';
import icons from 'themes/icons';

import SVG from './SVG';

class Icon extends React.PureComponent {
  render() {
    const { name, title, size, palette, paletteIndex, color, iconSize, withText } = this.props;
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
          withText={withText}
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
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  palette: React.PropTypes.string,
  paletteIndex: React.PropTypes.number,
  size: React.PropTypes.string,
  iconSize: React.PropTypes.number,
  color: React.PropTypes.string,
  withText: React.PropTypes.bool,
};
Icon.defaultProps = {
  name: 'placeholder',
  size: '24px',
  iconSize: 24,
};


export default Icon;

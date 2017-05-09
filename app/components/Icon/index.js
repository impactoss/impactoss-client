import React from 'react';
import icons from 'themes/icons';

import SVG from './SVG';

class Icon extends React.PureComponent {
  render() {
    const { name, title, size, palette, paletteIndex, color } = this.props;
    const icon = icons[name];
    if (icon) {
      const iconSize = icon.size || parseFloat(size);
      const iconPaths = icon.paths || icon;
      return (
        <SVG
          viewBox={`0 0 ${iconSize} ${iconSize}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          palette={palette}
          paletteIndex={paletteIndex}
          size={size || `${iconSize}px`}
          color={color}
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
  color: React.PropTypes.string,
};
Icon.defaultProps = {
  name: 'home',
  title: 'home',
  size: '24px',
};


export default Icon;

import React from 'react';
import icons from 'themes/icons';

import SVG from './SVG';

function Icon(props) {
  // var SVG = IconFactory(icons)
  const icon = icons[props.name];
  if (icon) {
    const iconSize = icon.size || parseFloat(props.size);
    const iconPaths = icon.paths || icon;
    return (
      <SVG
        viewBox={`0 0 ${iconSize} ${iconSize}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        palette={props.palette}
        paletteIndex={props.paletteIndex}
        size={props.size || `${iconSize}px`}
        color={props.color}
      >
        <title>{props.title || `Icon: ${props.name}`}</title>
        {
          iconPaths.map((path, index) => (<path d={path} key={index}></path>))
        }
      </SVG>
    );
  }
  return null;
}

Icon.propTypes = {
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  palette: React.PropTypes.string,
  paletteIndex: React.PropTypes.number,
  size: React.PropTypes.string,
  color: React.PropTypes.string,
};
Icon.defaultTypes = {
  name: 'home',
  title: 'home',
  size: '24px',
};


export default Icon;

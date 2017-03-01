import React from 'react';
import icons from 'themes/icons';

import SVG from './SVG';

function Icon(props) {
  // var SVG = IconFactory(icons)

  return props.name && icons[props.name] ? (
    <SVG
      viewBox="0 0 1024 1024"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      palette={props.palette}
      paletteIndex={props.paletteIndex}
      size={props.size}
      color={props.color}
    >
      <title>{props.title || `Icon: ${props.name}`}</title>
      {
        icons[props.name].map((path, index) => <path d={path} key={index}></path>)
      }
    </SVG>
  ) : null;
}

Icon.propTypes = {
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  palette: React.PropTypes.string,
  paletteIndex: React.PropTypes.number,
  size: React.PropTypes.string,
  color: React.PropTypes.string,
};


export default Icon;

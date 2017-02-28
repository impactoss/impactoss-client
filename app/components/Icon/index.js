import React from 'react';
import icons from 'themes/icons';

import SVG from './SVG'

function Icon(props) {
  // var SVG = IconFactory(icons)

  if (typeof props.name !== "undefined"  && typeof icons[props.name] !== "undefined"){
    return (
      <SVG
        viewBox="0 0 1024 1024"
        preserveAspectRatio="xMidYMid meet"
        palette={props.palette}
        paletteIndex={props.paletteIndex || 0}
        size={props.size || "1em"}
      >
        {
          icons[props.name].map(function(path, index){
            return <path d={path} key={index}></path>;
          })
        }
      </SVG>
    );
  } else {
    return null
  }
}

Icon.propTypes = {
  name: React.PropTypes.string,
  palette: React.PropTypes.string,
  paletteIndex: React.PropTypes.number,
  size: React.PropTypes.string
};


export default Icon

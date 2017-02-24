import React from 'react';
import icons from 'themes/icons.js';
import styled from 'styled-components';
import { palette } from 'styled-theme';

function Icon(props) {
  // var SVG = IconFactory(icons)
  let size = props.size || 24
  let name = typeof props.name !== "undefined" && typeof icons[props.name] !== "undefined" ? props.name  : 'fallback'

  const Wrapper = styled.span`
    padding: 0;
    margin: 0;
  `;

  const SVG = styled.svg`
    vertical-align:middle;
    fill: ${palette(1)};
    width: ${ size + 'px'};
    height: ${ size + 'px' };
  `
  SVG.defaultProps = {
    palette: 'primary'
  }

  return (
    <Wrapper className={props.className} >
      <SVG
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        palette={props.palette}
      >
        {icons[name]}
      </SVG>
    </Wrapper>
  );
}

Icon.propTypes = {
  name: React.PropTypes.string,
  palette: React.PropTypes.string,
  size: React.PropTypes.number
};


export default Icon

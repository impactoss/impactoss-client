import styled from 'styled-components';
import { palette } from 'styled-theme';

const SVG = styled.svg`
  fill: ${(props) => props.palette ? palette(props.paletteIndex) : 'currentColor'};
  stroke: ${(props) => {
    if (props.stroke) {
      return props.palette ? palette(props.paletteIndex) : 'currentColor';
    }
    return 'none';
  }};
  bottom: ${(props) => props.text ? 0.1 : 0}em;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: ${(props) => props.textLeft ? (parseFloat(props.size) / 4) + props.size.split(/[0-9]+/)[1] : 0};
  margin-left: ${(props) => props.textRight ? (parseFloat(props.size) / 4) + props.size.split(/[0-9]+/)[1] : 0};
  width: ${(props) => (props.sizes && props.sizes.mobile) ? props.sizes.mobile : props.size};
  height: ${(props) => (props.sizes && props.sizes.mobile) ? props.sizes.mobile : props.size};
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    width: ${(props) => (props.sizes && props.sizes.small) ? props.sizes.small : props.size};
    height: ${(props) => (props.sizes && props.sizes.small) ? props.sizes.small : props.size};
  }
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.medium : '993px'}) {
    width: ${(props) => (props.sizes && props.sizes.medium) ? props.sizes.medium : props.size};
    height: ${(props) => (props.sizes && props.sizes.medium) ? props.sizes.medium : props.size};
  }
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.large : '1200px'}) {
    width: ${(props) => (props.sizes && props.sizes.large) ? props.sizes.large : props.size};
    height: ${(props) => (props.sizes && props.sizes.large) ? props.sizes.large : props.size};
  }
`;

SVG.defaultProps = {
  size: '1em',
  paletteIndex: 0,
};

export default SVG;

import styled from 'styled-components';
import { palette } from 'styled-theme';

const SVG = styled.svg`
  fill: ${(props) => props.palette ? palette(props.paletteIndex) : 'currentColor'};
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  bottom: ${(props) => props.text ? 0.1 : 0}em;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: ${(props) => props.textLeft ? (parseFloat(props.size) / 4) + props.size.split(/[0-9]+/)[1] : 0};
  margin-left: ${(props) => props.textRight ? (parseFloat(props.size) / 4) + props.size.split(/[0-9]+/)[1] : 0};
`;

SVG.defaultProps = {
  size: '1em',
  paletteIndex: 0,
};

export default SVG;

import styled from 'styled-components';
import { palette } from 'styled-theme';

const SVG = styled.svg`
  fill: ${(props) => props.palette ? palette(props.paletteIndex) : 'currentColor'};
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  display: inline-flex;
  align-self: center;
  position:relative;
  bottom: ${(props) => (parseFloat(props.size) / 16) + props.size.split(/[0-9]+/)[1]};
  margin-right:${(props) => (parseFloat(props.size) / 4) + props.size.split(/[0-9]+/)[1]};
`;

SVG.defaultProps = {
  size: '1em',
  paletteIndex: 0,
};

export default SVG;

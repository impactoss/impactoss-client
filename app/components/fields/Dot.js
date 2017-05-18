import styled from 'styled-components';
import { palette } from 'styled-theme';

const Dot = styled.div`
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  display: block;
  border-radius: 999px;
  width: 14px;
  height: 14px;
`;


export default Dot;

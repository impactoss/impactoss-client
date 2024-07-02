import styled from 'styled-components';
import { palette } from 'styled-theme';

const SkipContent = styled.a`
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1em;
  opacity: 0;
  width: 1px;
  height: 1px;

  &:focus-visible {
    opacity: 1;
    left: 0;
    width: auto;
    height: auto;
    background-color: #fff;
    z-index: 99999;
    box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
    color: ${palette('primary', 0)};
    border-radius: 2px;
    outline: 1px solid ${palette('primary', 0)};
    outline-offset: 0px;
  }
`;

export default SkipContent;

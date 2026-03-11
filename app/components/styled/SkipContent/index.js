import styled from 'styled-components';
import { palette } from 'styled-theme';

const SkipContent = styled.a`
  position: absolute;       /* relative to list item */
  width: 1px;               /* minimal footprint */
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);     /* completely visually hidden */
  border: 0;
  font-size: 0;             /* ensures text doesn’t create height */
  line-height: 0;
  z-index: 1;

  &:focus-visible {
    position: absolute;      /* still relative to parent */
    width: auto;
    height: auto;
    padding: 1em;
    clip: auto;
    overflow: visible;
    left: 0;
    top: 0;
    font-size: 16px;        /* restore readable font */
    line-height: normal;
    background-color: #fff;
    color: ${palette('primary', 0)};
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 2px;
    outline: 1px solid ${palette('primary', 0)};
    z-index: 9999;
  }
`;

export default SkipContent;

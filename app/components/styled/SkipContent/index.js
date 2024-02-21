import styled from 'styled-components';

const SkipContent = styled.a`
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1em;
  opacity: 0;
  width: 1px;
  height: 1px;

  &:focus {
    opacity: 1;
    left: 0;
    width: auto;
    height: auto;
    background-color: #fff;
    z-index: 99999;
    box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  }
}`;

export default SkipContent;

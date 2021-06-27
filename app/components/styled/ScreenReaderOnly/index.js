import styled from 'styled-components';

const ScreenReaderOnly = styled.span`
  position: absolute;
  height: 1px;
  width: 1px;
  clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
  overflow: hidden !important;
`;

export default ScreenReaderOnly;

import styled from 'styled-components';

export default styled.div`
  height:${(props) => props.isHome ? 0 : 105}px;
  background-image: ${(props) => props.showPattern ? props.theme.backgroundImages.header : 'none'};
  background-repeat: repeat;
  position: ${(props) => props.isHome ? 'absolute' : 'static'};
  right: 0px;
`;

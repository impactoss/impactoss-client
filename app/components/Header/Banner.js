import styled from 'styled-components';

export default styled.div`
  height:${(props) => props.theme.sizes.header.banner.height}px;
  background-image: ${(props) => props.theme.backgroundImages.header};
  background-repeat: repeat;
  position: ${(props) => props.isHome ? 'absolute' : 'static'};
  right: 0px;
`;

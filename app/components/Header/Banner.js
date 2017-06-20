import styled from 'styled-components';

export default styled.div`
  height:105px;
  background-image: ${(props) => props.showPattern ? props.theme.backgroundImages.header : 'none'};
  background-repeat: repeat;
`;

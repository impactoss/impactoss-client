import styled from 'styled-components';

export default styled.div`
  height:${(props) => props.theme.sizes.header.banner.height}px;
  background-image: ${(props) => (props.showPattern && props.theme.backgroundImages.header)
    ? props.theme.backgroundImages.header
    : 'none'
  };
  background-repeat: repeat;
`;

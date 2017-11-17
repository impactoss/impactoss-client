import styled from 'styled-components';

import { SHOW_HEADER_PATTERN } from 'themes/config';

export default styled.div`
  height:${(props) => props.theme.sizes.header.banner.height}px;
  background-image: ${(props) => (SHOW_HEADER_PATTERN && props.theme.backgroundImages.header) ? props.theme.backgroundImages.header : 'none'};
  background-repeat: repeat;
  position: ${(props) => props.isHome ? 'absolute' : 'static'};
  right: 0px;
`;

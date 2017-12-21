import styled from 'styled-components';
import { palette } from 'styled-theme';

import { SHOW_SIDEBAR_HEADER_PATTERN } from 'themes/config';

export default styled.div`
  height:${(props) => props.theme.sizes.aside.header.height}px;
  background-image: ${(props) => (SHOW_SIDEBAR_HEADER_PATTERN && props.theme.backgroundImages.asideHeader)
    ? props.theme.backgroundImages.asideHeader
    : 'none'
  };
  background-repeat: repeat;
  padding: ${(props) => props.hasButtons ? '2.5em 1.5em 1em' : '3em 1.5em 1em'};
  background-color: ${palette('asideHeader', 0)}
`;

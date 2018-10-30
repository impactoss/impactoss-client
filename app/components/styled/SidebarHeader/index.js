import styled from 'styled-components';
import { palette } from 'styled-theme';

import { SHOW_SIDEBAR_HEADER_PATTERN } from 'themes/config';

export default styled.div`
  height: ${(props) => props.hasButtons ? 'auto' : props.theme.sizes.aside.header.height}px;
  background-image: ${(props) => (SHOW_SIDEBAR_HEADER_PATTERN && props.theme.backgroundImages.asideHeader)
    ? props.theme.backgroundImages.asideHeader
    : 'none'
  };
  background-repeat: repeat;
  padding: ${(props) => {
    if (props.hasButtons) {
      return '3.5em 24px 0.5em';
    }
    if (props.responsiveSmall) {
      return '3em 12px 1em';
    }
    return '3em 24px 1em';
  }};
  background-color: ${palette('asideHeader', 0)};

  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    height:${(props) => props.theme.sizes.aside.header.height}px;
    padding: ${(props) => props.hasButtons ? '2.5em 24px 1em' : '3em 24px 1em'};
  }
`;

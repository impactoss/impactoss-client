import styled from 'styled-components';
import { palette } from 'styled-theme';

import { HEADER_PATTERN_HEIGHT } from 'themes/config';

export default styled.div`
  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;
  background-repeat: repeat;
  background-size: ${HEADER_PATTERN_HEIGHT}px auto;
  color: ${palette('headerBrand', 0)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
  background-image: ${(props) => (props.showPattern && props.theme.backgroundImages.header)
    ? props.theme.backgroundImages.header
    : 'none'
};
  @media print {
    background-image: none;
  }
`;

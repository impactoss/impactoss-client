import styled from 'styled-components';

import NormalImg from 'components/Img';

const Logo = styled(NormalImg)`
  padding: ${(props) => props.theme.sizes.header.paddingLogo.mobile || 0};
  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.theme.sizes.header.paddingLogo.small || 0};
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: ${(props) => props.theme.sizes.header.paddingLogo.large || 0};
  }
  @media print {
    padding-left: 0;
  }
`;

export default Logo;

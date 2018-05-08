import styled from 'styled-components';

import NormalImg from 'components/Img';

const Logo = styled(NormalImg)`
  float:left;
  padding-left: ${(props) => props.theme.sizes.header.paddingLeft.mobile || 6}px;
  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-left: ${(props) => props.theme.sizes.header.paddingLeft.small || 12}px;
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-left: ${(props) => props.theme.sizes.header.paddingLeft.large || 20}px;
  }
`;

export default Logo;

// TODO @tmfrnz config
// padding

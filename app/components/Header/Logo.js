import styled from 'styled-components';

import NormalImg from 'components/Img';

const Logo = styled(NormalImg)`
  float:left;
  padding-left: ${(props) => props.theme.sizes.header.paddingLeft.s || 12}px;
  height: ${(props) => props.theme.sizes.header.banner.height}px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-left: ${(props) => props.theme.sizes.header.paddingLeft.l || 20}px;
  }
`;

export default Logo;

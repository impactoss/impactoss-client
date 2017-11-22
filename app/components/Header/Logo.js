import styled from 'styled-components';

import NormalImg from 'components/Img';

const Logo = styled(NormalImg)`
  float:left;
  padding-left: 20px;
  height:${(props) => props.theme.sizes.header.banner.height}px;
`;

export default Logo;

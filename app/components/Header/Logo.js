import styled from 'styled-components';

import NormalImg from 'components/Img';

const Logo = styled(NormalImg)`
  float:left;
  padding: 0 0 0 20px;
  height:${(props) => props.theme.sizes.header.banner.height}px;
`;

export default Logo;

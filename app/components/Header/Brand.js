import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.a`
  position: absolute;
  top: 0;
  left: 0;
  text-decoration: none;
  color: ${palette('headerBrand', 0)};
  z-index: 110;
  overflow: hidden;
  padding-right: 46px;
  height: ${(props) => props.theme.sizes.header.banner.heightMobile}px;
  &:hover {
    color: ${palette('headerBrandHover', 0)};
    opacity: 0.75;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-right: 46px;
    height: ${(props) => props.theme.sizes.header.banner.height}px;
  }
`;

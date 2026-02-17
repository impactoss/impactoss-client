import styled from 'styled-components';

import ContainerWrapper from './ContainerWrapper';

const ContainerWrapperSidebar = styled(ContainerWrapper)`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    left: ${(props) => {
    // narrow sidebar
    if (props.hasSidebar && props.sidebarResponsiveSmall) {
      return props.theme.sizes.aside.width.small;
    }
    // standard size
    if (props.hasSidebar && props.sidebarResponsiveLarge) {
      return props.theme.sizes.aside.width.large;
    }
    return 0;
  }}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    left: ${(props) => {
    if (props.hasSidebar && props.sidebarAbsolute) return props.theme.sizes.aside.width.large;
    if (props.hasSidebar && props.sidebarResponsiveSmall) {
      return props.theme.sizes.aside.width.small;
    }
    // standard size
    if (props.hasSidebar && props.sidebarResponsiveLarge) {
      return props.theme.sizes.aside.width.large;
    }
    return 0;
  }}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    left: ${(props) => props.hasSidebar ? props.theme.sizes.aside.width.large : 0}px;
  }
`;
export default ContainerWrapperSidebar;

import styled from 'styled-components';

import ContainerWrapper from './ContainerWrapper';

const ContainerWithSidebar = styled(ContainerWrapper)`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    left: ${(props) => {
      // narrow sidebar
      if (props.sidebarResponsiveSmall) {
        return props.theme.sizes.aside.width.small;
      }
      // standard size
      if (props.sidebarResponsiveLarge) {
        return props.theme.sizes.aside.width.large;
      }
      return 0;
    }}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    left: ${(props) => {
      if (props.sidebarAbsolute) return props.theme.sizes.aside.width.large;
      if (props.sidebarResponsiveSmall) {
        return props.theme.sizes.aside.width.small;
      }
      // standard size
      if (props.sidebarResponsiveLarge) {
        return props.theme.sizes.aside.width.large;
      }
      return 0;
    }}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    left: ${(props) => props.theme.sizes.aside.width.large}px;
  }
`;
export default ContainerWithSidebar;

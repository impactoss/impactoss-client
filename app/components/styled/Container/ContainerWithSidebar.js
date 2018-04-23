import styled from 'styled-components';

import ContainerWrapper from './ContainerWrapper';

const ContainerWithSidebar = styled(ContainerWrapper)`
  left: ${(props) => props.sidebarResponsiveSmall ? props.theme.sizes.aside.width.small : props.theme.sizes.aside.width.large}px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    left: ${(props) => props.theme.sizes.aside.width.large}px;
  }
`;
export default ContainerWithSidebar;

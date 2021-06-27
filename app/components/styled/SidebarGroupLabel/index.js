import styled from 'styled-components';
import { palette } from 'styled-theme';

const SidebarGroupLabel = styled.div`
  text-align: left;
  color: ${palette('asideListGroup', 0)};
  background-color: ${palette('asideListGroup', 1)};
  padding: 0.25em 12px;
  font-size: 0.9em;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0.25em 16px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;
export default SidebarGroupLabel;

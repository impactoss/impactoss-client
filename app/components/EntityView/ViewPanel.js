import styled from 'styled-components';
import { palette } from 'styled-theme';

const ViewPanel = styled.div`
  border-color: ${palette('greyscaleLight', 0)};
  border-width: 1px;
  border-right-style: ${(props) => props.borderRight ? 'solid' : 'none'};
  border-bottom-style: ${(props) => props.borderBottom ? 'solid' : 'none'};
`;
export default ViewPanel;

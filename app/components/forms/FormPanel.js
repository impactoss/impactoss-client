import styled from 'styled-components';
import { palette } from 'styled-theme';

const FormPanel = styled.div`
  border-color: ${palette('light', 2)};
  border-width: 1px;
  border-right-style: ${(props) => props.borderRight ? 'solid' : 'none'};
  border-bottom-style: ${(props) => props.borderBottom ? 'solid' : 'none'};
`;
export default FormPanel;

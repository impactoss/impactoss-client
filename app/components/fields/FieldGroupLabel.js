import styled from 'styled-components';
import { palette } from 'styled-theme';

const FieldGroupLabel = styled.div`
  position: relative;
  display: table;
  border-bottom: 2px solid ${palette('light', 3)};
  padding: 10px 0 3px;
  font-weight: bold;
  color: ${palette('text', 0)};
  font-size: ${(props) => props.theme.sizes.text.small};
`;

export default FieldGroupLabel;

import styled from 'styled-components';
import { palette } from 'styled-theme';

const FieldGroupLabel = styled.div`
  position: relative;
  display: table;
  border-bottom: ${(props) => props.basic ? 0 : '2px solid'};
  border-bottom-color: ${palette('light', 3)};
  padding: ${(props) => props.basic ? 0 : '10px 0 3px'};
  font-weight: bold;
  font-size: ${(props) => props.theme.sizes.text.small};
  margin-bottom: ${(props) => props.basic ? 0 : 20}px;
`;

export default FieldGroupLabel;

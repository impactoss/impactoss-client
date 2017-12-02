import styled from 'styled-components';
import { palette } from 'styled-theme';

const FieldGroupWrapper = styled.div`
  background-color: ${(props) => props.type === 'dark' ? palette('light', 0) : 'transparent'};
  padding: ${(props) => props.seamless ? '30px 30px 20px 0' : '30px 30px'};
`;

export default FieldGroupWrapper;

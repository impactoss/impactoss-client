import styled from 'styled-components';
import { palette } from 'styled-theme';

const FieldGroupWrapper = styled.div`
  background-color: ${(props) => props.type === 'dark' ? palette('light', 0) : 'transparent'};
  padding: ${(props) => props.seemless ? '20px 40px 20px 0' : '20px 40px'};
`;

export default FieldGroupWrapper;

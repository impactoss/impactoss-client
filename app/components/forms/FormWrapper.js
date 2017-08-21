import styled from 'styled-components';
import { palette } from 'styled-theme';

const FormWrapper = styled.div`
  box-shadow: ${(props) => props.withoutShadow ? 0 : '0px 0px 15px 0px rgba(0,0,0,0.2)'};
  background-color: ${(props) => props.white ? palette('primary', 4) : palette('light', 0)};
`;
export default FormWrapper;

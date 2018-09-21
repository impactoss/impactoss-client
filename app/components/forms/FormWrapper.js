import styled from 'styled-components';
import { palette } from 'styled-theme';

const FormWrapper = styled.div`
  box-shadow: ${(props) => props.withoutShadow ? 'none' : '0px 0px 15px 0px rgba(0,0,0,0.2)'};
  background-color: ${(props) => props.white ? palette('background', 0) : palette('background', 1)};
  margin-bottom: ${(props) => props.hasMarginBottom ? 200 : 0}px;
`;
export default FormWrapper;

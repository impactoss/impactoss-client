import styled from 'styled-components';
import { palette } from 'styled-theme';

const FormWrapper = styled.div`
  box-shadow: ${(props) => props.hasShadow ? '0px 0px 15px 0px rgba(0,0,0,0.2)' : 0};
  background-color: ${palette('light', 0)};
`;
export default FormWrapper;
